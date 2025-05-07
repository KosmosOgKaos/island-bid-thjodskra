import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { NationalRegistryService } from './national-registry.service';
import { PersonDto } from './dto/person.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('national-registry')
@Controller('/api/national-registry')
export class NationalRegistryController {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Get('person/:kennitala')
  @ApiResponse({ type: PersonDto })
  async findByKennitala(
    @Param('kennitala') kennitala: string,
  ): Promise<PersonDto | null> {
    const person =
      await this.nationalRegistryService.findByKennitala(kennitala);
    if (!person) {
      throw new NotFoundException(
        `Person with kennitala ${kennitala} not found`,
      );
    }

    const {
      name,
      kennitala: personKennitala,
      address,
      email,
      telephone,
    } = person;
    return {
      name,
      kennitala: personKennitala,
      address,
      email,
      telephone: telephone || undefined,
    };
  }
}
