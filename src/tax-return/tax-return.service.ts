import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Submission } from './types/submission.types';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionStatus } from './types/enums';

@Injectable()
export class TaxReturnService {
  private readonly logger = new Logger(TaxReturnService.name);

  constructor(private readonly prisma: PrismaService) {}

  getTaxReturn(): string {
    return 'Tax return data';
  }

  async getLatestSubmission(kennitala: string): Promise<Submission | null> {
    try {
      this.logger.debug(
        `Fetching latest submission for kennitala: ${kennitala}`,
      );
      const person = await this.prisma.person.findUnique({
        where: { kennitala },
        include: {
          submissions: {
            orderBy: { index: 'desc' },
            take: 1,
            include: {
              person: true,
              incomes: true,
              properties: true,
              debts: true,
            },
          },
        },
      });

      if (!person) {
        this.logger.warn(`Person not found with kennitala: ${kennitala}`);
        throw new NotFoundException('Person not found');
      }

      return person.submissions[0] ?? null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error getting latest submission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async createSubmission(
    kennitala: string,
    data: CreateSubmissionDto,
  ): Promise<Submission> {
    try {
      this.logger.debug(`Creating new submission for kennitala: ${kennitala}`);
      // Get the latest submission index for this person
      const latestSubmission = await this.prisma.submission.findFirst({
        where: { person: { kennitala } },
        orderBy: { index: 'desc' },
      });

      const nextIndex = (latestSubmission?.index ?? 0) + 1;
      const currentYear = new Date().getFullYear();

      // Create the submission with all related data
      const submission = await this.prisma.submission.create({
        data: {
          year: currentYear,
          status: SubmissionStatus.Submitted,
          index: nextIndex,
          person: {
            connect: { kennitala },
          },
          incomes: {
            create: data.incomes,
          },
          properties: {
            create: data.properties,
          },
          debts: {
            create: data.debts,
          },
        },
        include: {
          person: true,
          incomes: true,
          properties: true,
          debts: true,
        },
      });

      this.logger.debug(
        `Successfully created submission with ID: ${submission.id}`,
      );
      return submission;
    } catch (error) {
      this.logger.error(
        `Error creating submission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async finishLatestSubmission(kennitala: string): Promise<Submission> {
    try {
      this.logger.debug(
        `Finishing latest submission for kennitala: ${kennitala}`,
      );
      const latestSubmission = await this.prisma.submission.findFirst({
        where: { person: { kennitala } },
        orderBy: { index: 'desc' },
        include: {
          person: true,
          incomes: true,
          properties: true,
          debts: true,
        },
      });

      if (!latestSubmission) {
        this.logger.warn(`No submission found for kennitala: ${kennitala}`);
        throw new NotFoundException('No submission found for this person');
      }

      const updatedSubmission = await this.prisma.submission.update({
        where: { id: latestSubmission.id },
        data: { status: SubmissionStatus.Finished },
        include: {
          person: true,
          incomes: true,
          properties: true,
          debts: true,
        },
      });

      this.logger.debug(
        `Successfully finished submission with ID: ${updatedSubmission.id}`,
      );
      return updatedSubmission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error finishing submission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}