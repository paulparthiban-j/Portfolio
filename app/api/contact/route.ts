import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { validateEmail, sanitizeInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const identifier = getClientIdentifier(headersList as Headers);

    // Rate limiting for contact form (strict: 5 per hour)
    const rateLimitResult = checkRateLimit(identifier, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5, // Max 5 contact forms per hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // Log the contact form submission (in production, you'd send an email or save to database)
    console.log('Contact Form Submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send email using a service like Resend, SendGrid, or Nodemailer
    // 2. Save to database
    // 3. Implement spam detection (like Akismet or reCAPTCHA)

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
