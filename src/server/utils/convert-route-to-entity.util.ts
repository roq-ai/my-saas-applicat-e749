const mapping: Record<string, string> = {
  maintenances: 'maintenance',
  organizations: 'organization',
  reservations: 'reservation',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
