'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ricetta } from "@/app/lib/definitions";

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM ricette`;

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    console.debug(`POST - ricette: ${request}`);

    const client = await db.connect();
    const body: Ricetta = await request.json();
    const { nome, procedimento, persone } = body;

    try {
        const result = await client.sql`
            INSERT INTO ricette (nome, procedimento, persone)
            VALUES (${nome}, ${procedimento}, ${persone})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce la ricetta inserita
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento della ricetta ${nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}