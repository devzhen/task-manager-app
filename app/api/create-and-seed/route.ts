import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const requestUrl = 'http://localhost:3000';

    // Boards
    let url = new URL(`${requestUrl}/api/board/create-table`);
    await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    url = new URL(`${requestUrl}/api/board/init-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    // Status
    url = new URL(`${requestUrl}/api/status/create-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    url = new URL(`${requestUrl}/api/status/init-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    // Cards
    url = new URL(`${requestUrl}/api/card/create-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    url = new URL(`${requestUrl}/api/card/init-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    // Tags
    url = new URL(`${requestUrl}/api/tag/create-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    url = new URL(`${requestUrl}/api/tag/init-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    // Attachments
    url = new URL(`${requestUrl}/api/attachment/create-table`);
    await fetch(url.toString(), {
      headers: {
        Authorization: process.env.API_AUTH_TOKEN as string,
      },
    });

    return NextResponse.json({ created: true });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}
