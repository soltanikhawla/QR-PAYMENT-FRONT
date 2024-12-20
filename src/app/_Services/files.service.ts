import { environment } from 'src/environments/environment.development';
import { Source } from '../views/files/source-file/source';
import { Cible } from '../views/files/cible-file/cible';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserAuthService } from './user-auth.service';


@Injectable({

 providedIn: 'root'

})

export class FilesService {

  selectedFile: File | null = null;

  constructor(
    private httpclient: HttpClient,private authService: UserAuthService) { }

    private getHeaders() {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return { headers };
  }

 uploadFileS(file: FormData ): Observable<any[]>{
  return this.httpclient.post<any[]>(environment.apiback+"/source/uploadSource/", file,this.getHeaders());
 }
//  uploadFileC(file: FormData ): Observable<any[]>{
//   return this.httpclient.post<any[]>(environment.apiback+"/target/uploadTarget/" ,file,this.getHeaders());
//  }
uploadFileC(formData: FormData): Observable<any[]> {
  return this.httpclient.post<any[]>(environment.apiback + "/target/uploadTarget/", formData, this.getHeaders())
  .pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error)
      return throwError(error); 
    })
  );
}

 getItemsCible(): Observable<any[]> {

  return this.httpclient.get<any[]>(environment.apiback+"/target/list/",this.getHeaders());
  
 }

 getItemsSource(): Observable<any[]> {

    return this.httpclient.get<any[]>(environment.apiback+"/source/list/",this.getHeaders());
    
     }

 getItemsCibleByName(Name: string): Observable<Cible[]> {

      return this.httpclient.get<Cible[]>(environment.apiback+"/target/Items/"+Name,this.getHeaders()); }

 getItemsSourceByName(Name: string): Observable<Source[]> {

      return this.httpclient.get<Source[]>(environment.apiback+"/source/Items/"+Name,this.getHeaders());}

  getAllSource(): Observable<Source[]> {

      return this.httpclient.get<Source[]>(environment.apiback+"/source/file",this.getHeaders());
    
     }
  getAllCible(): Observable<Cible[]> {

      return this.httpclient.get<Cible[]>(environment.apiback+"/target/file",this.getHeaders());
    
     }

     

  addItemToExistingFSource(fileName: string, newItem: any) {

      return this.httpclient.post(environment.apiback+"/source/addRow/"+fileName, newItem,this.getHeaders());
  
    }

  addItemToExistingFCible(fileName: string, newItem: any) {

      return this.httpclient.post(environment.apiback+"/target/addRow/"+fileName, newItem,this.getHeaders());
  
    }

  deleteItemsBySourceFName(fileName: string): Observable<any> {
      const url = `${environment.apiback}/source/deleteByFileName/${fileName}`;
      return this.httpclient.delete(url,this.getHeaders());
     
    }


  deleteItemsByCibleFName(fileName: string): Observable<any> {
      const url = `${environment.apiback}/target/deleteByFileName/${fileName}`;
      return this.httpclient.delete(url,this.getHeaders());
     
    }
    

  deleteRowSourceInExistingFile(id_item_source: number): Observable<any> {
      const url = `${environment.apiback}/source/deleteRow/${id_item_source}`;
    
      return this.httpclient.delete(url,this.getHeaders());
    }

  deleteRowCibleInExistingFile(id_item_cible: number): Observable<any> {
      const url = `${environment.apiback}/target/deleteRow/${id_item_cible}`;
    
      return this.httpclient.delete(url,this.getHeaders());
    }

  editItemInExistingFCible(itemId: number, updatedItem: Cible): Observable<Cible> {
      const url = `${environment.apiback}/target/editRow/${itemId}`;
      return this.httpclient.put<Cible>(url, updatedItem,this.getHeaders());
    }

  editItemInExistingFSource(itemId: number, updatedItem: Source): Observable<Source> {
      const url = `${environment.apiback}/source/editRow/${itemId}`;
      return this.httpclient.put<Source>(url, updatedItem,this.getHeaders());
    }


  // addProjectIdToFileS(files: string[], projectId: any): Observable<any> {
  //   const authToken = this.authService.getToken();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${authToken}`
  //   });
  //   let params = new HttpParams();
  //   files.forEach(file => {
  //     params = params.append('files', file);
  //   });
  //   params = params.append('ID_PROJECT', projectId);
  //   return this.httpclient.post(environment.apiback+'/source/ProjectFile', {}, { headers, params });
  // }
  
 
  // addProjectIdToFileC(files: string[], projectId: any): Observable<any> {
  //   const authToken = this.authService.getToken();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${authToken}`
  //   });
  //   let params = new HttpParams();
  //   files.forEach(file => {
  //     params = params.append('files', file);
  //   });
  //   params = params.append('ID_PROJECT', projectId);
  //   return this.httpclient.post(environment.apiback + '/target/ProjectFile', {}, { headers, params });
  // }

  updateItemSForProject(projectId: any, newFileNames: string[]): Observable<any> {
      const url = `${environment.apiback}/source/${projectId}/update-file`;
      return this.httpclient.post(url, newFileNames,this.getHeaders());
    }
    checkMappingExistsSource(projectId: any, fileName: string): Observable<boolean> {
      const url = `${environment.apiback}/mapping/checkMappingSource?projectId=${projectId}&fileName=${fileName}`;
      return this.httpclient.get<boolean>(url,this.getHeaders());
    }
    checkMappingExistsTarget(projectId: any, fileName: string): Observable<boolean> {
      const url = `${environment.apiback}/mapping/checkMappingTarget?projectId=${projectId}&fileName=${fileName}`;
      return this.httpclient.get<boolean>(url,this.getHeaders());
    }
  updateItemCForProject(projectId: any, newFileNames: string[]): Observable<any> {
      const url = `${environment.apiback}/target/${projectId}/update-file`;
      return this.httpclient.post(url, newFileNames,this.getHeaders());
    }

  getFileNameCByProject(idProject: any): Observable<any[]> {
      return this.httpclient.get<any[]>(environment.apiback+"/target/files/"+idProject,this.getHeaders());
    }

  getFileNameSByProject(idProject:any): Observable<any[]> {
      return this.httpclient.get<any[]>(environment.apiback+"/source/files/"+idProject,this.getHeaders());
    }

  getItemsCibleByNameAndDateCreation(): Observable<any[]> {
      return this.httpclient.get<any[]>(environment.apiback+"/target/listC",this.getHeaders());
    }

   getItemsSourceByNameAndDateCreation(): Observable<any[]> {
      return this.httpclient.get<any[]>(environment.apiback+"/source/listS",this.getHeaders());
    }
    private _isTableSourceOpen = false;
    private _isTableTargetOpen = false;

    get isTableSourceOpen(): boolean {
      return this._isTableSourceOpen;
    }
  
    toggleTableSourceOpen(): void {
      this._isTableSourceOpen = !this._isTableSourceOpen;
    }  
    get isTableTargetOpen(): boolean {
      return this._isTableTargetOpen;
    }
  
    toggleTableTargetOpen(): void {
      this._isTableTargetOpen = !this._isTableTargetOpen;
    }  
  }
