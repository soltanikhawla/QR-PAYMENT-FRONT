import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { Action } from '../_Model/Action';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor( private httpclient: HttpClient,private authService: UserAuthService) { }
  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }
  createActionsByIdMappindAndIdActor(idMapping: any,actorId: any, actionsData: any): Observable<any> {
    return this.httpclient.post(`${environment.apiback}/action/create/${idMapping}/${actorId}`, actionsData,this.getHeaders());
  }

  getActionsByIdMapping(mappingId: any): Observable<Action> {
    const url = `${environment.apiback}/action/listAction/${mappingId}`;
    return this.httpclient.get<Action>(url,this.getHeaders());
  }

  public getAllActions(): Observable<Action[]>{
    return this.httpclient.get<Action[]>(environment.apiback+"/action/listActions", this.getHeaders());
  }


  getActionsByProjectId(idProject: any): Observable<Action> {
    return this.httpclient.get<Action>(environment.apiback+"/action/listActionsByProject/" + idProject, this.getHeaders());
    }
  
    updateActionByIdAction(idAction:number,action: Action ,):Observable<any>{
      return this.httpclient.put(environment.apiback+"/action/update/"+idAction,action, this.getHeaders())
      }
    
    getActionByIdAction(idAction: number,): Observable<Action> {
      return this.httpclient.get<Action>(environment.apiback+"/action/" + idAction, this.getHeaders());
      }

    public deleteAction(idAction: any,):Observable<any> {
      return this.httpclient.delete(environment.apiback+"/action/delete/"+ idAction, this.getHeaders());
  
    }
    
    
  getActionsByStatus(): Observable<any> {
    
    return this.httpclient.get<Action[]>(environment.apiback + `/action/countActionsByStatus`, this.getHeaders())
  
  }
  getActionsByActor(): Observable<any> {
    
    return this.httpclient.get<Action[]>(environment.apiback + `/action/count-by-actor`, this.getHeaders())
  
  }
            
}
