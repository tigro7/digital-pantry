'use server'

import { Ingrediente_Ricetta } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { ricetta: string} }) {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT ingrediente, quantita, unita_misura FROM ingredienti_ricette WHERE ricetta=${params.ricetta}`;

    return NextResponse.json(rows.rows, {status: 200});

}

export async function POST(request: Request, { params }: { params: { ricetta: string} }) {

    const client = await db.connect();
    const body: Ingrediente_Ricetta = await request.json();
    const { ingrediente, quantita, unita_misura } = body;

    try {
        const result = await client.sql`
            INSERT INTO ingredienti_ricette (ricetta, ingrediente, quantita, unita_misura)
            VALUES (${params.ricetta}, ${ingrediente}, ${quantita}, ${unita_misura})
            RETURNING ingrediente, quantita, unita_misura;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento dell'ingrediente ${ingrediente} nella ricetta ${params.ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: Request, { params }: { params: { ricetta: string} }) {

    const client = await db.connect();
    const body: Ingrediente_Ricetta = await request.json();

    const { ingrediente, quantita, unita_misura} = body;

    try {
        const result = await client.sql`
            UPDATE ingredienti_ricette
            SET ingrediente=${ingrediente}, quantita=${quantita}, unita_misura=${unita_misura}
            WHERE ricetta=${params.ricetta} AND ingrediente=${ingrediente}
            RETURNING ingrediente, quantita, unita_misura;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il record aggiornato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'aggiornamento dell'ingrediente ${ingrediente} nella ricetta ${params.ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: { ricetta: string} }) {

    const client = await db.connect();
    const body: Ingrediente_Ricetta = await request.json();

    const { ingrediente } = body;

    try {
        const result = await client.sql`
            DELETE FROM ingredienti_ricette
            WHERE ricetta=${params.ricetta} AND ingrediente=${ingrediente}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente eliminato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'eliminazione dell'ingrediente ${ingrediente} dalla ricetta ${params.ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}