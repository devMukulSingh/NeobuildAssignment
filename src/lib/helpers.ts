import * as jose from "jose";
import { GoogleGenerativeAI, type ResponseSchema } from "@google/generative-ai";

export async function gemini({prompt,responseSchema}:{prompt:string,responseSchema:ResponseSchema}){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
        generationConfig:{
            responseSchema: responseSchema,
            responseMimeType:"application/json"
        }
     });
    try{
        const result = await model.generateContent(prompt);
        return result.response.text()
    }
    catch(e){
        console.log(`Error in gemini`,e);
        return null
    }
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export const jwtSign = async () => {
    try {
        const alg = "HS256";
        const token = (
            await new jose.SignJWT().setProtectedHeader({ alg }).sign(secret)
        ).toString();
        return token;
    } catch (e) {
        console.log(e);
        return;
    }
};

export const isAuth = async (token: string) => {
    try {
        const isAuth = await jose.jwtVerify(token, secret);
        return isAuth;
    } catch (e) {
        console.log(e);
        return false;
    }
};