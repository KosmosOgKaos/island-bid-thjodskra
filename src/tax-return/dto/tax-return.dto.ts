import { ApiProperty } from '@nestjs/swagger';
import {
  BaseIncomeDto,
  BasePropertyDto,
  BaseDebtDto,
  BaseSubmissionDto,
} from './base.dto';

export class PersonDto {
  @ApiProperty({ description: 'The name of the person' })
  name: string;

  @ApiProperty({ description: 'The Icelandic national ID number (kennitala)' })
  kennitala: string;

  @ApiProperty({ description: 'The address of the person' })
  address: string;

  @ApiProperty({ description: 'The email address of the person' })
  email: string;

  @ApiProperty({
    description: 'The telephone number of the person',
    required: false,
  })
  telephone?: string;

  @ApiProperty({ description: 'The date when the person record was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the person record was last updated',
  })
  updatedAt: Date;
}

export class IncomeDto extends BaseIncomeDto {
  @ApiProperty({ description: 'The date when the income record was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the income record was last updated',
  })
  updatedAt: Date;
}

export class PropertyDto extends BasePropertyDto {
  @ApiProperty({ description: 'The date when the property record was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the property record was last updated',
  })
  updatedAt: Date;
}

export class DebtDto extends BaseDebtDto {
  @ApiProperty({ description: 'The date when the debt record was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the debt record was last updated',
  })
  updatedAt: Date;
}

export class SubmissionDto extends BaseSubmissionDto {
  @ApiProperty({
    description: 'List of incomes reported in this submission',
    type: [IncomeDto],
  })
  incomes: IncomeDto[];

  @ApiProperty({
    description: 'List of properties reported in this submission',
    type: [PropertyDto],
  })
  properties: PropertyDto[];

  @ApiProperty({
    description: 'List of debts reported in this submission',
    type: [DebtDto],
  })
  debts: DebtDto[];

  @ApiProperty({ description: 'The date when the submission was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the submission was last updated' })
  updatedAt: Date;
}
