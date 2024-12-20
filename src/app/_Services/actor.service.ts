import { UserAuthService } from 'src/app/_Services/user-auth.service';
import { Actor } from './../_Model/Actor';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  
  constructor( private httpclient: HttpClient,private authService: UserAuthService) { }
  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }
  public addActor(actorData: any,id_PROJECT:any,):Observable<any> {
    return this.httpclient.post(environment.apiback+"/actor/create/"+ id_PROJECT, actorData, this.getHeaders());
  
  }
  
  
  public getAllActors(): Observable<Actor[]>{
    return this.httpclient.get<Actor[]>(environment.apiback+"/actor/list", this.getHeaders());
  }
  
  
  public deleteActor(idActor: any,):Observable<any> {
  return this.httpclient.delete(environment.apiback+"/actor/delete/"+ idActor, this.getHeaders());
  }
  
  getActorById(idActor: number,): Observable<Actor> {
  return this.httpclient.get<Actor>(environment.apiback+"/actor/" + idActor, this.getHeaders());
  }
  
  updateActorById(idActor:number,actor: Actor ,):Observable<any>{
  return this.httpclient.put(environment.apiback+"/actor/update/"+idActor,actor, this.getHeaders())
  }
  
  getActorByProjectId(idProject: any,): Observable<Actor> {
    return this.httpclient.get<Actor>(environment.apiback+"/actor/Project/" + idProject, this.getHeaders());
    }

  }

