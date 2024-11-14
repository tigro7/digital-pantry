'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const client = await db.connect();
    const body = await request.json();
    const { menu, settimana_anno } = body;

    try {
        const result = await client.sql`
            INSERT INTO menu_settimanale (settimana_anno, menu)
            VALUES (${settimana_anno}, ${JSON.stringify(menu)})
            RETURNING *;
        `;

        console.debug(result);
        return NextResponse.json(result.rows[0], { status: 200 }); // Restituisce l'ingrediente inserito
    } catch (error) {
        console.debug(error);
        return NextResponse.json({ message: `Errore durante l'inserimento del menu della settimana ${settimana_anno}` }, { status: 500 });
    } finally {
        client.release();
    }
}