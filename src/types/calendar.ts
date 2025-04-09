export type DayStatus = 'conge-am' | 'absence-prevue' | 'absence-validee' | 'conge-maladie' | 'selected' | null;

export interface DayData {
  date: Date;
  status: DayStatus;
  childId: string;
  caregiverId: string;
  notes?: string;
}

export interface Absence {
  id: string;
  childId: string;
  caregiverId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'child' | 'caregiver';
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarService {
  getAbsencesByChildId: (childId: string) => Promise<Absence[]>;
  getAbsencesByCaregiverId: (caregiverId: string) => Promise<Absence[]>;
  getAbsenceById: (absenceId: string) => Promise<Absence | null>;
  addAbsence: (absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Absence>;
  updateAbsence: (absenceId: string, absence: Partial<Absence>) => Promise<Absence>;
  deleteAbsence: (absenceId: string) => Promise<boolean>;
  getDayStatus: (date: Date, childId: string, caregiverId: string) => Promise<DayStatus>;
} 