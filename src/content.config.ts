import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    id: z.string().regex(/^\d\.\d+$/),
    part: z.number().int().min(1).max(6),
    slug: z.string().min(1),
    title_fa: z.string().min(1),
    objective_fa: z.string().min(1),
    figure: z.object({
      component: z.string().min(1),
      id: z.string().regex(/^fig-[a-z][a-z0-9-]+$/),
      caption_fa: z.string().min(1),
      interactive: z.boolean().default(false),
    }).optional(),
    terms_introduced: z.array(z.string()).default([]),
    example: z.enum(['coding', 'none']).default('none'),
    words: z.number().int().positive(),
    has_aside: z.boolean().default(false),
    context_lens: z
      .object({
        id: z.string().regex(/^fig-[a-z][a-z0-9-]+-ctx$/),
        lens: z.string().min(1),
        caption_fa: z.string().min(1),
        interactive: z
          .union([z.boolean(), z.enum(['stepper', 'lab'])])
          .default(false),
      })
      .optional(),
    status: z.enum(['draft', 'reviewed', 'confirmed']).default('draft'),
  }),
});

export const collections = { lessons };
