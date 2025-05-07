import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Person } from '../../generated/prisma';

@Injectable()
export class NationalRegistryService {
  constructor(private prisma: PrismaService) {}

  findByKennitala(kennitala: string): Promise<Person | null> {
    return this.prisma.person.findUnique({
      where: {
        kennitala,
      },
    });
  }

  // Add your service methods here
}
