import { UserInterface } from 'interfaces/user';
import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface ReservationInterface {
  id?: string;
  start_time: any;
  end_time: any;
  car_renter_id: string;
  vehicle_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  vehicle?: VehicleInterface;
  _count?: {};
}

export interface ReservationGetQueryInterface extends GetQueryInterface {
  id?: string;
  car_renter_id?: string;
  vehicle_id?: string;
}
