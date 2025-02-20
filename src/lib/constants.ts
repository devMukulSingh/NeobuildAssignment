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
            description: "Email of the applicant"
        },
        education: {
            type: SchemaType.OBJECT,
            properties: {
                degree: {
                    type: SchemaType.STRING,
                    description: "Degree of the education"
                },
                branch: {
                    type: SchemaType.STRING,
                    description: "Branch of the education"
                },
                institution: {
                    type: SchemaType.STRING,
                    description: "Institute/College"
                },
                year: {
                    type: SchemaType.STRING,
                    description: "Year at which the education is finished"
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
            description: "Summary of the applicant"
        }
    }
}