import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxReturnService } from './tax-return.service';
import { Submission } from './types/submission.types';
import {
  SubmissionDto,
  IncomeDto,
  PropertyDto,
  DebtDto,
} from './dto/tax-return.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { IncomeType, PropertyType, DebtType, Currency } from './types/enums';
import { PersonDto } from './dto/base.dto';

@ApiTags('Tax Return')
@Controller('/api/tax-return')
export class TaxReturnController {
  constructor(private readonly taxReturnService: TaxReturnService) {}

  @Get(':kennitala/latest')
  @ApiOperation({ summary: 'Get latest submission for a person' })
  @ApiResponse({
    status: 200,
    description: 'Returns the latest submission for a person',
    type: SubmissionDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  async getLatestSubmission(
    @Param('kennitala') kennitala: string,
  ): Promise<SubmissionDto | null> {
    const submission =
      await this.taxReturnService.getLatestSubmission(kennitala);

    return submission ? this.mapToSubmissionDto(submission) : null;
  }

  @Post(':kennitala')
  @ApiOperation({ summary: 'Create a new submission for a person' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created submission',
    type: SubmissionDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  @ApiResponse({ status: 400, description: 'Invalid submission data' })
  async createSubmission(
    @Param('kennitala') kennitala: string,
    @Body() data: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    const submission = await this.taxReturnService.createSubmission(
      kennitala,
      data,
    );
    return this.mapToSubmissionDto(submission);
  }

  @Put(':kennitala/latest/finish')
  @ApiOperation({ summary: 'Mark the latest submission as finished' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated submission',
    type: SubmissionDto,
  })
  @ApiResponse({ status: 404, description: 'Person or submission not found' })
  async finishLatestSubmission(
    @Param('kennitala') kennitala: string,
  ): Promise<SubmissionDto> {
    const submission =
      await this.taxReturnService.finishLatestSubmission(kennitala);

    return this.mapToSubmissionDto(submission);
  }

  private mapToSubmissionDto(submission: Submission): SubmissionDto {
    const personDto: PersonDto = {
      name: submission.person.name,
      kennitala: submission.person.kennitala,
      address: submission.person.address,
      email: submission.person.email,
      telephone: submission.person.telephone || undefined,
      createdAt: submission.person.createdAt,
      updatedAt: submission.person.updatedAt,
    };

    const incomeDtos: IncomeDto[] = submission.incomes.map((income) => ({
      type: income.type as IncomeType,
      payer: income.payer || undefined,
      amount: income.amount,
      currency: income.currency as Currency,
      explanation: income.explanation || undefined,
      createdAt: income.createdAt,
      updatedAt: income.updatedAt,
    }));

    const propertyDtos: PropertyDto[] = submission.properties.map(
      (property) => ({
        type: property.type as PropertyType,
        valueName: property.valueName,
        value: property.value,
        currency: property.currency as Currency,
        properties: (property.properties as Record<string, any>) || undefined,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      }),
    );

    const debtDtos: DebtDto[] = submission.debts.map((debt) => ({
      description: debt.description || undefined,
      type: debt.type as DebtType,
      currency: debt.currency as Currency,
      creditor: debt.creditor || undefined,
      creditorKennitala: debt.creditorKennitala || undefined,
      loanNumber: debt.loanNumber || undefined,
      loanStartDate: debt.loanStartDate || undefined,
      loanDurationYears: debt.loanDurationYears || undefined,
      yearPaymentTotal: debt.yearPaymentTotal || undefined,
      nominalPaymentTotal: debt.nominalPaymentTotal || undefined,
      interestPaymentTotal: debt.interestPaymentTotal,
      remaining: debt.remaining,
      properties: (debt.properties as Record<string, any>) || undefined,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    }));

    return {
      person: personDto,
      incomes: incomeDtos,
      properties: propertyDtos,
      debts: debtDtos,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };
  }
}
