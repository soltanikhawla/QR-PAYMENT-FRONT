import { Actor } from "./Actor";
import { Mapping } from "./Mapping";
export interface Action {
    id_Action:number;
    creation_Date: Date;
    end_Date : string;
    status : string;
    external_ref: string;
    action: string;
    mapping:Mapping;
    actor:Actor;
    actionCount: number;
 }