import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UserAuthService } from './user-auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Rules } from '../_Model/Rules';
import { GeneraleRule } from '../_Model/GeneraleRule';
@Injectable({
  providedIn: 'root'
})
export class RulesService {

  constructor(
    private http: HttpClient,private authService: UserAuthService) { }

  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }
  createRules(projectId: any, rulesData: any): Observable<any> {
    return this.http.post(`${environment.apiback}/rules/create/${projectId}`, rulesData,this.getHeaders());
  }

  public getListRulesByProject(projectId: any): Observable<Rules[]>{
    const url = `${environment.apiback}/rules/list?projectId=${projectId}`;
    return this.http.get<Rules[]>(url, this.getHeaders());
  }
  public deleteRules(idRules: any,):Observable<any> {
    return this.http.delete(environment.apiback+"/rules/delete/"+ idRules, this.getHeaders());
    }

  getRulesById(RulesId: any): Observable<Rules> {
    return this.http.get<Rules>(environment.apiback+"/rules/" + RulesId, this.getHeaders());
  }
  updateRuleById(idRules:any,Rule: Rules):Observable<any>{
    return this.http.put(environment.apiback+"/rules/update/"+ idRules,Rule, this.getHeaders())
  }
  getGeneralRuleByIdProjectAndFilename(filename: string, idProject: any): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiback}/rules/generaleRule/${filename}/${idProject}`,this.getHeaders());
  }

  // createG(filename: string, projectId: any, generalrule: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  
  //   const data = {
  //     generalrule: generalrule,
  //     project: { id: projectId }
  //   };
  
  //   return this.http.post(`${environment.apiback}/rules/creategeneralrule/${filename}/${projectId}`, JSON.stringify(data), { headers });
  // }
  createG(filename: string, projectId: any, generalRule: GeneraleRule): Observable<GeneraleRule> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {generalrule: generalRule,project: { id: projectId }};
    return this.http.post<GeneraleRule>(`${environment.apiback}/rules/creategeneralrule/${filename}/${projectId}`,generalRule,{headers});
  }
 
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something bad happened; please try again later.');
  }
  updateGeneralRuleById(idGeneralRule:any,generalrule: GeneraleRule):Observable<any>{
    return this.http.put(environment.apiback+"/rules/updateGeneralRule/"+ idGeneralRule,generalrule, this.getHeaders())
  }
}
