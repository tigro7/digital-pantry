'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ingrediente } from "@/app/lib/definitions";

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM ingredienti`;

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Ingrediente = await request.json();
    const { nome, tipo } = body;

    try {
        const result = await client.sql`
            INSERT INTO ingredienti (nome, tipo)
            VALUES (${nome}, ${tipo})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento dell'ingrediente ${nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}