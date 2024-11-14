import { Ricetta } from "@/app/lib/definitions";
import { db } from "@vercel/postgres";
import { NextResponse } from 'next/server';

const yogurtAndCereali = {
    "ricetta": "Yogurt & Cereali",
    "secondo": false,
    "contorno": false,
    "snack_colazione_merenda": true,
    "frutta": 0,
    "vegetale": 0,
    "grasso aggiunto": 0,
    "latte/latticini": 1,
    "spezie": 0,
    "pesce": 0,
    "carne bianca": 0,
    "patate": 0,
    "uova": 0,
    "dolce": 0,
    "carne rossa": 0,
    "legumi": 0,
    "noci": 0,
    "cereale": 1
}

//let nextTipo = false;

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

/*
const getPorzioni = async () => {
    const client = await db.connect();
    const porzioni = await client.sql`SELECT * FROM tipo`;

    client.release();
    return porzioni.rows;
}


const getFrutta = async () => {
    const client = await db.connect();
    const frutta = await client.sql`SELECT nome AS ricetta, FALSE AS secondo, FALSE AS contorno, TRUE as snack_colazione_merenda,
                                    1 AS frutta,
                                    0 AS vegetale, 
                                    0 AS "grasso aggiunto", 
                                    0 AS "latte/latticini", 
                                    0 AS spezie, 
                                    0 AS pesce, 
                                    0 AS "carne bianca", 
                                    0 AS patate, 
                                    0 AS uova, 
                                    0 AS dolce, 
                                    0 AS "carne rossa", 
                                    0 AS legumi, 
                                    0 AS noci, 
                                    0 AS cereale
                                FROM ingredienti WHERE tipo = 'frutta'`;

    client.release();
    return frutta.rows;
}
*/

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

const selectRandomRicette = (menu, ricette, pranzi = 1, pranzo: string, giorno) => {

    ricette = ricette.filter(ricetta => !menu.includes(ricetta));

    for (let p = 0; p < pranzi; p++){
        const randomIndex = Math.floor(Math.random() * ricette.length);
        const ricetta = {... ricette[randomIndex], 'pranzo': pranzo, 'giorno': giorno + p};
        //console.debug(ricetta);
        menu.push(ricetta);
    }

    return menu;

    /*
    const selectedRicette = [];

    while (selectedRicette.length < pranzi){
        const randomIndex = Math.floor(Math.random() * ricette.length);
        const ricetta = ricette[randomIndex];
        selectedRicette.push(ricetta);
    }

    return selectedRicette;
    */
}

/*

const addSnackAndMerendeAndFrutti = (menu, frutta, merende = 1) => {

    for(let m = 0; m < merende; m++){
        const randomMerenda = Math.floor(Math.random() * frutta.length);
        const frutto = frutta[randomMerenda];
        menu.push(frutto);
    }

    return menu;
}

*/

const addColazioni = (menu, colazioni = 1, giorno) => {

    for(let c = 0; c < colazioni; c++){
        menu.push({... yogurtAndCereali, 'pranzo': `colazione`, 'giorno': giorno + c});
    }

    return menu;
}

/*

const checkPorzioniTotali = (menu, porzioni) => {
    const valori = {};
    porzioni.map(porzione => valori[porzione.nome] = 
        { porzioni: porzione.porzioni, menu: menu.reduce((somma, ricetta) => somma + parseInt(ricetta[porzione.nome]), 0) }
    )
    return valori;
}



const markFruttaAndVegetaliForReplace = (menu, ricette, addOrSubtract) => {
    let ricettaDaRimuovere = menu.filter(ricetta => !ricetta.snack_colazione_merenda).sort((a,b) => {
        if (a.frutta < b.frutta){
            return addOrSubtract;
        }else if (a.frutta > b.frutta){
            return -addOrSubtract;
        }else if (a.vegetale < b.vegetale){
            return addOrSubtract;
        }else if (a.vegetale > b.vegetale){
            return -addOrSubtract;
        }else{
            return 0;
        }
    });
    const minimumTipo = parseInt(ricettaDaRimuovere[0].frutta) + parseInt(ricettaDaRimuovere[0].vegetale);
    ricettaDaRimuovere = ricettaDaRimuovere.filter(ricetta => parseInt(ricetta.frutta) + parseInt(ricetta.vegetale) <= minimumTipo);
    const randomRemove = Math.floor(Math.random() * ricettaDaRimuovere.length);
    const ricettaRimossa = ricettaDaRimuovere[randomRemove];

    const ricettaDaAggiungere = ricette.filter(ricetta => parseInt(ricetta.frutta) + parseInt(ricetta.vegetale) > minimumTipo);
    //gestire il caso in cui non si possa andare avanti
    if (ricettaDaAggiungere.length == 0){
        nextTipo = true;
    }
    const randomAdd = Math.floor(Math.random() * ricettaDaAggiungere.length);
    const ricettaAggiunta = ricettaDaAggiungere[randomAdd];

    return {ricettaRimossa, ricettaAggiunta};
}



const markRicettaForReplace = (menu, ricette, tipo, addOrSubtract) => {
    let ricettaDaRimuovere = menu.filter(ricetta => !ricetta.snack_colazione_merenda).sort((a,b) => addOrSubtract < 0 ? a[tipo] - b[tipo] : b[tipo] - a[tipo]);
    //console.debug(ricettaDaRimuovere);
    const minimumTipo = ricettaDaRimuovere[0][tipo];
    ricettaDaRimuovere = ricettaDaRimuovere.filter(ricetta => ricetta[tipo] <= minimumTipo);
    const randomRemove = Math.floor(Math.random() * ricettaDaRimuovere.length);
    const ricettaRimossa = ricettaDaRimuovere[randomRemove];

    const ricettaDaAggiungere = ricette.filter(ricetta => ricetta[tipo] > minimumTipo);
    //gestire il caso in cui non si possa andare avanti
    if (ricettaDaAggiungere.length == 0){
        nextTipo = true;
    }
    const randomAdd = Math.floor(Math.random() * ricettaDaAggiungere.length);
    const ricettaAggiunta = ricettaDaAggiungere[randomAdd];

    return {ricettaRimossa, ricettaAggiunta};
}


const checkFruttaAndVegetali = (totali) => {
    return nextTipo || totali.frutta.menu + totali.vegetale.menu >= totali.frutta.porzioni + totali.vegetale.porzioni;
}

const adjustFruttaAndVegetali = (menu, ricette) => {
    //console.debug("adjustFrutta");
    //prendi una ricetta con pochi vegetali o frutta e che non sia snack o colazione
    const ricetta = markFruttaAndVegetaliForReplace(menu, ricette, -1);
    //sostituisci con una con valore più alto
    if (!nextTipo){
        menu = menu.filter(item => item.ricetta != ricetta.ricettaRimossa.ricetta);
        menu.push(ricetta.ricettaAggiunta);
    }
    return menu;
}

const adjustTipo = (menu, ricette, tipo, addOrSubtract) => {
    //console.debug(`adjust${tipo}`);
    const ricetta = markRicettaForReplace(menu, ricette, tipo, addOrSubtract);
    //sostituisci con una con valore più alto
    if (!nextTipo){
        menu = menu.filter(item => item.ricetta != ricetta.ricettaRimossa.ricetta);
        menu.push(ricetta.ricettaAggiunta);
    }
    return menu;
}

const checkPorzione = (tipo, totali) => {
    return nextTipo || Math.abs(totali[tipo].porzioni - totali[tipo].menu) < limitiPorzioni[tipo];
}



const limitiPorzioni = {
    "cereale" : 5,
    "pesce" : 2,
    "patate" : 2,
    "uova" : 2,
    "carne bianca": 2,
    "carne rossa": 1,
    "latte/latticini": 3,
    "legumi": 1
}

*/

