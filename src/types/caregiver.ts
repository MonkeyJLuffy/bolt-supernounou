export interface Caregiver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  hourlyRate: number;
  dailyRate: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  maxChildren: number;
  experience: number;
  qualifications: string[];
  bio?: string;
  profileImage?: string;
  createdAt: Date;
}

export interface CaregiverService {
  getCaregiverById: (caregiverId: string) => Promise<Caregiver | null>;
  getCaregiversByChildId: (childId: string) => Promise<Caregiver[]>;
  getAllCaregivers: () => Promise<Caregiver[]>;
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => Promise<Caregiver>;
  updateCaregiver: (caregiverId: string, caregiver: Partial<Caregiver>) => Promise<Caregiver>;
  deleteCaregiver: (caregiverId: string) => Promise<boolean>;
} 