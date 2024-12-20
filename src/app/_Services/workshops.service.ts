import { Workshop } from './../_Model/Workshop';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UserAuthService } from './user-auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {

  constructor(
    private http: HttpClient,private authService: UserAuthService) { }

  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }
  createWorkshop(projectId: any, workshopData: any): Observable<any> {
    return this.http.post(`${environment.apiback}/workshops/create/${projectId}`, workshopData,this.getHeaders());
  }

  public getListWorkshopsByProject(projectId: any): Observable<Workshop[]>{
    const url = `${environment.apiback}/workshops/list?projectId=${projectId}`;
    return this.http.get<Workshop[]>(url, this.getHeaders());
  }
  SendEmailByIdWorkshop(idWorkshop: any): Observable<any> {
    return this.http.post<any>(environment.apiback + `/workshops/send-emails/${idWorkshop}`,null, this.getHeaders());
  }
  public deleteWorkshop(idWorkshop: any,):Observable<any> {
    return this.http.delete(environment.apiback+"/workshops/delete/"+ idWorkshop, this.getHeaders());
    }

  getWorkshopById(WorkshopId: any): Observable<Workshop> {
    return this.http.get<Workshop>(environment.apiback+"/workshops/" + WorkshopId, this.getHeaders());
  }
}
