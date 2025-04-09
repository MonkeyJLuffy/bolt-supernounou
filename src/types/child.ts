export interface Child {
  id: string;
  name: string;
  age: number;
  parentId: string;
  caregiverId: string;
  birthDate: Date;
  createdAt: Date;
  allergies?: string[];
  notes?: string;
}

export interface ChildService {
  getChildrenByParentId: (parentId: string) => Promise<Child[]>;
  getChildById: (childId: string) => Promise<Child | null>;
  addChild: (child: Omit<Child, 'id'>) => Promise<Child>;
  updateChild: (childId: string, child: Partial<Child>) => Promise<Child>;
  deleteChild: (childId: string) => Promise<boolean>;
} 