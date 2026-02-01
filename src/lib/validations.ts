import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-Mail ist erforderlich")
    .email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(1, "Passwort ist erforderlich")
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "E-Mail ist erforderlich")
      .email("Ungültige E-Mail-Adresse"),
    password: z
      .string()
      .min(1, "Passwort ist erforderlich")
      .min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
    confirmPassword: z.string().min(1, "Passwort-Bestätigung ist erforderlich"),
    nickname: z
      .string()
      .min(2, "Spitzname muss mindestens 2 Zeichen lang sein")
      .max(20, "Spitzname darf maximal 20 Zeichen lang sein")
      .regex(
        /^[a-zA-Z0-9äöüÄÖÜß\s]+$/,
        "Nur Buchstaben, Zahlen und Leerzeichen erlaubt"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const nuggetEntrySchema = z.object({
  count: z
    .number()
    .int("Anzahl muss eine ganze Zahl sein")
    .positive("Anzahl muss größer als 0 sein")
    .max(999, "Maximal 999 Nuggets pro Eintrag"),
  sauces: z.array(z.string().max(50)).default([]),
  location: z.string().max(100).optional(),
  mood: z
    .enum(["🍗", "🐔", "🐓", "🥚", "🐥", "🤤", "😋", "🔥", "🌶️", "🐣"])
    .optional(),
  notes: z.string().max(500).optional(),
});

export type NuggetEntryFormData = z.infer<typeof nuggetEntrySchema>;
