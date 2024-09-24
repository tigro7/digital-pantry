/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import DataViewer from "@/app/components/DataViewer";
import { DataProps, Ricetta} from "../lib/definitions";

const Ricette = () => {

    const dataProperties: DataProps<Ricetta> = [
        {name: "Nome", key: "nome", type: "text"}, {name: "Procedimento", key: "procedimento", type: "text"},
        {name: "Persone", key: "persone", type: "number"}, {name: "Ingredienti", key: "ingredienti", subKey: "ingrediente", type: "Object", apiEndpoint: "/api/ingredienti_ricette", fields: [
            { name: "Ingrediente", key: "ingrediente", type: "select", apiEndpoint: "/api/ingredienti" }, 
            { name: "Quantità", key: "quantita", type: "number" },
            { name: "Unità di Misura", key: "unita_misura", type: "select", apiEndpoint: "/api/unita" }
        ]},
    ];

    return(
        <DataViewer url={`/api/ricette`} dataProps={dataProperties} keyProp={'nome'} crud="CRUD">
            <></>
        </DataViewer>
    )
}

export default Ricette;