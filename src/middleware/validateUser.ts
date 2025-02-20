import type { Context, Next } from "hono";
import { ObjectId } from 'mongodb';
import { isAuth } from "../lib/helpers.js";
import { prisma } from "../lib/constants.js";


export async function validateUser(c: Context, next: Next) {

    const { userId } = c.req.param()

    const token = c.req.header('Authorization')?.replace("Bearer ", "");

    if (!token || token==="") return c.json({
        error: "Unauthenticated, token not found"
    }, 403)

    if (!(await isAuth(token))) return c.json({
            error: "Unauthenticated, invalid token"
        }, 403)

    if (!ObjectId.isValid(userId)) {
        return c.json({
            error: "Unauthenticated, invalid userId"
        }, 403)
    }

    const existingUser = await prisma.user.findFirst({
        where:{
            id:userId
        }
    })

    if(!existingUser) return c.json({
        error:"Unauthenticated, user not found"
    },403)

    await next();
}