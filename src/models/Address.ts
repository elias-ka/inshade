import camelcaseKeys from 'camelcase-keys';
import z from 'zod';

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) =>
    camelcaseKeys(val);

export const addressSchema = z
    .object({
        place_id: z.number(),
        licence: z.string().optional(),
        osm_type: z.string().optional(),
        osm_id: z.number(),
        lat: z.string(),
        lon: z.string(),
        class: z.string().optional(),
        type: z.string().optional(),
        place_rank: z.number().optional(),
        importance: z.number().optional(),
        addresstype: z.string().optional(),
        name: z.string().optional(),
        display_name: z.string().optional(),
        address: z
            .object({
                town: z.string().optional(),
                municipality: z.string().optional(),
                county: z.string().optional(),
                ISO31662_lvl6: z.string().optional(),
                state_district: z.string().optional(),
                region: z.string().optional(),
                postcode: z.string().optional(),
                country: z.string().optional(),
                country_code: z.string().optional(),
            })
            .transform(camelize),
        boundingbox: z.array(z.string()),
    })
    .transform(camelize);

export type Address = z.infer<typeof addressSchema>;
