// middleware.js
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import admin from './lib/firebaseAdmin'; // Import the Firebase Admin SDK

export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = req.cookies.get('auth_token'); // Get the token from cookies
    
    if (!token) {
      // If no token, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // If valid, proceed
      console.log('User authenticated:', decodedToken);
      
    } catch (err) {
      // If the token is invalid or expired, redirect to the login page
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Allow the request to continue if it's not /admin/* or the token is valid
  return NextResponse.next();
}

// Define which routes the middleware should run on
export const config = {
  matcher: ['/admin/*'], // Only apply this middleware to /admin/* routes
};
