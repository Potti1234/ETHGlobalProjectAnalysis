import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const settingsSchema = z.object({
  id: pbIdSchema,
  authWithPasswordAvailable: z.boolean()
})

export type Settings = z.infer<typeof settingsSchema>
