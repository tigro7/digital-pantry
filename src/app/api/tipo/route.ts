'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM tipo`;

    //console.debug(rows);

    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body = await request.json();
    const { tipo, porzioni } = body;

    await client.sql`INSERT INTO tipo (nome, porzioni) VALUES (${tipo}, ${porzioni})`;

    return NextResponse.json({ message: `Tipo ${tipo} aggiunto!` }, {status: 201});
}