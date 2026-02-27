
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
  expiryDate: string | Date; 
  ownerId: string;
  createdAt?: Date;
}

export interface Message {
  id?: string;
  role: 'user' | 'assistant' | "model";
  content: string;
  createdAt?: Date;
}


export type NewProduct = Omit<Product, 'id' | 'createdAt'>;
export type NewUser = Omit<User, 'id' | 'createdAt'>;



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