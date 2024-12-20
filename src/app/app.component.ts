import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';



import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { UserAuthService } from './_Services/user-auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Data Mapping Application';
  loading: boolean = true;
  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,private userAuthService: UserAuthService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
    this.loading = false;
    const token = this.userAuthService.getToken();

    // Vérifie si le token est présent et valide
    if (!token || !this.userAuthService.isValidToken(token)) {
      // Redirection vers la page de connexion si le token n'est pas valide
      this.router.navigate(['/login']);
    }
  }

  
  
}
