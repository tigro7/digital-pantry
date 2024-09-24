/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import DataViewer from "@/app/components/DataViewer";
import { DataProps, Ingrediente } from "../lib/definitions";

const Ingredienti = () => {

    const dataProperties: DataProps<Ingrediente> = [{name: "Nome", key: "nome", type: "text"}, {name: "Tipo", key: "tipo", type: "select", apiEndpoint: "/api/tipo"}];

    return(
        <DataViewer url={`/api/ingredienti`} dataProps={dataProperties} keyProp={'nome'} crud="CRUD">
            <></>
        </DataViewer>
    )
}

export default Ingredienti;