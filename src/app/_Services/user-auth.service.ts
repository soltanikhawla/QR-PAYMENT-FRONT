import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {


 private authToken: string | null = null;
  constructor() { }

  public setRoles(roles: []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): [] {
    return JSON.parse(localStorage.getItem('roles')!);
  }

  public setToken(jwtToken : string){
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken() : string{
    return localStorage.getItem("jwtToken")!;
  }

  public saveToken(jwtToken: string) {
      window.sessionStorage.removeItem("jwtToken");
      window.sessionStorage.setItem("jwtToken", jwtToken);
    }
  
 
    public saveUser(user: any) {
      window.sessionStorage.removeItem("jwtToken");
      window.sessionStorage.setItem("jwtToken", JSON.stringify(user));
      console.log("console1:"+JSON.stringify(user))
    }



    // ...
    
    isValidToken(token: string): boolean {
      const decodedToken: JwtPayload | undefined = jwtDecode(token);
    
      // Check if decodedToken is not undefined and exp property is present
      if (decodedToken && decodedToken.exp) {
        const expirationDate = decodedToken.exp * 1000;
        return expirationDate > Date.now();
      }
    
      // Token is invalid if it's not decoded or doesn't have an expiration property
      return false;
    }

  public clear(){
    localStorage.clear();
  }

  public IsLoggedIn(){
    return this.getRoles() && this.getToken();
  }
  public IsAdmin(){
    const roles : any[] = this.getRoles();
    return roles.includes("ROLE_ADMIN");
  }

  public IsUser(){
    const roles : any[] = this.getRoles();
    return roles.includes("ROLE_USER");
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  public resetToken() {
    localStorage.removeItem('jwtToken');
  }
}
