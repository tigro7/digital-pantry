export interface Ingrediente {
    nome: string;
    tipo: string;
}

export interface Luogo {
    nome: string;
}

export interface Ricetta {
    nome: string;
    procedimento: string;
    persone: number;
    ingredienti?: [Ingrediente_Ricetta];
}

export interface Tipo {
    nome: string;
    porzioni: number;
}

export interface Unita_Misura {
    nome: string;
    simbolo: string;
}

export interface Inventario {
    quantita: number;
    luogo: string;
    ingrediente: string;
    unita_misura: string;
}

export interface Ingrediente_Ricetta {
    ricetta: string;
    ingrediente: string;
    quantita: number;
    unita_misura: string;
}

export interface DataProp<T> {
    name: string;
    key: keyof T;
    type: 'text' | 'number' | 'select' | 'Object';
    fields?: DataProp<never>[]; //campi del tipo Object
    apiEndpoint?: string; //Se è un select con endpoint
    optionValue?: string; //Valore delle sotto-opzioni, 'nome' di default
    optionLabel?: string; //Descrizione delle sotto-opzioni, 'nome' di default
    subKey?: string, //chiave aggiuntiva, nel caso di Object e quindi relazioni molti a molti.
    render?: (item: unknown) => unknown; //modalità di render personalizzata, chiamare una funzione a cui vengono restituiti tutti i valori dell'oggetto
    className?: (item: unknown) => unknown; //sovrascrittura con classe dal file TypeScript, chiamare una funzione a cui vengono restituiti tutti i valori dell'oggetto
}

export type DataProps<T> = DataProp<T>[];
