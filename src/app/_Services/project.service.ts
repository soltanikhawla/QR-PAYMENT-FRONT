import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../_Model/Project';
import { ProjectPercentage } from '../_Model/ProjectPercentage';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

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


  public addProject(projectData: any) {
    
    return this.httpclient.post(environment.apiback+"/project/create", projectData, this.getHeaders());

  }

  public getAllProjects(): Observable<Project[]>{
    

    return this.httpclient.get<Project[]>(environment.apiback+"/project/list", this.getHeaders());

  }
  public getProjectsByUserName(userName:string,): Observable<Project[]>{
    

    return this.httpclient.get<Project[]>(environment.apiback+"/project/list/"+userName, this.getHeaders());
  }

 public deleteProject(idProject: any,):Observable<any> {

  return this.httpclient.delete(environment.apiback+"/project/delete/"+ idProject, this.getHeaders());
}

getProjectById(idProject: any,): Observable<Project> {

  return this.httpclient.get<Project>(environment.apiback+"/project/" + idProject, this.getHeaders());
}

updateProjectById(idProject:any,project: Project, ):Observable<any>{
  
  return this.httpclient.put(environment.apiback+"/project/update/"+idProject,project, this.getHeaders())
}

public createProjectVersion(projectId: any) {
  return this.httpclient.post(environment.apiback + `/project/${projectId}/createVersion`, this.getHeaders());
}

public getProjectVersion(projectId: any): Observable<number> {
  return this.httpclient.get<number>(environment.apiback + `/project/latest-version/${projectId}`, this.getHeaders());
}

getNombreProjectDraft(): Observable<any> {
  return this.httpclient.get<number>(environment.apiback + `/project/nombreProjectDraft`, this.getHeaders())
}

getNombreProjectInProgress(): Observable<any> {
  return this.httpclient.get<number>(environment.apiback + `/project/nombreProjectInProgress`, this.getHeaders())
}

getNombreProjectDone(): Observable<any> {
  return this.httpclient.get<number>(environment.apiback + `/project/nombreProjectDone`, this.getHeaders())
}

getProjectByPourcentage(): Observable<any> {
  return this.httpclient.get<ProjectPercentage[]>(environment.apiback + `/project/percentage`, this.getHeaders())
}

}