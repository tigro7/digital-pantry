'use server'

import { Unita_Misura } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM unita_misura`;

    //console.debug(rows);

    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Unita_Misura = await request.json();
    const { nome, simbolo } = body;

    await client.sql`INSERT INTO unita_misura (nome, simbolo) VALUES (${nome}, ${simbolo})`;

    return NextResponse.json({ message: `Unità ${nome} aggiunta!` }, {status: 201});
}