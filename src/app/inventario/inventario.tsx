/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import DataViewer from "@/app/components/DataViewer";
import { DataProps, Inventario} from "../lib/definitions";

const Dispensa = () => {

    const dataProperties: DataProps<Inventario> = [
        {name: "Luogo", key: "luogo", type: "select", apiEndpoint: "/api/luogo"}, {name: "Ingrediente", key: "ingrediente", type: "select", apiEndpoint:"/api/ingredienti"},
        {name: "Quantità", key: "quantita", type: "number"}, {name: "Unità di misura", key: "unita_misura", type: "select", apiEndpoint: "/api/unita"}
    ];

    return(
        <DataViewer url={`/api/inventario`} dataProps={dataProperties} keyProp={'ingrediente'} keyProps={["luogo", "ingrediente"]} crud="CRUD">
            <></>
        </DataViewer>
    )
}

export default Dispensa;