import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const headers = new Headers();
        headers.set('Content-Type', blob.type);
        headers.set('Access-Control-Allow-Origin', '*');

        return new NextResponse(blob, { status: 200, headers });
    } catch (error) {
        console.error('Error proxying image:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
}
