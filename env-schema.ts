import {z} from "zod";

const envSchema = z.object({
  DB_PORT: z.string(),
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_USER: z.string(),
  DB_PWD: z.string(),
})

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

type TypedEnv = z.infer<typeof envSchema>;