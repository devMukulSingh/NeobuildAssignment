import { Hono } from "hono";
import { applicantSchema, resumeSchema } from "../lib/schema.js";
import { gemini, parsePdfUrl } from "../lib/helpers.js";
import { prisma, responseSchema } from "../lib/constants.js";
import { validateUser } from "../middleware/validateUser.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import axios from "axios";
import PDFParser from "pdf2json";
import { PdfReader } from "pdfreader";


const applicantApp = new Hono()

applicantApp.use("/:userId/create-applicant", validateUser)
applicantApp.use("/:userId/get-applicant", authenticateUser)


applicantApp.post("/:userId/create-applicant", async (c) => {

    const { userId } = c.req.param();
    const body = await c.req.json();
    let parsedPdfText = "";
    let llmResponse = ""

    const parsedBody = applicantSchema.pick({ url: true }).safeParse(body)

    if (!parsedBody.success) {
        return c.json({
            error: parsedBody.error.errors.map(err => err.message),
        }, 404)
    }

    try {
        parsedPdfText = await parsePdfUrl(parsedBody.data.url);
    }
    catch (e) {
        console.log(e);
        return c.json({
            error: "Error parsing pdf " + e
        }, 500)
    }
    // console.log({parsedPdfText});
    try {
        llmResponse = await gemini({
            prompt: `This is raw resume data - ${parsedPdfText}.Parse it carefully and thoroughly.
            Return data in JSON format which should exactly match the given schema. Insert empty string, if any field is not available.
            Schema -    
            {
                "name": <name>,
                "email": <email>,
                "education":
                    [{
                    "degree": <degree>,
                    "branch" : <branch>,
                    "institution": <institution>,
                    "year": <year>
                        }],
                "experience": 
                    [{
                    "job_title": <job_title>,
                    "company": <company>,
                    "start_date": <start_date>,
                    "end_date": <end_date>
                        }],
                "skills": [
                    <skill_1>,
                    <skill_2>,
                ],
                "summary"
                }
        
            `,
        })
        // console.log({ llmResponse });
    }
    catch (e) {
        console.log(e);
        return c.json({
            error: "Error in generating llm response " + e
        })
    }
    if (!llmResponse) {
        return c.json({
            error: "Error in parsing resume, please try again later"
        }, 500)
    }
    const jsonParsed = JSON.parse(llmResponse.replace(/\bjson\b|`{3}/g, " "))
    const parsedResponse = resumeSchema.safeParse(jsonParsed)
    // console.log({data:parsedResponse.data});
    if (!parsedResponse.success) {
        console.log(parsedResponse.error.errors);
        return c.json({
            error: `Error in parsing resume ` + parsedResponse.error.errors.map(err => err.message).join(",")
        }, 500)
    }

    const { education, email, experience, name, skills, summary } = parsedResponse.data

    try {
        const newApplicant = await prisma.applicant.create({
            data: {
                email,
                name,
                summary,
                education: {
                    createMany : {
                        data:education
                    }

                },
                experience: {
                   createMany:{
                        data: experience
                   }
                },
                skills: skills,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                education: true,
                experience: true,

            }
        })

        return c.json({
            msg: "applicant created successfully",
            newApplicant
        }, 200)
    }
    catch (e) {
        console.log(e);
        return c.json({
            error: "Error saving new applicant to db " + e
        }, 500)
    }
})

applicantApp.post("/:userId/get-applicant", async (c) => {
    try {
        const { userId } = c.req.param()
        const body = await c.req.json();
        const parsedBody = resumeSchema.pick({ name: true }).safeParse(body);

        if (!parsedBody.success) return c.json({
            error: parsedBody.error.errors.map(err => err.message)
        }, 400)

        const applicants = await prisma.applicant.findMany({
            where: {
                name: {
                    mode: "insensitive",
                    contains: parsedBody.data.name,
                },
                userId
            }
        })
        if (applicants.length === 0) return c.json({
            error: "No such name found"
        }, 404)

        return c.json({
            applicants
        }, 200)

    }
    catch (e) {
        console.log(e);
        return c.json({
            error: "Internal server error " + e
        })
    }
})

export default applicantApp;