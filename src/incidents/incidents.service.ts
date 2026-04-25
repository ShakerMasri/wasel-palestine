import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../reports/entities/incident.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepo: Repository<Incident>,
    @InjectRepository(Checkpoint)
    private checkpointRepo: Repository<Checkpoint>,
    @InjectRepository(CheckpointHistory)
    private historyRepo: Repository<CheckpointHistory>,
    // Inject event emitter to trigger alerts when a new incident is created (Feature 4)
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new incident, update checkpoint status, and trigger alerts for subscribers
   */
  async create(data: any, userId: number) {
    // 1. Update the current status of the related checkpoint (Feature 1)
    await this.checkpointRepo.update(data.checkpointId, {
      currentStatus: data.status,
    });

    // 2. Record the change in checkpoint status history
    await this.historyRepo.save({
      checkpointId: data.checkpointId,
      status: data.status,
      userId: userId,
      note: data.description,
    });

    // 3. Save the incident report in the database
    const incident = await this.incidentRepo.save({
      description: data.description,
      checkpointId: data.checkpointId,
      userId: userId,
      type: data.status, // incident type (e.g., closure, delay)
      severity: data.severity || 'Normal',
    });

    // 4. Emit "incident verified" event (Feature 4)
    // This event will be handled by AlertsService to notify subscribed users in the region
    this.eventEmitter.emit('incident.verified', {
      region: data.region, // region used for matching
      category: data.status, // category used for matching
      description: data.description,
    });

    return incident;
  }

  /**
   * Retrieve all incidents with filtering and pagination support
   */
  async findAll(query: any) {
    const {
      type,
      severity,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

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
      },
    };
  }

  /**
   * Update an existing incident
   */
  async update(id: number, updateData: any) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    Object.assign(incident, updateData);
    return await this.incidentRepo.save(incident);
  }

  /**
   * Delete an incident from the system
   */
  async remove(id: number) {
    const incident = await this.incidentRepo.findOne({ where: { id } });

    if (!incident) {
      throw new NotFoundException('Sorry, this incident does not exist to be deleted!');
    }

    await this.incidentRepo.remove(incident);

    return {
      message: `Incident with ID ${id} has been successfully deleted from the system`,
      deletedId: id,
    };
  }
}