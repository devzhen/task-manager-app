import type { HttpError } from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    req.cookies.delete('token');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      statusCode: (error as HttpError).statusCode || 500,
    });
  }
}
