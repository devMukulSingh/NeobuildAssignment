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

export const applicantSchema = z.object({
    url:z.string({required_error:"url is required"}).trim().min(1,{
        message:"url is required"
    }),
    name: z.string({ required_error: "name is required" }).trim().min(1, {
        message: "name is required"
    }),
})

export const resumeSchema = z.object({
    name:z.string({required_error:"Name is required"}),
    email: z.string({ required_error: "Email is required" }),
    summary: z.string({ required_error: "summary is required" }),
    education: z.object({
        institution : z.string().nullable(),
        degree:z.string().nullable(),
        branch:z.string().nullable(),
        year: z.string().nullable(),
    }).array(),
    experience: z.object({
        job_title: z.string().nullable(), 
        company: z.string().nullable(), 
    }).array(),
    skills : z.string().array().optional()
})