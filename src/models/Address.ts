import z from 'zod';
import { camelize } from '../util';

export const placeSchema = z
  .object({
    place_id: z.number(),
    osm_id: z.number(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    display_name: z.string().optional(),
  })
  .transform(camelize);

export const nominatimResponseSchema = z.array(placeSchema);

export type Place = z.infer<typeof placeSchema>;
export type NominatimResponse = z.infer<typeof nominatimResponseSchema>;
