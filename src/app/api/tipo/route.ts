'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT * FROM tipo`;

    //console.debug(rows);

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body = await request.json();
    const { tipo, porzioni } = body;

    console.debug(tipo, porzioni);

    try {
        const result = await client.sql`
            INSERT INTO tipo (nome, porzioni)
            VVALUES (${tipo}, ${porzioni})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il luogo inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento del tipo ${tipo}` }, { status: 500 });
    } finally {
        client.release();
    }
}