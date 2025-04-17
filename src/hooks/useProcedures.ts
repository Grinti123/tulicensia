import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { Procedure } from '../types/store';

export const useProcedures = () => {
  const availableProceduresQuery = useQuery<Procedure[]>({
    queryKey: ['procedures', 'available'],
    queryFn: () => apiService.get(API_ENDPOINTS.procedures.available),
  });

  const upcomingProceduresQuery = useQuery<Procedure[]>({
    queryKey: ['procedures', 'upcoming'],
    queryFn: () => apiService.get(API_ENDPOINTS.procedures.upcoming),
  });

  return {
    availableProcedures: availableProceduresQuery.data || [],
    upcomingProcedures: upcomingProceduresQuery.data || [],
    isLoading: availableProceduresQuery.isLoading || upcomingProceduresQuery.isLoading,
    error: availableProceduresQuery.error || upcomingProceduresQuery.error,
  };
};
