import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserAuthService } from '../_Services/user-auth.service';
import { AutoLogoutService } from '../_Services/auto-logout.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userAuthServce: UserAuthService,
    private router: Router,
    private autoLogoutService: AutoLogoutService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }
    const Token = this.userAuthServce.getToken();

    req = this.addToken(req, Token);
    // Réinitialiser la minuterie de déconnexion
    this.autoLogoutService.resetTimer();

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if (err.status === 401) {
          this.router.navigate(['/500']);
        } else if (err.status === 403) {
          this.router.navigate(['/Forbidden']);
        }
        return throwError(err);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}