'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ingrediente_Ricetta } from "@/app/lib/definitions";

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM ingredienti_ricette`;

    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Ingrediente_Ricetta = await request.json();
    const { ricetta, ingrediente, quantita, unita_misura } = body;

    try {
        const result = await client.sql`
            INSERT INTO ingredienti_ricette (ricetta, ingrediente, quantita, unita_misura)
            VALUES (${ricetta}, ${ingrediente}, ${quantita}, ${unita_misura})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento dell'ingrediente ${ingrediente} nella ricetta ${ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}