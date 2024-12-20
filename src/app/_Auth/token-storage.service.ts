import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private accessToken: string | null = null;

  constructor() { }

  signOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  public saveToken(jwt: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, jwt);
  }



  // Méthode pour obtenir le jeton d'accès actuel
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Méthode pour définir le jeton d'accès après une authentification réussie
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Méthode pour supprimer le jeton d'accès après la déconnexion
  clearAccessToken() {
    this.accessToken = null;
  }
  
}
