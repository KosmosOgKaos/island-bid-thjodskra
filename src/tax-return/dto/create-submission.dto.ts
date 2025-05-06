import { ApiProperty } from '@nestjs/swagger';
import { BaseIncomeDto, BasePropertyDto, BaseDebtDto } from './base.dto';
import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto extends BaseIncomeDto {}
export class CreatePropertyDto extends BasePropertyDto {}
export class CreateDebtDto extends BaseDebtDto {}

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'List of incomes to be reported in this submission',
    type: [CreateIncomeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIncomeDto)
  incomes: CreateIncomeDto[];

  @ApiProperty({
    description: 'List of properties to be reported in this submission',
    type: [CreatePropertyDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDto)
  properties: CreatePropertyDto[];

  @ApiProperty({
    description: 'List of debts to be reported in this submission',
    type: [CreateDebtDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDebtDto)
  debts: CreateDebtDto[];
}
