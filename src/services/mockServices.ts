import { Child, ChildService } from '../types/child';
import { Caregiver, CaregiverService } from '../types/caregiver';
import { Absence, CalendarService, DayStatus } from '../types/calendar';
import { Message, MessageService } from '../types/message';
import { mockChildren, mockCaregivers, mockAbsences, mockMessages, getDayStatusFromAbsences } from './mockData';

// Simulation du délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service pour les enfants
export const mockChildService: ChildService = {
  getChildrenByParentId: async (parentId: string): Promise<Child[]> => {
    await delay(300);
    return mockChildren.filter(child => child.parentId === parentId);
  },
  
  getChildById: async (childId: string): Promise<Child | null> => {
    await delay(200);
    const child = mockChildren.find(c => c.id === childId);
    return child || null;
  },
  
  addChild: async (child: Omit<Child, 'id'>): Promise<Child> => {
    await delay(500);
    const newChild: Child = {
      ...child,
      id: `child-${Date.now()}`
    };
    // Dans une vraie implémentation, on ajouterait l'enfant à la base de données
    return newChild;
  },
  
  updateChild: async (childId: string, child: Partial<Child>): Promise<Child> => {
    await delay(400);
    const existingChild = mockChildren.find(c => c.id === childId);
    if (!existingChild) {
      throw new Error(`Enfant avec l'ID ${childId} non trouvé`);
    }
    // Dans une vraie implémentation, on mettrait à jour l'enfant dans la base de données
    return { ...existingChild, ...child };
  },
  
  deleteChild: async (childId: string): Promise<boolean> => {
    await delay(300);
    // Dans une vraie implémentation, on supprimerait l'enfant de la base de données
    return true;
  }
};

// Service pour les nounous
export const mockCaregiverService: CaregiverService = {
  getCaregiverById: async (caregiverId: string): Promise<Caregiver | null> => {
    await delay(200);
    const caregiver = mockCaregivers.find(c => c.id === caregiverId);
    return caregiver || null;
  },
  
  getCaregiversByChildId: async (childId: string): Promise<Caregiver[]> => {
    await delay(300);
    const child = mockChildren.find(c => c.id === childId);
    if (!child) return [];
    
    const caregiver = mockCaregivers.find(c => c.id === child.caregiverId);
    return caregiver ? [caregiver] : [];
  },
  
  getAllCaregivers: async (): Promise<Caregiver[]> => {
    await delay(400);
    return mockCaregivers;
  },
  
  addCaregiver: async (caregiver: Omit<Caregiver, 'id'>): Promise<Caregiver> => {
    await delay(500);
    const newCaregiver: Caregiver = {
      ...caregiver,
      id: `caregiver-${Date.now()}`
    };
    // Dans une vraie implémentation, on ajouterait la nounou à la base de données
    return newCaregiver;
  },
  
  updateCaregiver: async (caregiverId: string, caregiver: Partial<Caregiver>): Promise<Caregiver> => {
    await delay(400);
    const existingCaregiver = mockCaregivers.find(c => c.id === caregiverId);
    if (!existingCaregiver) {
      throw new Error(`Nounou avec l'ID ${caregiverId} non trouvée`);
    }
    // Dans une vraie implémentation, on mettrait à jour la nounou dans la base de données
    return { ...existingCaregiver, ...caregiver };
  },
  
  deleteCaregiver: async (caregiverId: string): Promise<boolean> => {
    await delay(300);
    // Dans une vraie implémentation, on supprimerait la nounou de la base de données
    return true;
  }
};

// Service pour le calendrier
export const mockCalendarService: CalendarService = {
  getAbsencesByChildId: async (childId: string): Promise<Absence[]> => {
    await delay(300);
    return mockAbsences.filter(a => a.childId === childId);
  },
  
  getAbsencesByCaregiverId: async (caregiverId: string): Promise<Absence[]> => {
    await delay(300);
    return mockAbsences.filter(a => a.caregiverId === caregiverId);
  },
  
  getAbsenceById: async (absenceId: string): Promise<Absence | null> => {
    await delay(200);
    const absence = mockAbsences.find(a => a.id === absenceId);
    return absence || null;
  },
  
  addAbsence: async (absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>): Promise<Absence> => {
    await delay(500);
    const now = new Date().toISOString();
    const newAbsence: Absence = {
      ...absence,
      id: `absence-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    // Dans une vraie implémentation, on ajouterait l'absence à la base de données
    return newAbsence;
  },
  
  updateAbsence: async (absenceId: string, absence: Partial<Absence>): Promise<Absence> => {
    await delay(400);
    const existingAbsence = mockAbsences.find(a => a.id === absenceId);
    if (!existingAbsence) {
      throw new Error(`Absence avec l'ID ${absenceId} non trouvée`);
    }
    // Dans une vraie implémentation, on mettrait à jour l'absence dans la base de données
    return { 
      ...existingAbsence, 
      ...absence,
      updatedAt: new Date().toISOString()
    };
  },
  
  deleteAbsence: async (absenceId: string): Promise<boolean> => {
    await delay(300);
    // Dans une vraie implémentation, on supprimerait l'absence de la base de données
    return true;
  },
  
  getDayStatus: async (date: Date, childId: string, caregiverId: string): Promise<DayStatus> => {
    await delay(100);
    return getDayStatusFromAbsences(date, childId, caregiverId);
  }
};

// Service pour les messages
export const mockMessageService: MessageService = {
  getMessagesByChildId: async (childId: string): Promise<Message[]> => {
    await delay(300);
    return mockMessages.filter(m => m.childId === childId);
  },
  
  getMessagesBetweenUsers: async (userId1: string, userId2: string, childId: string): Promise<Message[]> => {
    await delay(400);
    return mockMessages.filter(m => 
      m.childId === childId && 
      ((m.senderId === userId1 && m.receiverId === userId2) || 
       (m.senderId === userId2 && m.receiverId === userId1))
    );
  },
  
  getMessageById: async (messageId: string): Promise<Message | null> => {
    await delay(200);
    const message = mockMessages.find(m => m.id === messageId);
    return message || null;
  },
  
  sendMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> => {
    await delay(300);
    const newMessage: Message = {
      ...message,
      id: `message-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    // Dans une vraie implémentation, on ajouterait le message à la base de données
    return newMessage;
  },
  
  markAsRead: async (messageId: string): Promise<Message> => {
    await delay(200);
    const message = mockMessages.find(m => m.id === messageId);
    if (!message) {
      throw new Error(`Message avec l'ID ${messageId} non trouvé`);
    }
    // Dans une vraie implémentation, on mettrait à jour le message dans la base de données
    return { ...message, read: true };
  },
  
  deleteMessage: async (messageId: string): Promise<boolean> => {
    await delay(300);
    // Dans une vraie implémentation, on supprimerait le message de la base de données
    return true;
  }
}; 