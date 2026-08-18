import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8001';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const res = await fetch(`${BACKEND_URL}/metrics/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(`Proxy PUT /metrics/${params.id} falhou:`, error);
        return NextResponse.json({ error: 'Backend indisponível' }, { status: 502 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await fetch(`${BACKEND_URL}/metrics/${params.id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(`Proxy DELETE /metrics/${params.id} falhou:`, error);
        return NextResponse.json({ error: 'Backend indisponível' }, { status: 502 });
    }
}
