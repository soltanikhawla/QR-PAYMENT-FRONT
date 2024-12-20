import { Project } from "src/app/_Model/Project";

export interface Cible {
     mappingRule: string;

     id_Item_Cible:number,
     file:string,
     fileName:string,
     column_Name: string,
     description: string,
     column_Type: string,
     status:boolean,
     mondatory:string,
     _key:string,
     comments:string,
     c1:string,
     c2:string,
     c3:string,
     c4:string,
     c5:string,
     id: number;
     project:Project

    }