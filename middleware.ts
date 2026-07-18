import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/product/(.*)', 
  '/products(.*)',  
  '/about', 
  '/contact',  
  '/robots.txt',
  '/sitemap.xml',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/inngest',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};