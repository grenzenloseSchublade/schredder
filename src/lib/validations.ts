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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
