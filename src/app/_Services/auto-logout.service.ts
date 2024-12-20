import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class AutoLogoutService {
  private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 heure en millisecondes
//private readonly INACTIVITY_TIMEOUT = 120000  // // 2 min  en millisecondes
  private logoutTimer: any;

  constructor(private router: Router,private userauthservice: UserAuthService) {
    this.initListener();
    this.initTimer();
  }

  private initListener(): void {
    document.body.addEventListener('click', () => this.resetTimer());
    document.body.addEventListener('mouseover', () => this.resetTimer());
    document.body.addEventListener('mouseout', () => this.resetTimer());
    document.body.addEventListener('keydown', () => this.resetTimer());
    document.body.addEventListener('keyup', () => this.resetTimer());
    document.body.addEventListener('keypress', () => this.resetTimer());
  }

  private initTimer(): void {
    this.logoutTimer = setTimeout(() => this.logout(), this.INACTIVITY_TIMEOUT);
  }

  public resetTimer(): void {
    clearTimeout(this.logoutTimer);
    this.initTimer();
  }

  private logout(): void {
    // Réinitialisation du jeton d'authentification
    this.userauthservice.resetToken();
    // Redirection vers la page de connexion ou une autre page appropriée
    this.router.navigate(['/login']);
  }
}