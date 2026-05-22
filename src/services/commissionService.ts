import api from './api';
import { type CommissionsResponse } from '../interfaces/Commission';

export const commissionService = {
  getCommissionsReport: async (startDate: string, endDate: string): Promise<CommissionsResponse> => {
    const response = await api.get<CommissionsResponse>('/sellers/commissions_report/', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    return {
      vendedores: response.data?.vendedores ?? [],
      total_commission_period: response.data?.total_commission_period ?? 0
    };
  }
};