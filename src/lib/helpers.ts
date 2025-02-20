import * as jose from "jose";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold, type ResponseSchema
} from "@google/generative-ai";
import { PdfReader } from "pdfreader";
import axios from "axios";
import { responseSchema } from "./constants.js";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function gemini({ prompt, }: { prompt: string }) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
    });
    const chatSession = model.startChat({
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 65536,
            responseMimeType: "text/plain",
            // responseSchema:responseSchema,

        },
        history: [
        ],
    });
    try {
        const result = await chatSession.sendMessage(prompt);
        return result.response.text()
    }

    // const model = genAI.getGenerativeModel({
    //     model: "gemini-2.0-pro-exp-02-05",

    // });
    // try {
    //     const chatSession = model.startChat({
    //         generationConfig: {
    //             temperature: 1,
    //             topP: 0.95,
    //             topK: 64,
    //             maxOutputTokens: 8192,
    //             // responseSchema: responseSchema,
    //             responseMimeType: "text/plain"
    //         },
    //     });

    //     const result = await chatSession.sendMessage(prompt);
    //     return result.response.text()
    // }
    catch (e: any) {
        console.log(`Error in gemini`, e);
        throw new Error(e.message)
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

export async function parsePdfUrl(url: string): Promise<string> {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })

    const buffer = Buffer.from(data, "binary")

    return new Promise((resolve, reject) => {
        let text = "";
        new PdfReader().parseBuffer(buffer, (err, item) => {
            if (err) {
                console.error("Error reading PDF:", err);
                reject(`Error reading PDF: ${err}`)
            } else if (!item) {
                // console.log({text});
                resolve(text)
                console.log("End of PDF file");
            } else if (item?.text) {
                text = text.concat(" ", item.text)
            }

        }
        )
    })

}