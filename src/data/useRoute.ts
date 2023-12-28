import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { Place } from '../models/Address';
import { OsrmResponse, osrmResponseSchema } from '../models/OsrmResponse';
import { Route } from '../models/Route';

const fetchRoute = async (from: Place, to: Place): Promise<Route[]> => {
  const results = await ky
    .get(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}`,
      {
        searchParams: {
          overview: 'full',
          geometries: 'geojson',
        },
      }
    )
    .json<OsrmResponse>();

  return osrmResponseSchema.parseAsync(results).then((r) => r.routes);
};

const useRoute = (from: Place | null, to: Place | null) => {
  return useQuery({
    queryKey: ['route', from, to],
    queryFn: () => (from && to ? fetchRoute(from, to) : Promise.resolve([])),
  });
};

export default useRoute;
