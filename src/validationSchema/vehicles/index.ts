import * as yup from 'yup';
import { maintenanceValidationSchema } from 'validationSchema/maintenances';
import { reservationValidationSchema } from 'validationSchema/reservations';

export const vehicleValidationSchema = yup.object().shape({
  make: yup.string().required(),
  model: yup.string().required(),
  year: yup.number().integer().required(),
  location: yup.string().required(),
  availability: yup.boolean().required(),
  organization_id: yup.string().nullable().required(),
  maintenance: yup.array().of(maintenanceValidationSchema),
  reservation: yup.array().of(reservationValidationSchema),
});
