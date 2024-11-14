import { Ricetta } from '@/app/lib/definitions';
import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const getRicettePesate = async () => {
    const client = await db.connect();
    const ricettePesate = await client.sql`SELECT ricetta, secondo, contorno,
                                    SUM(CASE WHEN tipo = 'frutta' THEN count ELSE 0 END) AS frutta, 
                                    SUM(CASE WHEN tipo = 'vegetale' THEN count ELSE 0 END) AS vegetale, 
                                    SUM(CASE WHEN tipo = 'grasso aggiunto' THEN count ELSE 0 END) AS "grasso aggiunto", 
                                    SUM(CASE WHEN tipo = 'latte/latticini' THEN count ELSE 0 END) AS "latte/latticini", 
                                    SUM(CASE WHEN tipo = 'spezie' THEN count ELSE 0 END) AS spezie, 
                                    SUM(CASE WHEN tipo = 'pesce' THEN count ELSE 0 END) AS pesce, 
                                    SUM(CASE WHEN tipo = 'carne bianca' THEN count ELSE 0 END) AS "carne bianca", 
                                    SUM(CASE WHEN tipo = 'patate' THEN count ELSE 0 END) AS patate, 
                                    SUM(CASE WHEN tipo = 'uova' THEN count ELSE 0 END) AS uova, 
                                    SUM(CASE WHEN tipo = 'dolce' THEN count ELSE 0 END) AS dolce, 
                                    SUM(CASE WHEN tipo = 'carne rossa' THEN count ELSE 0 END) AS "carne rossa", 
                                    SUM(CASE WHEN tipo = 'legumi' THEN count ELSE 0 END) AS legumi, 
                                    SUM(CASE WHEN tipo = 'noci' THEN count ELSE 0 END) AS noci, 
                                    SUM(CASE WHEN tipo = 'cereale' THEN count ELSE 0 END) AS cereale
                                FROM (SELECT ricetta, tipo, COUNT(*) FROM ingredienti
                                JOIN ingredienti_ricette ON nome = ingrediente 
                                GROUP BY ricetta, tipo
                                ORDER BY ricetta) s
                                JOIN ricette ON ricetta = nome
                                GROUP BY ricetta, secondo, contorno`;

    client.release();
    return ricettePesate.rows;
}

const createSecondiContorni = (ricette) => {
    const ricetteConContorni: Ricetta[] = [];
    const ricetteConContorniNonFlat: Ricetta[] = [];
    ricetteConContorniNonFlat.push(
        ricette.filter(ricetta => ricetta.secondo).map(
            secondo => 
                ricette.filter(ric => ric.contorno).map(
                    contorno => ({
                        ricetta: `${secondo.ricetta} + ${contorno.ricetta} + pane`,
                        secondo: false,
                        contorno: false,
                        frutta: parseInt(secondo.frutta) + parseInt(contorno.frutta),
                        vegetale: parseInt(secondo.vegetale) + parseInt(contorno.vegetale),
                        'grasso aggiunto': parseInt(secondo['grasso aggiunto']) + parseInt(contorno['grasso aggiunto']),
                        'latte/latticini': parseInt(secondo['latte/latticini']) + parseInt(contorno['latte/latticini']),
                        spezie: parseInt(secondo.spezie) + parseInt(contorno.spezie),
                        pesce: parseInt(secondo.pesce) + parseInt(contorno.pesce),
                        'carne bianca': parseInt(secondo['carne bianca']) + parseInt(contorno['carne bianca']),
                        patate: parseInt(secondo.patate) + parseInt(contorno.patate),
                        uova: parseInt(secondo.uova) + parseInt(contorno.uova),
                        dolce: parseInt(secondo.dolce) + parseInt(contorno.dolce),
                        'carne rossa': parseInt(secondo['carne rossa']) + parseInt(contorno['carne rossa']),
                        legumi: parseInt(secondo.legumi) + parseInt(contorno.legumi),
                        noci: parseInt(secondo.noci) + parseInt(contorno.noci),
                        cereale: parseInt(secondo.cereale) + parseInt(contorno.cereale) + 1
                    })
                )
        )
    );
    for (const ricetta of ricetteConContorniNonFlat){
        for (const sotto in ricetta){
            if (typeof(ricetta[sotto]) == "object"){
                for(const sottosotto of ricetta[sotto]){
                    ricetteConContorni.push(sottosotto);
                }
            }
        }
    }
    for (const ricetta of ricette.filter(ricetta => !ricetta.secondo && !ricetta.contorno)){
        ricetteConContorni.push(ricetta);
    }
    //ricetteConContorni.push(ricette.filter(ricetta => !ricetta.secondo && !ricetta.contorno));
    return ricetteConContorni;
}

export async function GET() {    
    let ricettePesate = await getRicettePesate();
    //crea secondi + contorni
    ricettePesate = createSecondiContorni(ricettePesate);
    return NextResponse.json(ricettePesate, {status: 200});
}