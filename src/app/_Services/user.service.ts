import { environment } from './../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { User } from '../_Model/User';
import { UserAuthService } from './user-auth.service';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  [x: string]: any;

  private serviceUrl = 'https://dummyjson.com/users';
  user!:User;

  requestHeader = new HttpHeaders({
    "No-Auth": "True"
  });
  constructor(private httpclient: HttpClient,
    private userauthservice: UserAuthService) { }

  public Login(loginData: any) {
    return this.httpclient.post(environment.apiback+ "/api/auth/signin", loginData
      , { headers: this.requestHeader });
  }

  public Register(registerData: any) {
    return this.httpclient.post(environment.apiback + "/api/auth/signup", registerData
      , { headers: this.requestHeader });
  }

  public forUser() {
    return this.httpclient.get(environment.apiback + 'forUser', {
      responseType: 'text',
    });
  }


  public forAdmin() {
    return this.httpclient.get(environment.apiback + 'forAdmin', {
      responseType: 'text',
    });
  }

  public roleMatch(allowedRoles: any[]): boolean | any {
    let isMatch = false;
    const userRoles: any = this.userauthservice.getRoles();
    console.log('userRoles: '+userRoles);

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          console.log('userRoles[i].name : ' + userRoles[i].name);
          if (userRoles === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
  }


  getCurrentUser(): Observable<User>{
    return this.httpclient.get<User>(environment.apiback + "/api/auth/currentUser");
  }
  
  public getUser(): Observable<User> {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      return of(parsedUser); // Utilisez 'of' pour créer un observable à partir de la valeur
    }
  
    return of({} as User); // Utilisez 'of' pour créer un observable avec une valeur par défaut
  }

  getUsers(): Observable<User[]> {
    return this.httpclient
      .get(this.serviceUrl)
      .pipe<User[]>(map((data: any) => data.users));
  }

  updateUser(user: User): Observable<User> {
    return this.httpclient.patch<User>(`${this.serviceUrl}/${user.id}`, user);
  }

  addUser(user: User): Observable<User> {
    return this.httpclient.post<User>(`${this.serviceUrl}/add`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.httpclient.delete<User>(`${this.serviceUrl}/${id}`);
  }

  deleteUsers(users: User[]): Observable<User[]> {
    return forkJoin(
      users.map((user) =>
        this.httpclient.delete<User>(`${this.serviceUrl}/${user.id}`)
      )
    );
  }
  public getAllUsers(): Observable<User[]>{
    return this.httpclient.get<User[]>(environment.apiback+"/api/auth/allUsers", { headers: this.requestHeader });

  }
}