import ky from 'ky';
import {
    Address,
    AddressFeature,
    AddressFeatureCollection,
    addressFeatureCollectionSchema,
    addressSchema,
} from './models/Address';

const api = ky.create({
    prefixUrl: 'https://nominatim.openstreetmap.org/',
});

export async function search(query: string): Promise<AddressFeatureCollection> {
    const results = await api
        .get('search', {
            searchParams: {
                q: query,
                format: 'geojson',
                limit: '5',
            },
        })
        .json<AddressFeatureCollection>();

    return await addressFeatureCollectionSchema.parseAsync(results);
}

// export async function reverseGeocode(lat: number, lon: number): Promise<Address> {
//   const res = await api.get('reverse', {
//     searchParams: {
//       lat,
//       lon,
//       format: 'geojson',
//     },
//   });
//   const json = await res.json<FeatureCollection<Geometry, Address>>();
//   const feature = json.features[0];
//   return {
//     ...feature.properties,
//   };
// }
