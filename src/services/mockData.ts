import { Child } from '../types/child';
import { Caregiver } from '../types/caregiver';
import { Absence, DayStatus } from '../types/calendar';
import { Message } from '../types/message';

// Données simulées pour les enfants
export const mockChildren: Child[] = [
  {
    id: 'child-1',
    name: 'Emma',
    age: 3,
    parentId: 'simulated-parent-marie-id',
    caregiverId: 'simulated-nounou-id',
    birthDate: '2020-05-15',
    allergies: ['Arachides'],
    notes: 'Aime les histoires avant la sieste'
  },
  {
    id: 'child-2',
    name: 'Lucas',
    age: 5,
    parentId: 'simulated-parent-thomas-id',
    caregiverId: 'simulated-nounou-id',
    birthDate: '2018-11-23',
    allergies: [],
    notes: 'Très actif, a besoin de beaucoup d\'activités physiques'
  }
];

// Données simulées pour les nounous
export const mockCaregivers: Caregiver[] = [
  {
    id: 'simulated-nounou-id',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@gmail.com',
    phone: '0612345678',
    address: '15 rue des Lilas, 75001 Paris',
    hourlyRate: 9.50,
    dailyRate: 3.20,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    maxChildren: 3,
    experience: 8,
    qualifications: ['CAP Petite Enfance', 'Formation Montessori'],
    bio: 'Assistante maternelle depuis 8 ans, j\'aime les activités créatives et la nature.'
  }
];

// Données simulées pour les absences
export const mockAbsences: Absence[] = [
  {
    id: 'absence-1',
    childId: 'child-1',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-04-08',
    endDate: '2024-04-09',
    status: 'approved',
    type: 'caregiver',
    reason: 'Congé maladie',
    notes: 'Grippe',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-16T14:20:00Z'
  },
  {
    id: 'absence-2',
    childId: 'child-1',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-04-16',
    endDate: '2024-04-17',
    status: 'pending',
    type: 'child',
    reason: 'Vacances familiales',
    notes: 'Voyage en famille',
    createdAt: '2024-03-20T09:15:00Z',
    updatedAt: '2024-03-20T09:15:00Z'
  },
  {
    id: 'absence-3',
    childId: 'child-1',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-04-21',
    endDate: '2024-04-21',
    status: 'approved',
    type: 'caregiver',
    reason: 'Congé assistante maternelle',
    notes: 'Formation continue',
    createdAt: '2024-03-10T11:45:00Z',
    updatedAt: '2024-03-11T16:30:00Z'
  },
  {
    id: 'absence-4',
    childId: 'child-1',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-04-25',
    endDate: '2024-04-25',
    status: 'approved',
    type: 'child',
    reason: 'Rendez-vous médical',
    notes: 'Consultation pédiatrique',
    createdAt: '2024-03-18T13:20:00Z',
    updatedAt: '2024-03-19T10:15:00Z'
  },
  {
    id: 'absence-5',
    childId: 'child-2',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-05-08',
    endDate: '2024-05-09',
    status: 'approved',
    type: 'child',
    reason: 'Vacances familiales',
    notes: 'Voyage en famille',
    createdAt: '2024-03-22T14:30:00Z',
    updatedAt: '2024-03-23T09:45:00Z'
  },
  {
    id: 'absence-6',
    childId: 'child-2',
    caregiverId: 'simulated-nounou-id',
    startDate: '2024-05-14',
    endDate: '2024-05-15',
    status: 'approved',
    type: 'caregiver',
    reason: 'Congé assistante maternelle',
    notes: 'Formation continue',
    createdAt: '2024-03-12T10:20:00Z',
    updatedAt: '2024-03-13T11:30:00Z'
  }
];

// Données simulées pour les messages
export const mockMessages: Message[] = [
  {
    id: 'message-1',
    content: "Bonjour ! Emma a bien mangé aujourd'hui, elle a fait une sieste de 2h.",
    senderId: 'simulated-nounou-id',
    receiverId: 'simulated-parent-marie-id',
    childId: 'child-1',
    timestamp: '2024-04-02T16:30:00Z',
    read: true
  },
  {
    id: 'message-2',
    content: "Merci pour l'info Marie, a-t-elle pris son goûter aussi ?",
    senderId: 'simulated-parent-marie-id',
    receiverId: 'simulated-nounou-id',
    childId: 'child-1',
    timestamp: '2024-04-02T16:32:00Z',
    read: true
  },
  {
    id: 'message-3',
    content: 'Oui, elle a mangé un yaourt et des fruits.',
    senderId: 'simulated-nounou-id',
    receiverId: 'simulated-parent-marie-id',
    childId: 'child-1',
    timestamp: '2024-04-02T16:33:00Z',
    read: true
  },
  {
    id: 'message-4',
    content: 'Parfait, merci beaucoup !',
    senderId: 'simulated-parent-marie-id',
    receiverId: 'simulated-nounou-id',
    childId: 'child-1',
    timestamp: '2024-04-02T16:34:00Z',
    read: true
  },
  {
    id: 'message-5',
    content: "Lucas a passé une excellente journée, il a beaucoup joué avec les autres enfants.",
    senderId: 'simulated-nounou-id',
    receiverId: 'simulated-parent-thomas-id',
    childId: 'child-2',
    timestamp: '2024-04-02T17:15:00Z',
    read: true
  },
  {
    id: 'message-6',
    content: "Merci Marie, a-t-il fait ses devoirs ?",
    senderId: 'simulated-parent-thomas-id',
    receiverId: 'simulated-nounou-id',
    childId: 'child-2',
    timestamp: '2024-04-02T17:20:00Z',
    read: true
  },
  {
    id: 'message-7',
    content: "Oui, il a fait ses exercices de lecture et d'écriture.",
    senderId: 'simulated-nounou-id',
    receiverId: 'simulated-parent-thomas-id',
    childId: 'child-2',
    timestamp: '2024-04-02T17:22:00Z',
    read: true
  }
];

// Fonction pour obtenir le statut d'un jour en fonction des absences
export const getDayStatusFromAbsences = (date: Date, childId: string, caregiverId: string): DayStatus => {
  const dateStr = date.toISOString().split('T')[0];
  
  const absence = mockAbsences.find(a => {
    const startDate = new Date(a.startDate);
    const endDate = new Date(a.endDate);
    const currentDate = new Date(dateStr);
    
    return (
      a.childId === childId && 
      a.caregiverId === caregiverId && 
      currentDate >= startDate && 
      currentDate <= endDate
    );
  });
  
  if (!absence) return null;
  
  if (absence.type === 'caregiver') {
    if (absence.reason.includes('maladie')) return 'conge-maladie';
    if (absence.reason.includes('assistante maternelle')) return 'conge-am';
  } else {
    if (absence.status === 'approved') return 'absence-validee';
    if (absence.status === 'pending') return 'absence-prevue';
  }
  
  return null;
}; 