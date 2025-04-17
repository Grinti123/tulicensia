import { Procedure } from './procedures';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface ProceduresState {
  availableProcedures: Procedure[];
  upcomingProcedures: Procedure[];
  selectedProcedure: Procedure | null;
  isLoading: boolean;
  error: string | null;
}

export interface FormState {
  currentStep: number;
  formData: Record<string, any>;
  isSubmitting: boolean;
  error: string | null;
}

export interface GlobalState {
  auth: AuthState;
  procedures: ProceduresState;
  form: FormState;
}
