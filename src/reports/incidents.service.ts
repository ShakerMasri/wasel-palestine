


import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity'; // نقطة واحدة لأنه الـ entities بنفس المجلد
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()

export class IncidentsService {
    constructor(
        @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
        @InjectRepository(Checkpoint) private checkpointRepo: Repository<Checkpoint>,
        @InjectRepository(CheckpointHistory) private historyRepo: Repository<CheckpointHistory>,
        private readonly httpService: HttpService

    ) { }


    async getAddressFromCoords(lat: number, lon: number): Promise<string> {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: { 'User-Agent': 'WaselPalestine/1.0' },
                    timeout: 5000
                })
            );
            return response.data.display_name || 'Location details not found';
        } catch (error) {
            console.error('External API Error:');

            return 'Address unavailable due to service timeout';
        }
    }

    async create(data: any, userId: number) {
        // تأكدنا إننا بنستخدم data.type اللي جاي من بوستمان
        await this.checkpointRepo.update(data.checkpointId, {
            currentStatus: data.type || 'Unknown'
        });

        await this.historyRepo.save({
            checkpointId: data.checkpointId,
            status: data.type || 'Unknown',
            userId: userId || 1,
            note: data.description
        });

        let locationName = '';
        if (data.lat && data.lon) {
            locationName = await this.getAddressFromCoords(data.lat, data.lon);
            console.log(`📍 New incident location identified: ${locationName}`);
        }

        return await this.incidentRepo.save({
            description: data.description,
            checkpointId: data.checkpointId,
            userId: userId || 1,
            type: data.type, // كانت data.status وغيرناها لـ data.type
            severity: data.severity || 'Normal',
            locationDetails: locationName
        });
    }

    async findAll(query: any) {

        console.log(await this.getAddressFromCoords(32.2227, 35.2621)); // إحداثيات نابلس

        const { type, severity, page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = query;

        const [items, total] = await this.incidentRepo.findAndCount({
            where: {
                type: type ? type : undefined,
                severity: severity ? severity : undefined,
            },
            order: {
                [sortBy]: order.toUpperCase(),
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: items,
            meta: {
                total,
                page: Number(page),
                lastPage: Math.ceil(total / limit),
            }
        };

    }

    async update(id: number, updateData: any) {
        const incident = await this.incidentRepo.findOne({ where: { id } });
        if (!incident) {
            throw new Error('البلاغ غير موجود');
        }

        Object.assign(incident, updateData);

        return await this.incidentRepo.save(incident);
    }


    async remove(id: number) {
        const incident = await this.incidentRepo.findOne({ where: { id } });

        if (!incident) {
            throw new Error('عفواً، هاد البلاغ مش موجود أصلاً عشان أحذفه!');
        }

        await this.incidentRepo.remove(incident);

        return {
            message: `تم حذف البلاغ رقم ${id} بنجاح من النظام`,
            deletedId: id
        };
    }


    async getStats() {
        const totalIncidents = await this.incidentRepo.count();
        const highSeverity = await this.incidentRepo.count({ where: { severity: 'High' } });
        const verifiedIncidents = await this.incidentRepo.count({ where: { isVerified: true } });

        return {
            totalIncidents,
            highSeverity,
            verifiedIncidents,
            systemStatus: "Active",
            lastUpdate: new Date()
        };
    }


}













