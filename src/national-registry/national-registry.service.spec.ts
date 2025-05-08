import { Test, TestingModule } from '@nestjs/testing';
import { NationalRegistryService } from './national-registry.service';
import { PrismaService } from '../prisma/prisma.service';
import { Person } from '../../generated/prisma';

const mockPerson: Person = {
  id: 1,
  kennitala: '1234567890',
  name: 'Jón Jónsson',
  address: 'Jónshagi 1',
  email: 'jon@bulbasaur.is',
  telephone: '8221429',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  person: {
    findUnique: jest.fn(),
  },
};

describe('NationalRegistryService', () => {
  let service: NationalRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NationalRegistryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NationalRegistryService>(NationalRegistryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByKennitala', () => {
    it('should call prisma.person.findUnique with the correct kennitala and return a person if found', async () => {
      const kennitala = '1234567890';
      mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);

      const result = await service.findByKennitala(kennitala);

      expect(mockPrismaService.person.findUnique).toHaveBeenCalledWith({
        where: { kennitala },
      });
      expect(result).toEqual(mockPerson);
    });

    it('should call prisma.person.findUnique and return null if person is not found', async () => {
      const kennitala = '0000000000';
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      const result = await service.findByKennitala(kennitala);

      expect(mockPrismaService.person.findUnique).toHaveBeenCalledWith({
        where: { kennitala },
      });
      expect(result).toBeNull();
    });
  });
});
