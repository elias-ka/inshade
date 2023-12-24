import z from 'zod';

export const routeSchema = z.object({
    geometry: z.object({
        coordinates: z.array(z.array(z.number()).length(2)),
    }),
    distance: z.number().nonnegative(),
    duration: z.number().nonnegative(),
});

export type Route = z.infer<typeof routeSchema>;
