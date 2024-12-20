import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  private apiUrl = 'http://localhost:8080/api/qr/generate';

  constructor(private http: HttpClient) {}
  // generateQRCode(text: string): Observable<Blob> {
  //   return this.http.get(this.apiUrl + `?text=${encodeURIComponent(text)}`, { responseType: 'blob' });
  // }

  generateQRCode( amount: number): Observable<Blob> {
    return this.http.get(this.apiUrl + `?amount=${amount}`, { responseType: 'blob' });
  }

}
