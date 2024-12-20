import { Project } from "./Project";

export interface Workshop {
    idWorkshop:number;
    description: string;
    participants: string;
    mail_object: string;
    workshop_Date:Date;
    project:Project;
 }