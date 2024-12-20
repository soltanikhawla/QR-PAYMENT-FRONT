import { ChangeDetectorRef, Component } from '@angular/core';
import { QrCodeService } from 'src/app/_Services/qr-code.service';
import { RulesService } from 'src/app/_Services/rules.service';
@Component({
  selector: 'app-generate-qrcode',
  templateUrl: './generate-qrcode.component.html',
  styleUrls: ['./generate-qrcode.component.scss']
})
export class GenerateQRCodeComponent {
  qrCodeImage: string | null = null; // Cette variable stocke l'image QR Code en base64
  qrText: string = '';
  activeTab: string = 'about';
  amount: number = 0;
  qrCodeUrl: string | null = null;

  generateQRCode() {
    this.qrCodeService.generateQRCode(this.amount).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'image/png' });
        this.qrCodeUrl = URL.createObjectURL(blob);
      },
      error: (err) => console.error('Error generating QR code', err)
    });
  }
  constructor(private qrCodeService: QrCodeService , private cdRef: ChangeDetectorRef) {}
  // generateQRCode(text: string): void {
  //   this.qrCodeService.generateQRCode(text).subscribe(
  //     (response: Blob) => {
  //       // Convert the image Blob to base64 string
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         this.qrCodeImage = reader.result as string;
  //       };
  //       reader.readAsDataURL(response);
  //     },
  //     (error: any) => {
  //       console.error('Erreur lors de la génération du QR Code:', error);
  //     }
  //   );
  // }

}
