
// --- 1. Сутності Бази Даних (Database Entities) ---

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  expiryDate: string | Date; // Рядок з форми або об'єкт Date з бази
  ownerId: string;
  createdAt?: Date;
}

export interface Message {
  id?: string;
  role: 'user' | 'assistant' | "model";
  content: string;
  createdAt?: Date;
}

// --- 2. Розширення типів NextAuth (Module Augmentation) ---
// Це позбавляє нас від 'any' при зверненні до session.user.id або token.id


// --- 3. Типи для створення даних (Utility Types) ---

export type NewProduct = Omit<Product, 'id' | 'createdAt'>;
export type NewUser = Omit<User, 'id' | 'createdAt'>;

// --- 4. Стейт-інтерфейси Zustand (Store States) ---

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearChat: () => void;
}