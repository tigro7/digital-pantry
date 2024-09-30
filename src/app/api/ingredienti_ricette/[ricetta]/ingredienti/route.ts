'use server'

import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { ricetta: string} }) {
    
    const client = await db.connect();
    const rows =  await client.sql`SELECT ingrediente FROM ingredienti_ricette WHERE ricetta=${params.ricetta}`;

    client.release();
    return NextResponse.json(rows.rows, {status: 200});

}