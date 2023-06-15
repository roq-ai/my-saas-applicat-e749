import { MaintenanceInterface } from 'interfaces/maintenance';
import { ReservationInterface } from 'interfaces/reservation';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface VehicleInterface {
  id?: string;
  make: string;
  model: string;
  year: number;
  location: string;
  availability: boolean;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  maintenance?: MaintenanceInterface[];
  reservation?: ReservationInterface[];
  organization?: OrganizationInterface;
  _count?: {
    maintenance?: number;
    reservation?: number;
  };
}

export interface VehicleGetQueryInterface extends GetQueryInterface {
  id?: string;
  make?: string;
  model?: string;
  location?: string;
  organization_id?: string;
}
