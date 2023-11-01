import ky from 'ky';
import { z } from 'zod';
import { Address, addressSchema } from './models/Address';
import { OsrmResponse, osrmResponseSchema } from './models/OsrmResponse';
import { Route } from './models/Route';

export async function search(query: string): Promise<Address[]> {
    const results = await ky
        .get('https://nominatim.openstreetmap.org/search', {
            searchParams: {
                q: query,
                format: 'json',
                accept_language: [navigator.language, 'en'].join(','),
            },
        })
        .json<Address[]>();

    return await z.array(addressSchema).parseAsync(results);
}

export async function doRoute(from: Address, to: Address): Promise<Route[]> {
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
}
