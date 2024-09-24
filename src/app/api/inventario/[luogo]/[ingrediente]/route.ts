'use server';

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';
import { Inventario } from "@/app/lib/definitions";

export async function PUT(request: Request, { params }: { params: { luogo: string, ingrediente: string} }) {

    const client = await db.connect();
    const body: Inventario = await request.json();

    const { luogo, ingrediente, quantita, unita_misura } = body;

    try {
        const result = await client.sql`
            UPDATE inventario
            SET luogo=${luogo}, ingrediente=${ingrediente}, quantita=${quantita}, unita_misura=${unita_misura}
            WHERE luogo=${params.luogo} AND ingrediente=${params.ingrediente}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce il record aggiornato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'aggiornamento dell'ingrediente ${params.ingrediente} nel luogo ${params.luogo}` }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: { luogo: string, ingrediente: string} }) {

    const client = await db.connect();

    try {
        const result = await client.sql`
            DELETE FROM inventario
            WHERE luogo=${params.luogo} AND ingrediente=${params.ingrediente}
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente eliminato
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'eliminazione dell'ingrediente ${params.ingrediente} nel luogo ${params.luogo}` }, { status: 500 });
    } finally {
        client.release();
    }
}