import * as yup from 'yup';
import { vehicleValidationSchema } from 'validationSchema/vehicles';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  vehicle: yup.array().of(vehicleValidationSchema),
});
