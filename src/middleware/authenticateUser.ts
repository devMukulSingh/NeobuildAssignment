import type { Context, Next } from "hono";
import { ObjectId } from 'mongodb';
import { isAuth } from "../lib/helpers.js";


export async function authenticateUser(c: Context, next: Next) {

    const { userId } = c.req.param()

    const token = c.req.header('Authorization')?.replace("Bearer ", "");

    if (!token || token==="") return c.json({
        error: "Unauthenticated, token not found"
    }, 401)

    if (!(await isAuth(token))) return c.json({
            error: "Unauthenticated, invalid token"
        }, 401)

    if (!ObjectId.isValid(userId)) {
        return c.json({
            error: "Unauthenticated, invalid userId"
        }, 401)
    }

    await next();
}