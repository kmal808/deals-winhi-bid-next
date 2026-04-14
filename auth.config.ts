import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verifyCredentials } from '@/lib/auth'

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await verifyCredentials(
          credentials.username as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        // Return user object that will be stored in the session
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as 'admin' | 'representative'
        session.user.username = token.username as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
