import z from 'zod';
import { camelize } from '../util';

export const addressSchema = z
    .object({
        place_id: z.number(),
        osm_id: z.number(),
        lat: z.string(),
        lon: z.string(),
        display_name: z.string().optional(),
    })
    .transform(camelize);

export type Address = z.infer<typeof addressSchema>;
