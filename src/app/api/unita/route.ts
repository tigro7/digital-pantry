'use server'

import { Unita_Misura } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM unita_misura`;

    //console.debug(rows);

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Unita_Misura = await request.json();
    const { nome, simbolo } = body;

    console.debug(nome, simbolo);

    try {
        const result = await client.sql`
            INSERT INTO unita_misura (nome, simbolo)
            VVALUES (${nome}, ${simbolo})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il luogo inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento dell'unità ${nome}` }, { status: 500 });
    } finally {
        client.release();
    }
    
}