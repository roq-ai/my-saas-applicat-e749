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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createVehicle } from 'apiSdk/vehicles';
import { Error } from 'components/error';
import { vehicleValidationSchema } from 'validationSchema/vehicles';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { VehicleInterface } from 'interfaces/vehicle';

function VehicleCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: VehicleInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createVehicle(values);
      resetForm();
      router.push('/vehicles');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<VehicleInterface>({
    initialValues: {
      make: '',
      model: '',
      year: 0,
      location: '',
      availability: false,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: vehicleValidationSchema,
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
            Create Vehicle
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="make" mb="4" isInvalid={!!formik.errors?.make}>
            <FormLabel>Make</FormLabel>
            <Input type="text" name="make" value={formik.values?.make} onChange={formik.handleChange} />
            {formik.errors.make && <FormErrorMessage>{formik.errors?.make}</FormErrorMessage>}
          </FormControl>
          <FormControl id="model" mb="4" isInvalid={!!formik.errors?.model}>
            <FormLabel>Model</FormLabel>
            <Input type="text" name="model" value={formik.values?.model} onChange={formik.handleChange} />
            {formik.errors.model && <FormErrorMessage>{formik.errors?.model}</FormErrorMessage>}
          </FormControl>
          <FormControl id="year" mb="4" isInvalid={!!formik.errors?.year}>
            <FormLabel>Year</FormLabel>
            <NumberInput
              name="year"
              value={formik.values?.year}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('year', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.year && <FormErrorMessage>{formik.errors?.year}</FormErrorMessage>}
          </FormControl>
          <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
            <FormLabel>Location</FormLabel>
            <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
            {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
          </FormControl>
          <FormControl
            id="availability"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.availability}
          >
            <FormLabel htmlFor="switch-availability">Availability</FormLabel>
            <Switch
              id="switch-availability"
              name="availability"
              onChange={formik.handleChange}
              value={formik.values?.availability ? 1 : 0}
            />
            {formik.errors?.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'vehicle',
  operation: AccessOperationEnum.CREATE,
})(VehicleCreatePage);
