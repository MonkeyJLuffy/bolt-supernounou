export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  childId: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface MessageService {
  getMessagesByChildId: (childId: string) => Promise<Message[]>;
  getMessagesBetweenUsers: (userId1: string, userId2: string, childId: string) => Promise<Message[]>;
  getMessageById: (messageId: string) => Promise<Message | null>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => Promise<Message>;
  markAsRead: (messageId: string) => Promise<Message>;
  deleteMessage: (messageId: string) => Promise<boolean>;
} 