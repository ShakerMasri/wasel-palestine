import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckpointDto {
    @ApiProperty({
        type: String,
        example: 'حاجز بيت فوريك',
        description: 'Name of the checkpoint',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({
        type: String,
        example: 'بجانب مدخل القرية الرئيسي',
        description: 'Additional location details',
    })
    @IsOptional()
    @IsString()
    location_description?: string;

    @ApiProperty({
        type: Number,
        example: 32.1844,
        description: 'Latitude of the checkpoint',
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(-90)
    @Max(90)
    latitude!: number;

    @ApiProperty({
        type: Number,
        example: 35.3122,
        description: 'Longitude of the checkpoint',
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(-180)
    @Max(180)
    longitude!: number;

    @ApiProperty({
        type: String,
        example: 'Permanent',
        description: 'Type of checkpoint (Permanent, Flying, etc.)',
    })
    @IsString()
    @IsNotEmpty()
    type!: string;

    @ApiPropertyOptional({
        type: String,
        example: 'Active',
        description: 'Current status of the checkpoint',
    })
    @IsOptional()
    @IsString()
    status?: string;
}