'use server'

import { Luogo } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM luogo`;

    //console.debug(rows);

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Luogo = await request.json();
    const { nome } = body;
 
    console.debug(nome);

    try {
        const result = await client.sql`
            INSERT INTO luogo (nome)
            VVALUES (${nome})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il luogo inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento del luogo ${nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}