import { SchemaType, type ResponseSchema } from "@google/generative-ai"
import { PrismaClient } from "@prisma/client"

export const BASE_URL = process.env.NODE_ENV==="production" ? "" : "http://localhost:3000"

export const prisma = new PrismaClient({
    
})

export const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    description: "Resume data of the applicant",
    properties: {
        name: {
            type: SchemaType.STRING,
            description: "Name of the applicant"
        },
        email: {
            type: SchemaType.STRING,
            description: "Email id of the applicant",
            example:"mukulsingh2276@gmail.com"
        },
        education: {
            type: SchemaType.OBJECT,
            properties: {
                degree: {
                    type: SchemaType.STRING,
                    description: "Degree of the education",
                    example:"Btech, Bsc, Bcom, Bachelor in Tech, Master in Tech"
                },
                branch: {
                    type: SchemaType.STRING,
                    description: "Branch of the degree or course",
                    example:"CS, Mechanical, IT, Electronics, Chemical"
                },
                institution: {
                    type: SchemaType.STRING,
                    description: "Institute/College from where the applicant is pursuing course/degree",
                    example:"Delhi University"
                },
                year: {
                    type: SchemaType.STRING,
                    description: "Year in which the education was finished",
                    example:"2020,2023,2024"
                }
            },
        },
        experience: {
            type: SchemaType.OBJECT,
            properties: {
                job_title: {
                    type: SchemaType.STRING,
                    description: "The role applicant was employed in the company"
                },
                company: {
                    type: SchemaType.STRING,
                    description: "Name of the companay"
                }
            }
        },
        skills: {
            type: SchemaType.ARRAY,
            items : {
                type:SchemaType.STRING,
                description:"Applicant skill name"
            },
            description: "An array of  applicant's skills"
        },
        summary: {
            type: SchemaType.STRING,
            description: "Summary of the applicant's career in not more than 20 words"
        }
    }
}