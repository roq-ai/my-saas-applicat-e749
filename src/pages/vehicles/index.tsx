import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getVehicles, deleteVehicleById } from 'apiSdk/vehicles';
import { VehicleInterface } from 'interfaces/vehicle';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function VehicleListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<VehicleInterface[]>(
    () => '/vehicles',
    () =>
      getVehicles({
        relations: ['organization', 'maintenance.count', 'reservation.count'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteVehicleById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('vehicle', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/vehicles/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('vehicle', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Vehicle
            </Text>
            <NextLink href={`/vehicles/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>make</Th>
                  <Th>model</Th>
                  <Th>year</Th>
                  <Th>location</Th>
                  <Th>availability</Th>
                  {hasAccess('organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>organization</Th>
                  )}
                  {hasAccess('maintenance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>maintenance</Th>
                  )}
                  {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>reservation</Th>
                  )}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.make}</Td>
                    <Td>{record.model}</Td>
                    <Td>{record.year}</Td>
                    <Td>{record.location}</Td>
                    <Td>{record.availability}</Td>
                    {hasAccess('organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/organizations/view/${record.organization?.id}`}>
                          {record.organization?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('maintenance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.maintenance}</Td>
                    )}
                    {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.reservation}</Td>
                    )}
                    <Td>
                      {hasAccess('vehicle', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/vehicles/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('vehicle', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'vehicle',
  operation: AccessOperationEnum.READ,
})(VehicleListPage);
