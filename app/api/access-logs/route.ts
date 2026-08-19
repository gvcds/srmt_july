import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8001';

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/access-logs`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Proxy GET /access-logs falhou:', error);
        return NextResponse.json({ error: 'Backend indisponível' }, { status: 502 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${BACKEND_URL}/access-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Proxy POST /access-logs falhou:', error);
        return NextResponse.json({ error: 'Backend indisponível' }, { status: 502 });
    }
}
