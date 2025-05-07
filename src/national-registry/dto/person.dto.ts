import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
  @ApiProperty({ description: 'Full name of the person' })
  name: string;

  @ApiProperty({ description: 'Icelandic national ID number' })
  kennitala: string;

  @ApiProperty({ description: 'Current address' })
  address: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Telephone number', required: false })
  telephone?: string;
} 