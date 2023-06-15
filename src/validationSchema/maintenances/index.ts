import * as yup from 'yup';

export const maintenanceValidationSchema = yup.object().shape({
  maintenance_type: yup.string().required(),
  date: yup.date().required(),
  notes: yup.string(),
  vehicle_id: yup.string().nullable().required(),
});
