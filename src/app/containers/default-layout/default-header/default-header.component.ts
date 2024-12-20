import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router,NavigationEnd} from '@angular/router';
import { HeaderComponent } from '@coreui/angular';
import { Project } from 'src/app/_Model/Project';
import { FilesService } from 'src/app/_Services/files.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls:['./default-header.component.css']
})
export class DefaultHeaderComponent extends HeaderComponent {
  ProjectName:any;
  idProject!:any;
  @Input() sidebarId: string = "sidebar";
  project!: Project;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  activePage: string | null = null;
  activePageEdit: string | null = null;
  name:any;
  isInMappingRoute: boolean = false;
  constructor(private router: Router,private filesService:FilesService) {
    super();
  }
  ngOnInit(): void {
    this.getProjectName();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActivePage(event.urlAfterRedirects);
      }
    });

    this.setActivePage(this.router.url)
    this.getUserName()
  }
  toggleSourceTable(): void {
    this.filesService.toggleTableSourceOpen();
  }
  toggleTargetTable(): void {
    this.filesService.toggleTableTargetOpen();
  }
 
  getUserName(){
    this.name=localStorage.getItem("user_name")
  }
  setActivePage(url: string): void {
    // Check if the current URL includes the path to files
    if (url.includes('/projects/files-I') ) {
      this.activePage = 'files' 
    }else if(url.includes('/projects/mapping')){
      this.activePage ='mapping'
    }else if(url.includes('/projects/add-actor')){
      this.activePage ='add-actor'
    }else if(url.includes('/projects/inter-list-actions')){
      this.activePage ='actions'
    }else if(url.includes('/projects/workshops')){
      this.activePage ='workshops'
    }else if(url.includes('/projects/rules')){
      this.activePage ='rules'
    }
     else {
      this.activePage = '';
    }
  }
  gotoaddActor():void{
     const currentUrl = this.router.url;
     if (currentUrl.includes('/projects/edit-project')) {
       const project_id = localStorage.getItem('project_id');
       if (project_id) {
         this.router.navigate(['/projects/add-actor'], { queryParams: { project_id: project_id } });
       }
     } else if (currentUrl.includes('/projects/files-I')|| 
       currentUrl.includes('/projects/mapping')|| 
       currentUrl.includes('projects/internal-list-a') || currentUrl.includes('projects/inter-list-actions')||
       currentUrl.includes('projects/workshops') || currentUrl.includes('projects/actions')) {
       const project_id = localStorage.getItem('project_id');

       if (project_id) {
         this.router.navigate(['/projects/add-actor'], { queryParams: { project_id: project_id } });
       }
     }
     this.activePage = 'add-actor';
   }
  
  gotoFiles(){
    this.router.navigate(['/projects/files-I', {id_project: localStorage.getItem("project_id") }]);
    this.activePage = 'files';
  }
  gotoMapping(){
    this.router.navigate(['/projects/mapping', {id_project: localStorage.getItem("project_id") }]);
    this.activePage = 'mapping';

  }

  gotoActions(){
    this.router.navigate(['/projects/inter-list-actions']);
    this.activePage = 'actions';
  }

  gotoWorkshops(){
    this.router.navigate(['/projects/workshops']);
    this.activePage = 'workshops';
  }
  gotoRules(){
    this.router.navigate(['/projects/rules']);
    this.activePage = 'rules';
  }

  isAddProjectRoute(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl.startsWith('/projects/files-') ||
      currentUrl.startsWith('/projects/mapping') ||
      currentUrl.startsWith('/projects/add-actor') ||
      currentUrl.startsWith('/projects/internal-list-a')||
      currentUrl.startsWith('/projects/edit-project')||
      currentUrl.startsWith('/projects/inter-list-actions')||
      currentUrl.startsWith('/projects/actions')||
      currentUrl.startsWith('/projects/edit-actions')||
      currentUrl.startsWith('/projects/workshops')||
      currentUrl.startsWith('/projects/viewWorkshop')||
      currentUrl.startsWith('/projects/rules')
    );
}
isAddProjectRoute1(): boolean {
  const currentUrl = this.router.url;
  return (
    currentUrl.startsWith('/files/source-file') || currentUrl.startsWith('/files/cible-file')
  );
}
isEditRoute(): boolean {
  const currentUrl = this.router.url;
  return (
    currentUrl.startsWith('/projects/files-') ||
      currentUrl.startsWith('/projects/mapping') ||
      currentUrl.startsWith('/projects/add-actor') ||
      currentUrl.startsWith('/projects/internal-list-a')||
      currentUrl.startsWith('/projects/edit-project')||
      currentUrl.startsWith('/projects/inter-list-actions')||
      currentUrl.startsWith('/projects/actions')||
      currentUrl.startsWith('/projects/edit-actions')||
      currentUrl.startsWith('/projects/workshops')||
      currentUrl.startsWith('/projects/viewWorkshop')||
      currentUrl.startsWith('/projects/rules')

  );
}
getProjectName(): void {
  // this.projectService.getProjectById((localStorage.getItem("project_id")))
  //   .subscribe(project => this.project = project);
    this.ProjectName=localStorage.getItem("project_Name")
}

}

