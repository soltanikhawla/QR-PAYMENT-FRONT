import { Project } from "./Project";

export interface Mapping {
    id_Mapping:number;
    id_version:number;
    fileNameT:string;
    fieldNumber:string;
    tgt_Column_Name:string;
    tgt_Column_Description:string;
    tgt_Column_Length:string;
    commentT:string
    fileNameS:string;
    src_Column_Name:string;
    src_Column_Description:string;
    src_Column_Length:string;
    commentS:string
    mappingRule:string;
    is_Transco:string | boolean;
    transco_table:string;
    comment:string;
    mapped:boolean;
    evolution:boolean;
    is_Mandatory:boolean;
    creation_Date:string;
    last_Modification:string;
    status:string;
    project:Project;
    defaultvalue:string;
   
 }