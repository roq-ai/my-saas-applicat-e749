import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface MaintenanceInterface {
  id?: string;
  maintenance_type: string;
  date: any;
  notes?: string;
  vehicle_id: string;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface MaintenanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  maintenance_type?: string;
  notes?: string;
  vehicle_id?: string;
}
