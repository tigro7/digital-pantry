'use server';

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Ingrediente } from "@/app/lib/definitions";

export async function PUT(request: Request, { params }: { params: { nome: string} }) {

    const client = await db.connect();
    const body: Ingrediente = await request.json();

    const { nome, tipo } = body;

    try {
        const result = await client.sql`
            UPDATE ingredienti
            SET nome=${nome}, tipo=${tipo}
            WHERE nome=${params.nome}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il record aggiornato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'aggiornamento dell'ingrediente ${params.nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: { nome: string} }) {

    const client = await db.connect();

    try {
        const result = await client.sql`
            DELETE FROM ingredienti
            WHERE nome=${params.nome}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente eliminato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'eliminazione dell'ingrediente ${params.nome}` }, { status: 500 });
    } finally {
        client.release();
    }
}