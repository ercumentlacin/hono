import { z } from "zod";

export const seasonSchema = z.object({
  malId: z.string().optional(),
  title: z.string(),
  imageUrl: z.string().optional(),
  createdDate: z.string(),
  episodesAndDuration: z.string(),
  preLine: z.string(),
  genres: z.array(z.string()),
});