export async function GET(request: Request, { params }: { params: { settimanaSelezionata: number} }) {

    const giorni = 7;

    let menuSettimanale = [];

    const client = await db.connect();
    const rows =  await client.sql`SELECT menu FROM menu_settimanale WHERE settimana_anno=${params.settimanaSelezionata}`;

    console.debug(rows);
    client.release();
    if (rows.rows.length > 0){
        return NextResponse.json(rows.rows, {status: 200});
    }

    //const porzioni = await getPorzioni();
    //const frutta = await getFrutta();
    let ricettePesate = await getRicettePesate();
    //crea secondi + contorni
    ricettePesate = createSecondiContorni(ricettePesate);

    //in base ai giorni seleziona: 1 colazione, 1 pranzo come qualcosa con pasta + frutta, 1 cena come un secondo + frutta, eventuali snack di frutta (max 2 al giorno)

    //marchia i pranzi selezionati con il tipo (e il numero del giorno?)
    for (let g = 0; g < giorni; g++){
        //aggiungi una colazione
        menuSettimanale = addColazioni(menuSettimanale, 1, g);
        //aggiungi un pranzo, filtrando mettendo precedenza sulla pasta
        menuSettimanale = selectRandomRicette(menuSettimanale, ricettePesate.filter(ricetta => ricetta.ricetta.toLowerCase().includes('pasta')), 1, 'pranzo', g);
        //aggiungi una cena, come sopra
        menuSettimanale = selectRandomRicette(menuSettimanale, ricettePesate.filter(ricetta => !ricetta.ricetta.toLowerCase().includes('pasta')), 1, 'cena', g);
        //console.debug(menuSettimanale.length);
    }

    //per ottimizzare i valori
    //se i valori sono troppo sballati (usando lo stesso criterio) sostituisci pranzo con pranzo, cena con cena etc

    /*
        //seleziona 14 ricette
        menuSettimanale = selectRandomRicette(ricettePesate, params.giorni * 2);
        //aggiungi 14 colazioni
        menuSettimanale = addColazioni(menuSettimanale, params.giorni);
        //aggiungi 28 merende e porzioni di frutta
        menuSettimanale = addSnackAndMerendeAndFrutti(menuSettimanale, frutta, params.giorni * 4);


    //controlla se i valori sono ok altrimenti prendi quella con il totale più distante e sostituiscila e cicla sulle restanti, una volta finito il ciclo sui totali, ricontrolla.
    const valori = checkPorzioniTotali(menuSettimanale, porzioni);

    //cerca di non duplicare i pranzi



    nextTipo = false;

    while (!checkFruttaAndVegetali(valori)){
        menuSettimanale = adjustFruttaAndVegetali(menuSettimanale, ricettePesate);
        valori = checkPorzioniTotali(menuSettimanale, porzioni);
    }

    console.debug(menuSettimanale.length);

    nextTipo = false;

    for (const tipo in Object.values(porzioni).filter(porzione => porzione.nome != "frutta" && porzione.nome != "vegetale" && porzione.nome != "grasso aggiunto" && porzione.nome != "spezie" && porzione.nome != "dolce" && porzione.nome != "noci")){
        const nome = Object.values(porzioni)[tipo].nome;
        while (!checkPorzione(nome, valori)){
            menuSettimanale = adjustTipo(menuSettimanale, ricettePesate, nome, valori[nome].porzioni - valori[nome].menu);
            valori = checkPorzioniTotali(menuSettimanale, porzioni);
        }
        nextTipo = false;
    }

    console.debug(menuSettimanale.length);
    console.debug(valori);
    */

    return NextResponse.json([{'menu': menuSettimanale}], {status: 200});
}