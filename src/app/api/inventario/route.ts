'use server'

import { Inventario } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
    
    const client = await db.connect();
   
    const rows =  await client.sql`SELECT * FROM inventario`;

    //console.debug(rows);

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request) {

    const client = await db.connect();
    const body: Inventario = await request.json();
    const { luogo, ingrediente, quantita, unita_misura } = body;

    console.debug(luogo, ingrediente, quantita, unita_misura);

    try {
        const result = await client.sql`
            INSERT INTO inventario (luogo, ingrediente, quantita, unita_misura)
            VALUES (${luogo}, ${ingrediente}, ${quantita}, ${unita_misura})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento dell'ingrediente ${ingrediente} nel luogo ${luogo}` }, { status: 500 });
    } finally {
        client.release();
    }
}