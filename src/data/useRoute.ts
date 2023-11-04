import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { Place } from '../models/Address';
import { OsrmResponse, osrmResponseSchema } from '../models/OsrmResponse';
import { Route } from '../models/Route';

const fetchRoute = async (from: Place | null, to: Place | null): Promise<Route[]> => {
    if (!from || !to) {
        return [];
    }

    const results = await ky
        .get(
            `https://routing.openstreetmap.de/routed-car/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}`,
            {
                searchParams: {
                    overview: 'full',
                    geometries: 'geojson',
                },
            }
        )
        .json<OsrmResponse>();

    return await osrmResponseSchema.parseAsync(results).then((r) => r.routes);
};

export const useRoute = (from: Place | null, to: Place | null) => {
    return useQuery({
        queryKey: ['route', from, to],
        queryFn: () => fetchRoute(from, to),
    });
};
