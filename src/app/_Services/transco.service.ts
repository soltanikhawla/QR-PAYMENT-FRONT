import { environment } from 'src/environments/environment.development';
import { Transco } from './../_Model/Transco';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})

export class TranscoService {
  constructor(
    private httpclient: HttpClient,
    private authService: UserAuthService
  ) { }

  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }


  public addTransco(transcoData: any) {
    
    return this.httpclient.post(environment.apiback+"/transco/addTransco", transcoData, this.getHeaders());

  }

  public getAllTransco(): Observable<Transco[]>{
    return this.httpclient.get<Transco[]>(environment.apiback+"/transco/AllTransco", this.getHeaders());
  }
  public getTranscoByTrancoTable(): Observable<Transco[]>{
    return this.httpclient.get<Transco[]>(environment.apiback+"/transco/transcoTable", this.getHeaders());
  }

  public deleteTransco(idTransco: any):Observable<any> {
    const url = `${environment.apiback}/transco/deleteTransco?idTransco=${idTransco}`;
    return this.httpclient.delete(url,this.getHeaders());
  }

  // public deleteTransco(transcoTable: string,):Observable<any> {

  //   return this.httpclient.delete(environment.apiback+"/transco/deleteTransco/"+ transcoTable, this.getHeaders());
  // }






 


}
