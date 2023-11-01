import z from 'zod';
import { routeSchema } from './Route';

export const osrmResponseSchema = z.object({
    code: z.string(),
    routes: z.array(routeSchema),
});

export type OsrmResponse = z.infer<typeof osrmResponseSchema>;
