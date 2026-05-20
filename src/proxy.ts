import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export async function proxy(request: NextRequest) {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // });
    const session = getSessionCookie(request);
    
    if(!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
  ], // Specify the routes the middleware applies to
};


// What the Matcher is Saying
// /((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)

// It's a regex that means: "run middleware on ALL routes EXCEPT these":

// | Excluded Route/Path | Why It’s Excluded                                                                                                    |
// | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
// | `/api`              | API routes usually handle their own authentication and authorization logic separately.                               |
// | `/_next/static`     | Contains Next.js static files like CSS, JS bundles, and build assets. No auth needed.                                |
// | `/_next/image`      | Used by Next.js image optimization system. Blocking this breaks images. Brilliant framework engineering.             |
// | `/favicon.ico`      | Public browser icon asset. No reason to authenticate a tiny square logo pretending to represent your entire company. |
// | `/sign-in`          | Login page must stay public or users get infinite redirect loops.                                                    |
// | `/sign-up`          | Registration page must stay public so new users can create accounts.                                                 |
// | `/assets`           | Public assets folder for images, icons, fonts, etc. No auth required.                                                |

