import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'

// We precise which road is form the admin
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
// const isForConnectedUsers = createRouteMatcher(['/blog/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  // Protect all routes starting with `/admin`
    if (isAdminRoute(req) && sessionClaims?.metadata?.role !== 'admin') {
        const url = new URL('/', req.url)
        return NextResponse.redirect(url)
    }

    // Protect all routes starting with /blog for unconnected users
    // if(isForConnectedUsers(req) && (await auth()).userId === null){
    //   const url = new URL('/', req.url)
    //   return NextResponse.redirect(url)
    // }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};