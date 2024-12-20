import { Component, ViewChild } from '@angular/core';
import { navItems } from './_nav';
import { SettingsService } from 'src/app/_Services/settings.service';
import { ROUTES } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls:['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  isSidebarNarrow = false;
  public navItems = navItems;
  isSubMenuOpen1: boolean = false;
  isSubMenuOpen2: boolean = false;
  isSubMenuOpen3: boolean = false;
  isSubMenuOpen4: boolean = false;
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  public color!: string;
  public menuItems: object;
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;
  constructor(public settingsService: SettingsService) {
    this.menuItems = ROUTES;
    this.activeFontColor = 'rgba(0,0,0,.6)';
    this.normalFontColor = 'rgba(255,255,255,.8)';
    this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
  }


  toggleSubMenu1(subMenu: HTMLDivElement): void {
    this.isSubMenuOpen1 = !this.isSubMenuOpen1;
    if (this.isSubMenuOpen1) {
      subMenu.style.display = 'block';
    } else {
      subMenu.style.display = 'none';
    }
  }
  toggleSubMenu2(subMenu: HTMLDivElement): void {
    this.isSubMenuOpen2 = !this.isSubMenuOpen2;
    if (this.isSubMenuOpen2) {
      subMenu.style.display = 'block';
    } else {
      subMenu.style.display = 'none';
    }
  }
  toggleSubMenu3(subMenu: HTMLDivElement): void {
    this.isSubMenuOpen3 = !this.isSubMenuOpen3;
    if (this.isSubMenuOpen3) {
      subMenu.style.display = 'block';
    } else {
      subMenu.style.display = 'none';
    }
  }
  toggleSubMenu4(subMenu: HTMLDivElement): void {
    this.isSubMenuOpen4 = !this.isSubMenuOpen4;
    if (this.isSubMenuOpen4) {
      subMenu.style.display = 'block';
    } else {
      subMenu.style.display = 'none';
    }
  }
  ngOnInit() {
    this.color = this.settingsService.getSidebarFilter();
    this.settingsService.sidebarFilterUpdate.subscribe((filter: string) => {
      this.color = filter;
      if (filter === '#fff') {
        this.activeFontColor = 'rgba(0,0,0,.6)';
      }else {
        this.activeFontColor = 'rgba(255,255,255,.8)';
      }
    });
    this.settingsService.sidebarColorUpdate.subscribe((color: string) => {
      if (color === '#fff') {
        this.normalFontColor = 'rgba(0,0,0,.6)';
        this.dividerBgColor = 'rgba(0,0,0,.1)';
      }else {
        this.normalFontColor = 'rgba(255,255,255,.8)';
        this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
      }
    });
  }
  ngOnDestroy() {
    this.settingsService.sidebarFilterUpdate.unsubscribe();
    this.settingsService.sidebarColorUpdate.unsubscribe();
  }

  ngAfterViewInit() {
  }

  toggleSidebar() {
    this.isSidebarNarrow = !this.isSidebarNarrow;
  }
}
