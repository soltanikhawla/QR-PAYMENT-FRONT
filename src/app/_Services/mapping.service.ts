import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cible } from '../views/files/cible-file/cible';
import { Source } from '../views/files/source-file/source';
import { Mapping } from '../_Model/Mapping';
import { UserAuthService } from './user-auth.service';


@Injectable({
  providedIn: 'root'
})

export class MappingService {

  constructor(
    private http: HttpClient,private authService: UserAuthService) { }

  private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }

  getFileNameSByIdProject(projectId: any): Observable<Source[]> {
    const url = `${environment.apiback}/source/itemsSource?projectId=${projectId}`;
    return this.http.get<Source[]>(url,this.getHeaders());
  }

  getFileNameTByIdProject(projectId: any): Observable<Cible[]> {
    const url = `${environment.apiback}/target/itemsTarget?projectId=${projectId}`;
    return this.http.get<Cible[]>(url,this.getHeaders());
  }

  get<T>(endpoint: string, params: { [key: string]: any }): Observable<T> {
    return this.http.get<T>(`${environment.apiback}/${endpoint}`, { params });
  }

  getItemsByFileAndProjectId(files: string[],projectId: any): Observable<any[]> {
    // Build the query parameters
    const params = new HttpParams()
      .set('files', files.join(','))
      .set('projectId', projectId.toString());

    // Make the HTTP GET request
    return this.http.get<any[]>(`${environment.apiback}/target/itemsTarget/file`, {
      params,
    });
  }

  saveMapping(projectId: any, mappingData: any): Observable<any> {
    return this.http.post(`${environment.apiback}/mapping/save/${projectId}`, mappingData,this.getHeaders());
  }
  
  editMapping(projectId: any, mappingData: any): Observable<any>{
    return this.http.put(`${environment.apiback}/mapping/update/${projectId}`, mappingData,this.getHeaders());
  }

  updateStatus(files: string, idProject: any, newStatus: string): Observable<any> {

    const url = `${environment.apiback}/target/update-status`;

    const params = { files, idProject, newStatus };

    return this.http.post(url, params,this.getHeaders());

  }
  uploadFileMapping(idProject:any,file: FormData): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiback}/mapping/uploadMapping/${idProject}`, file,this.getHeaders());
   }
  // updateRegleGenerale(file: string, idProject: any, newRegle: string): Observable<any> {
  //   const url = `${environment.apiback}/target/updateRegle`;
  //   const params = { file, idProject, newRegle };
  //   return this.http.post(url, params,this.getHeaders());
  // }

  updateRegleGenerale(file: string, idProject: any, newRegle: any): Observable<any> {
    const url = `${environment.apiback}/target/updateRegle`;
   const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    // Use HttpParams to build the query parameters
    const params = new HttpParams()
      .set('file', file)
      .set('idProject', idProject)
      .set('newRegle', newRegle);

    // Use the params option in the request
    return this.http.post<any>(url, null, { params: params ,headers});
  }

  getStatus(files: any, idProject: any): Observable<string[]> {

    const params = new HttpParams().set('files', files).set('idProject', idProject.toString());
    return this.http.get<string[]>(`${environment.apiback}/target/status`, { params });
  }
 
  getStatusByFileNamesAndProjectId(

    files: string[],
    idProject: any): Observable<string[]> {
    const url = `${environment.apiback}/target/statuses`;
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    let params = new HttpParams();
    // Loop through the fileNames array and add each as a parameter
    files.forEach((file) => {
      params = params.append('files', file);
    });
    params = params.append('idProject', idProject.toString());
    // Make the GET request with the constructed parameters
    return this.http.get<string[]>(url, {headers, params });
  }

  getRuleByFileAndProjectId(files: string, idProject: any): Observable<string> {
    const url = `${environment.apiback}/target/regles?files=${files}&idProject=${idProject}`;
    return this.http.get<string>(url,this.getHeaders());

  }
  getMappingByIdProject(projectId: any): Observable<Mapping[]> {
    const url = `${environment.apiback}/mapping/list?projectId=${projectId}`;
    return this.http.get<Mapping[]>(url,this.getHeaders());

  }
  getMappingByIdMapping(mappingId: any): Observable<Mapping> {
    const url = `${environment.apiback}/mapping/${mappingId}`;
    return this.http.get<Mapping>(url,this.getHeaders());
  }
  
}

