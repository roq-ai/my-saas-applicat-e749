import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMaintenanceById, updateMaintenanceById } from 'apiSdk/maintenances';
import { Error } from 'components/error';
import { maintenanceValidationSchema } from 'validationSchema/maintenances';
import { MaintenanceInterface } from 'interfaces/maintenance';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';

function MaintenanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MaintenanceInterface>(
    () => (id ? `/maintenances/${id}` : null),
    () => getMaintenanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MaintenanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMaintenanceById(id, values);
      mutate(updated);
      resetForm();
      router.push('/maintenances');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MaintenanceInterface>({
    initialValues: data,
    validationSchema: maintenanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Maintenance
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="maintenance_type" mb="4" isInvalid={!!formik.errors?.maintenance_type}>
              <FormLabel>Maintenance Type</FormLabel>
              <Input
                type="text"
                name="maintenance_type"
                value={formik.values?.maintenance_type}
                onChange={formik.handleChange}
              />
              {formik.errors.maintenance_type && <FormErrorMessage>{formik.errors?.maintenance_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="date" mb="4">
              <FormLabel>Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.date ? new Date(formik.values?.date) : null}
                  onChange={(value: Date) => formik.setFieldValue('date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="notes" mb="4" isInvalid={!!formik.errors?.notes}>
              <FormLabel>Notes</FormLabel>
              <Input type="text" name="notes" value={formik.values?.notes} onChange={formik.handleChange} />
              {formik.errors.notes && <FormErrorMessage>{formik.errors?.notes}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<VehicleInterface>
              formik={formik}
              name={'vehicle_id'}
              label={'Select Vehicle'}
              placeholder={'Select Vehicle'}
              fetcher={getVehicles}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.make}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'maintenance',
  operation: AccessOperationEnum.UPDATE,
})(MaintenanceEditPage);
