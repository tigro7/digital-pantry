'use server';

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ingrediente_Ricetta } from "@/app/lib/definitions";

export async function PUT(request: Request, { params }: { params: { ricetta: string, ingrediente: string} }) {

    const client = await db.connect();
    const body: Ingrediente_Ricetta = await request.json();

    const { ingrediente, quantita, unita_misura } = body;

    //console.debug(params, body);

    try {
        const result = await client.sql`
            UPDATE ingredienti_ricette
            SET ricetta=${params.ricetta}, ingrediente=${ingrediente}, quantita=${quantita}, unita_misura=${unita_misura}
            WHERE ricetta=${params.ricetta} AND ingrediente=${params.ingrediente}
            RETURNING *;
        `;

        //console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il record aggiornato
    } catch (error) {
        //console.debug(error);
        return NextResponse.json({ message: `Errore durante l'aggiornamento dell'ingrediente ${params.ingrediente} nella ricetta ${params.ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: { ricetta: string, ingrediente: string} }) {

    const client = await db.connect();

    try {
        const result = await client.sql`
            DELETE FROM ingredienti_ricette
            WHERE ricetta=${params.ricetta} AND ingrediente=${params.ingrediente}
            RETURNING *;
        `;

        //console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente eliminato
    } catch (error) {
        //console.debug(error);
        return NextResponse.json({ message: `Errore durante l'eliminazione dell'ingrediente ${params.ingrediente} nella ricetta ${params.ricetta}` }, { status: 500 });
    } finally {
        client.release();
    }
}