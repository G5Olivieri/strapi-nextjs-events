import NextAuth, {NextAuthOptions} from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_CLIENT_ISSUER,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, user, token}) {
      session.id = token.id
      session.jwt = token.jwt
      return session
    },
    async jwt({token, user, account}) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account?.provider}/callback?access_token=${account?.access_token}`
        );
        const data = await response.json();
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return token;
    },
  },
}

export default NextAuth(authOptions)
