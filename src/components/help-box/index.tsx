import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['Fleet Owner'];
  const roles = ['Car Renter', 'Fleet Owner', 'Rental Provider', 'Fleet Manager', 'Customer Support'];
  const applicationName = 'My SaaS application';
  const tenantName = 'Organization';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `1. As a Fleet Owner, I want to create an Organization, so that I can manage my fleet of rental cars.
2. As a Fleet Owner, I want to invite Rental Providers, Fleet Managers, and Customer Support to join my Organization, so that they can manage their respective responsibilities.
3. As a Fleet Owner, I want to add and remove vehicles from my fleet, so that I can keep my fleet up-to-date.

4. As a Rental Provider, I want to add and remove vehicles from the Organization's fleet, so that I can manage my own rental cars.
5. As a Rental Provider, I want to update vehicle availability, so that Car Renters can see which vehicles are available for rent.

6. As a Fleet Manager, I want to view and update vehicle maintenance information, so that I can ensure the fleet is well-maintained and safe for Car Renters.
7. As a Fleet Manager, I want to view and update vehicle location, so that I can keep track of the fleet's whereabouts.

8. As a Customer Support, I want to view and update Car Renter information, so that I can assist them with any issues or inquiries they may have.

9. As a Car Renter, I want to create an account, so that I can rent cars from the available fleet.
10. As a Car Renter, I want to view available vehicles, so that I can choose a suitable car for my needs.
11. As a Car Renter, I want to reserve a vehicle, so that I can use it for a specified period of time.
12. As a Car Renter, I want to update my personal information, so that my account remains accurate and up-to-date.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="30px" bottom="20px" zIndex={3}>
      <Popover placement="top-end">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent w="50vw" h="70vh">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
