import { Hono } from "hono";
import { applicantSchema, resumeSchema } from "../lib/schema.js";
import { gemini } from "../lib/helpers.js";
import { prisma, responseSchema } from "../lib/constants.js";
import { validateUser } from "../middleware/validateUser.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const applicantApp = new Hono()

applicantApp.use("/:userId/create-applicant",validateUser)
applicantApp.use("/:userId/get-applicant", authenticateUser)


applicantApp.post("/:userId/create-applicant", async (c) => {
    try {
        const { userId } = c.req.param()
        const body = await c.req.json();

        const parsedBody = applicantSchema.pick({ raw_text: true }).safeParse(body)

        if (!parsedBody.success) {
            return c.json({
                error: parsedBody.error.errors.map(err => err.message),
            }, 404)
        }

        const response = await gemini({
            prompt: `This is raw resume data ${parsedBody.data.raw_text}. Parse it to return data in JSON which should exactly match this given schema, also generate the summary based on resume data, which is not given in the data.`,
            responseSchema: responseSchema
        })

        if(!response){
            return c.json({
                error:"Error in parsing resume, please try again later"
            },500)
        }   

        const parsedResponse = resumeSchema.safeParse(JSON.parse(response))
        if(!parsedResponse.success){
            console.log(parsedResponse.error.errors.map(err => err.message));
            return c.json({
                error: `Error in parsing resume ` + parsedResponse.error.errors.map(err => err.message).join(",")
            },500)
        }

        const { education,email,experience,name,skills,summary } = parsedResponse.data

        const newApplicant = await prisma.applicant.create({
            data:{
                email,
                name,
                summary,
                education:{
                    create:{
                        branch:education.branch,
                        degree:education.degree,
                        institution:education.institution,
                        year:education.year
                    },

                },
                experience:{
                    create:{
                        company:experience.company,
                        job_title:experience.job_title
                    }
                },
                skills:skills,
                user:{
                    connect:{
                        id:userId
                    }
                }
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
            error: "Internal server error " + e
        }, 500)
    }
})

applicantApp.post("/:userId/get-applicant" ,async(c) => {
    try{
        const { userId } = c.req.param()
        const body = await c.req.json();
        const parsedBody = resumeSchema.pick({name:true}).safeParse(body);

        if(!parsedBody.success) return c.json({
            error:parsedBody.error.errors.map( err => err.message)
        },400)

        const applicants = await prisma.applicant.findMany({
            where:{
                name:{
                    mode:"insensitive",
                    contains:parsedBody.data.name,
                },
                userId
            }
        })

        if(!applicants) return c.json({
            error:"No such name found"
        },404)

        return c.json({
            applicants
        },200)

    }
    catch(e){
        console.log(e);
        return c.json({
            error:"Internal server error " + e
        })
    }
})

export default applicantApp;