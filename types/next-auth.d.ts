import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'admin' | 'representative'
      username: string
    } & DefaultSession['user']
  }

  interface User {
    role: 'admin' | 'representative'
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'representative'
    username: string
  }
}
