'use server'

import { Luogo } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM luogo`;

    //console.debug(rows);

    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Luogo = await request.json();
    const { nome } = body;

    await client.sql`INSERT INTO luogo (nome) VALUES (${nome})`;

    return NextResponse.json({ message: `Luogo ${nome} aggiunto!` }, {status: 201});
}