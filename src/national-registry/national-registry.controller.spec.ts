import { Test, TestingModule } from '@nestjs/testing';
import { NationalRegistryController } from './national-registry.controller';
import { NationalRegistryService } from './national-registry.service';
import { NotFoundException } from '@nestjs/common';
import { PersonDto } from './dto/person.dto';

const mockPerson = {
  kennitala: '1234567890',
  name: 'Jón Jónsson',
  address: 'Jónsvegur 202',
  email: 'jon@bingo.is',
  telephone: '8221429',
};

const mockNationalRegistryService = {
  findByKennitala: jest.fn(),
};

describe('NationalRegistryController', () => {
  let controller: NationalRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NationalRegistryController],
      providers: [
        {
          provide: NationalRegistryService,
          useValue: mockNationalRegistryService,
        },
      ],
    }).compile();

    controller = module.get<NationalRegistryController>(
      NationalRegistryController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByKennitala', () => {
    it('should return a PersonDto when a person is found', async () => {
      const kennitala = '1234567890';
      mockNationalRegistryService.findByKennitala.mockResolvedValue(mockPerson);

      const result: PersonDto | null =
        await controller.findByKennitala(kennitala);

      expect(mockNationalRegistryService.findByKennitala).toHaveBeenCalledWith(
        kennitala,
      );
      expect(result).toEqual({
        name: mockPerson.name,
        kennitala: mockPerson.kennitala,
        address: mockPerson.address,
        email: mockPerson.email,
        telephone: mockPerson.telephone,
      });
    });

    it('should throw NotFoundException if person is not found', async () => {
      const kennitala = '0000000000';
      mockNationalRegistryService.findByKennitala.mockResolvedValue(null);

      await expect(controller.findByKennitala(kennitala)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findByKennitala(kennitala)).rejects.toThrow(
        `Person with kennitala ${kennitala} not found`,
      );
      expect(mockNationalRegistryService.findByKennitala).toHaveBeenCalledWith(
        kennitala,
      );
    });
  });
});
