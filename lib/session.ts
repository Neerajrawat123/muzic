import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";

const secret_key = process.env.SECRET_KEY;
const encoded_key = new TextEncoder().encode(secret_key)


export async function encrypt(payload: SessionPayload) {
    console.log(secret_key)
    console.log('pload', payload, encoded_key)
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoded_key);
}


export async function decrypt(session: string | undefined = '') {

    try {
        const { payload } = await jwtVerify(session, encoded_key, {
            algorithms: ['HS256']
        })

        return payload
        
    } catch (error) {
        console.log(error)
        return {
            error: 'can not verifiy the jwt tokey'
        }
}
    
}



export async function createSession(userId: string) {
    console.log('createsession', userId)
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000)
    const session = await encrypt({userId, expiresAt})

    const cookieStore = await cookies()


    cookieStore.set('session', session, {
        httpOnly: true,
        secure : true,
        expires: expiresAt,
        sameSite: true,
        path: '/'
    })
    
}
