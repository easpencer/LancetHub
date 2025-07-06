import { NextResponse } from 'next/server';

export function handleApiError(error, context = '') {
  // Log the full error details
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
  });

  // Determine status code based on error type
  let statusCode = 500;
  let userMessage = 'An unexpected error occurred';

  if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
    statusCode = 404;
    userMessage = 'Resource not found';
  } else if (error.message?.includes('unauthorized') || error.message?.includes('authentication')) {
    statusCode = 401;
    userMessage = 'Authentication required';
  } else if (error.message?.includes('forbidden') || error.message?.includes('permission')) {
    statusCode = 403;
    userMessage = 'Access forbidden';
  } else if (error.message?.includes('timeout')) {
    statusCode = 504;
    userMessage = 'Request timeout - please try again';
  } else if (error.message?.includes('Airtable not configured')) {
    statusCode = 503;
    userMessage = 'Service temporarily unavailable';
  }

  // Return standardized error response
  return NextResponse.json(
    {
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

export function wrapApiHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, request.url);
    }
  };
}