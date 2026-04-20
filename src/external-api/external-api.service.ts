import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
  private readonly apiKey = '059df0a4224813eee09a7ca13f599880';
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private readonly httpService: HttpService) {}

  async getWeather(city: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
          },
          timeout: 5000, 
        })
      );

      return {
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}