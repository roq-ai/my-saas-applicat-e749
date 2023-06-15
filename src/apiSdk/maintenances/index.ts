import axios from 'axios';
import queryString from 'query-string';
import { MaintenanceInterface, MaintenanceGetQueryInterface } from 'interfaces/maintenance';
import { GetQueryInterface } from '../../interfaces';

export const getMaintenances = async (query?: MaintenanceGetQueryInterface) => {
  const response = await axios.get(`/api/maintenances${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMaintenance = async (maintenance: MaintenanceInterface) => {
  const response = await axios.post('/api/maintenances', maintenance);
  return response.data;
};

export const updateMaintenanceById = async (id: string, maintenance: MaintenanceInterface) => {
  const response = await axios.put(`/api/maintenances/${id}`, maintenance);
  return response.data;
};

export const getMaintenanceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/maintenances/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMaintenanceById = async (id: string) => {
  const response = await axios.delete(`/api/maintenances/${id}`);
  return response.data;
};
