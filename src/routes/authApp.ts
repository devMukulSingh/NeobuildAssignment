import { Hono } from "hono";
import { userSchema } from "../lib/schema.js";
import { prisma } from "../lib/constants.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt"
import { jwtSign } from "../lib/helpers.js";

const authApp = new Hono();

authApp.post('/register', async (c) => {
    const body = await c.req.json();
    const parsedBody = userSchema.safeParse(body);

    if (!parsedBody.success) {
        return c.json({
            error: parsedBody.error.errors.map(err => err.message)
        }, 400)
    }

    const { email, name, password } = parsedBody.data

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        return c.json({
            msg: "User registered successfully",
        }, 201)

    }
    catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return c.json({
                    error: "User already exists"
                }, 409)
            }
        }
        return c.json({
            error: "Internal server error " + e
        }, 500)
    }
})

authApp.post('/login', async (c) => {

    const body = await c.req.json();
    const parsedBody = userSchema.pick({ email: true, password: true }).safeParse(body);
    if (!parsedBody.success) {
        return c.json({
            error: parsedBody.error.errors.map(err => err.message),
        }, 400)
    }
    const { email, password } = parsedBody.data;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!user) {
            return c.json({
                error: "Invalid credentials"
            }, 400)
        }

        if (!await bcrypt.compare(password, user?.password)) {
            return c.json({
                error: "Invalid credentials"
            }, 400)
        }

        const jwt = await jwtSign()

        return c.json({
            JWT: jwt
        },200)
    }

    catch (e) {
        console.log(e);
        return c.json({
            error: "Internal server error " + e
        })
    }
})

export default authApp;