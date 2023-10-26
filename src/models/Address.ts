import camelcaseKeys from 'camelcase-keys';
import { z } from 'zod';

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) =>
    camelcaseKeys(val);

export const addressSchema = z
    .object({
        place_id: z.number().optional(),
        osm_type: z.string().optional(),
        osmd_id: z.number().optional(),
        place_rank: z.number().optional(),
        category: z.string().optional(),
        type: z.string().optional(),
        importance: z.number().optional(),
        address_type: z.string().optional(),
        name: z.string().optional(),
        display_name: z.string().optional(),
    })
    .transform(camelize);

export type Address = z.infer<typeof addressSchema>;

export const addressFeatureSchema = z.object({
    type: z.literal('Feature'),
    properties: addressSchema,
    bbox: z.array(z.number()),
    geometry: z
        .object({
            type: z.literal('Point'),
            coordinates: z.array(z.number()),
        })
        .transform(camelize),
});

export type AddressFeature = z.infer<typeof addressFeatureSchema>;

export const addressFeatureCollectionSchema = z.object({
    type: z.literal('FeatureCollection'),
    licence: z.string(),
    features: z.array(addressFeatureSchema),
});

export type AddressFeatureCollection = z.infer<typeof addressFeatureCollectionSchema>;
