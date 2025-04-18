import { z } from "zod";
export const singupFormSchema = z.object({
  name: z.string().min(2, { message: "must be atleast 2 characters" }).trim(),

  email: z.string().email({ message: "please enter a valid email" }).trim(),

  password: z
    .string()
    .min(8, { message: "be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "contain at least one letter" })
    .regex(/[0-9]/, { message: "contain at least one digit" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});




export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const loginFormSchema = z.object({
  email: z.string().email({ message: "please enter a valid email" }).trim(),

  password: z
    .string()
    .min(8, { message: "be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "contain at least one letter" })
    .regex(/[0-9]/, { message: "contain at least one digit" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;



  
  export type SessionPayload = {
    userId: string,
    expiresAt: Date

  }