import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

type Point = {
  latitude: number;
  longitude: number;
};

type WeatherResult = {
  provider: 'openweathermap';
  city: string;
  temp: number;
  description: string;
  humidity: number;
  metadata: {
    cached: boolean;
    units: 'metric';
  };
};

export type ExternalRouteResult = {
  provider: 'openrouteservice';
  distanceKm: number;
  durationMinutes: number;
  rawDistanceMeters: number;
  rawDurationSeconds: number;
  metadata: {
    cached: boolean;
    profile: 'driving-car';
  };
};

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  private readonly weatherBaseUrl =
    'https://api.openweathermap.org/data/2.5/weather';

  private readonly routingBaseUrl =
    'https://api.openrouteservice.org/v2/directions/driving-car';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getWeather(city: string): Promise<WeatherResult> {
    const normalizedCity = city.trim().toLowerCase();
    const cacheKey = `weather:${normalizedCity}`;

    const cached = await this.cacheManager.get<WeatherResult>(cacheKey);

    if (cached) {
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cached: true,
        },
      };
    }

    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');

    if (!apiKey) {
      throw new HttpException(
        'OpenWeather API key is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.weatherBaseUrl, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
          },
          timeout: this.getTimeoutMs(),
        }),
      );

      const result: WeatherResult = {
        provider: 'openweathermap',
        city: response.data.name ?? city,
        temp: response.data.main.temp,
        description: response.data.weather?.[0]?.description ?? 'unknown',
        humidity: response.data.main.humidity,
        metadata: {
          cached: false,
          units: 'metric',
        },
      };

      await this.cacheManager.set(
        cacheKey,
        result,
        this.getWeatherCacheTtlMs(),
      );

      return result;
    } catch (error) {
      this.logger.error('Failed to fetch weather data', error);

      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getDrivingRoute(
    start: Point,
    end: Point,
    throwOnFailure = false,
  ): Promise<ExternalRouteResult | null> {
    const apiKey = this.configService.get<string>('OPENROUTESERVICE_API_KEY');

    if (!apiKey) {
      if (throwOnFailure) {
        throw new HttpException(
          'OpenRouteService API key is missing',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.warn('OpenRouteService API key is missing. Using fallback.');
      return null;
    }

    const cacheKey = this.buildRouteCacheKey(start, end);
    const cached = await this.cacheManager.get<ExternalRouteResult>(cacheKey);

    if (cached) {
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cached: true,
        },
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.routingBaseUrl,
          {
            coordinates: [
              [start.longitude, start.latitude],
              [end.longitude, end.latitude],
            ],
            instructions: false,
          },
          {
            headers: {
              Authorization: apiKey,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            timeout: this.getTimeoutMs(),
          },
        ),
      );

      const route = response.data.routes?.[0];
      const summary = route?.summary;

      if (!summary || summary.distance == null || summary.duration == null) {
        throw new Error('Invalid OpenRouteService response');
      }

      const result: ExternalRouteResult = {
        provider: 'openrouteservice',
        distanceKm: this.round(summary.distance / 1000),
        durationMinutes: this.round(summary.duration / 60),
        rawDistanceMeters: summary.distance,
        rawDurationSeconds: summary.duration,
        metadata: {
          cached: false,
          profile: 'driving-car',
        },
      };

      await this.cacheManager.set(
        cacheKey,
        result,
        this.getRoutingCacheTtlMs(),
      );

      return result;
    } catch (error) {
      this.logger.error('Failed to fetch routing data', error);

      if (throwOnFailure) {
        throw new HttpException(
          'Failed to fetch routing data',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return null;
    }
  }

  private buildRouteCacheKey(start: Point, end: Point): string {
    return [
      'route',
      'ors',
      start.latitude.toFixed(5),
      start.longitude.toFixed(5),
      end.latitude.toFixed(5),
      end.longitude.toFixed(5),
    ].join(':');
  }

  private getTimeoutMs(): number {
    return Number(
      this.configService.get<string>('EXTERNAL_API_TIMEOUT_MS') ?? 5000,
    );
  }

  private getWeatherCacheTtlMs(): number {
    return Number(
      this.configService.get<string>('WEATHER_CACHE_TTL_MS') ?? 1800000,
    );
  }

  private getRoutingCacheTtlMs(): number {
    return Number(
      this.configService.get<string>('ROUTING_CACHE_TTL_MS') ?? 1800000,
    );
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }
}
