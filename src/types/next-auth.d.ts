// The next-auth.d.ts file extends the "types" used by next-auth. This ensures TypeScript knows about custom properties added to the JWT and Session objects.

import 'next-auth';

declare module 'next-auth' {
    interface Session {
        // user: Extends the User object to include the same fields.
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
