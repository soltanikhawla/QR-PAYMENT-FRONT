import { Project } from "./Project";

export interface Rules {
     id_rule : Number;
     rule:String;
     description:string;
     status:string;
     project:Project;
 }