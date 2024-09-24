'use server';

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ricetta } from "@/app/lib/definitions";

export async function PUT(request: Request, { params }: { params: { nome: string} }) {

    const client = await db.connect();
    const body: Ricetta = await request.json();

    const { nome, procedimento, persone } = body;

    try {
        const result = await client.sql`
            UPDATE ricette
            SET nome=${nome}, procedimento=${procedimento}, persone=${persone}
            WHERE nome=${params.nome}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il record aggiornato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'aggiornamento della ricetta ${params.nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: { nome: string} }) {

    const client = await db.connect();

    try {
        const result = await client.sql`
            DELETE FROM ricette
            WHERE nome=${params.nome}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce la ricetta eliminate
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'eliminazione della ricetta ${params.nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}