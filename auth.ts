import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { Truculenta } from "next/font/google"


 
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google , 
  //    Credentials({
  //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  //   // e.g. domain, username, password, 2FA token, etc.
  //   credentials: {
  //     email: {},
  //     password: {},
  //   },
  //   authorize: async (credentials) => {
  //     try {
  //       let user = null

  //       const { email, password } = await loginFormSchema.parseAsync(credentials)

  //       // logic to salt and hash password
  //       const pwHash = salt(password)

  //       // logic to verify if the user exists
  //       user = await getUserFromDb(email, pwHash)

  //       if (!user) {
  //         throw new Error("Invalid credentials.")
  //       }

  //       // return JSON object with the user data
  //       return user
  //     } catch (error) {
  //       if (error instanceof ZodError) {
  //         // Return `null` to indicate that the credentials are invalid
  //         return null
  //       }
  //     }
  //   },
  // }),],
  // callbacks: {
    

  //   async signIn(params) {
  //       // Only allow sign in for users with email addresses ending with "yourdomain.com"


  //       console.log('user', params)
  //     }
  // }

  ]
})