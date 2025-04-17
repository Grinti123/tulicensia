import { create } from 'zustand';
import { ProceduresState, Procedure } from '../types/store';
import { API_ENDPOINTS } from '../constants/api';

const initialState: ProceduresState = {
  availableProcedures: [],
  upcomingProcedures: [],
  selectedProcedure: null,
  isLoading: false,
  error: null,
};

export const useProceduresStore = create<ProceduresState & {
  fetchAvailableProcedures: () => Promise<void>;
  fetchUpcomingProcedures: () => Promise<void>;
  selectProcedure: (procedure: Procedure) => void;
  clearSelectedProcedure: () => void;
  clearError: () => void;
}>()((set) => ({
  ...initialState,

  fetchAvailableProcedures: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.procedures.available);

      if (!response.ok) {
        throw new Error('Failed to fetch available procedures');
      }

      const data = await response.json();
      set({
        availableProcedures: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchUpcomingProcedures: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.procedures.upcoming);

      if (!response.ok) {
        throw new Error('Failed to fetch upcoming procedures');
      }

      const data = await response.json();
      set({
        upcomingProcedures: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  selectProcedure: (procedure: Procedure) => {
    set({ selectedProcedure: procedure });
  },

  clearSelectedProcedure: () => {
    set({ selectedProcedure: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
