import { z } from "zod";


export const userSchema = z.object({
    name: z.string({ required_error: "Name is required" }).trim().min(1, {
        message: "Name is required"
    }).max(50, {
        message: "Max 50 characters allowed"
    }),
    email: z.string({ required_error: "email is required" }).trim().min(1, {
        message: "email is required"
    }).max(50, {
        message: "Max 100 characters allowed"
    }),
    password: z.string({ required_error: "password is required" }).trim().min(1, {
        message: "password is required"
    }).max(50, {
        message: "Max 20 characters allowed"
    })
})