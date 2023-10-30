import ky from 'ky';
import { z } from 'zod';
import { Address, addressSchema } from './models/Address';

export async function search(query: string): Promise<Address[]> {
    const results = await ky
        .get('https://nominatim.openstreetmap.org/search', {
            searchParams: {
                q: query,
                format: 'json',
                limit: '5',
                addressdetails: 1,
            },
        })
        .json<Address[]>();

    return await z.array(addressSchema).parseAsync(results);
}
