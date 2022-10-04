import { signIn } from 'next-auth/react';
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
        GoogleProvider({
        // @ts-ignore
            clientId: process.env.GOOGLE_CLIENT_ID,
        // @ts-ignore
    
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    ],
    callbacks: {
        async jwt({ token, account }: any) {
            console.log('token', token);
            console.log('acc', account);

            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        // pages: {
        //     signIn: 'login'
        // },
        async session({ session, token }: any) {
           
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            console.log('stoken', token);
            console.log('sess', session);
            return session
        }
    },
}

export default NextAuth(authOptions)