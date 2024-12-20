import { ProjectService } from 'src/app/_Services/project.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_Model/User';
import { Cible } from '../../../files/cible-file/cible';
import { Project } from 'src/app/_Model/Project';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { concatMap, map } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
interface FilterObject {
  [key: string]: string;
}
@Component({
  selector: 'app-list-of-projects',
  templateUrl: './list-of-projects.component.html',
  styleUrls: ['./list-of-projects.component.scss']
})
export class ListOfProjectsComponent {
  filterValues: FilterObject = {};
  userC !: User;
  colCible : any;
  ItemS : any;
  cible !: Cible[];
  listP: Project[] = [];
  fileName : any;
  idProject:any;
  public favoriteColor = '#26ab3c';
  message =" ";
  projects !:Project[];
  project !: Project;
  versions: number[] = [];
  newDate!:any;
  projectVersion = 1;
  dataSource!: MatTableDataSource<Project>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  activeSearchField: string = '';
  public constructor(private projectService : ProjectService,private router :Router) {
   this.projectVersion = 1;
  }


  ngOnInit(): void {
       this.projectService.getProjectById(localStorage.getItem("project_id")).subscribe(data=>{
       this.project=data;
       this.newDate = moment(this.project.date_Creation).format(("YYYY-MM-DD"));
    })
    this.getListProjects();

  }
  ngAfterViewInit() {
    // Set initial sort state to descending for 'project_Name' column
    const sortState: Sort = {active: 'project_Name', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState); // Emit the sort change event to trigger the sorting
  }
  toggleSearchField(field: string) {
    this.activeSearchField = field;
  }

  resetSearchField() {
    this.activeSearchField = '';
  }
// getListProjects() {
//   this.projectService.getAllProjects().pipe(
//     concatMap((data: any[]) => {
//       if (data) {
//         this.listP = data;
//         this.versions = [];
//         return from(this.listP).pipe(
//           concatMap((project: any) =>
//             this.projectService.getProjectVersion(project.id_PROJECT).pipe(
//               map((version: number) => {
//                 this.versions.push(version);
//               })
//             )
//           )
//         );
//       } else {
//         return EMPTY; 
//       }
//     })
//   ).subscribe(() => {
//     console.log(this.listP);
//     console.log(" new date " + (this.listP.date_Creation).format(("YYYY-MM-DD")));
//     this.newDate = (this.listP.date_Creation).format(("YYYY-MM-DD"));
//   });
// }
getListProjects() {
  this.projectService.getAllProjects().pipe(
    concatMap((data: Project[]) => {
      if (data) {
        this.listP = data;
        this.versions = [];
        return from(this.listP).pipe(
          concatMap((project: Project) =>
            this.projectService.getProjectVersion(project.id_PROJECT).pipe(
              map((version: number) => {
                project.version = version;
              })
            )
          )
        );
      } else {
        return EMPTY;
      }
    })
    ).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.listP);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

createFilter(): (data: Project, filter: string) => boolean {
    let filterFunction = function(data: { project_Name: string; date_Creation: moment.MomentInput; version: { toString: () => string | any[]; }; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return (!searchTerms.project_Name || data.project_Name.toLowerCase().includes(searchTerms.project_Name)) &&
             (!searchTerms.date_Creation || moment(data.date_Creation).format('YYYY-MM-DD').includes(searchTerms.date_Creation)) &&
             (!searchTerms.version || data.version.toString().includes(searchTerms.version));
    }
    return filterFunction;
}

 applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
}

update(element:any):void{
  Swal.fire({
    html:
    '<div *ngFor="let element of project; let i=index">'+
    '<b>Name Project: </b>{{element.nameProject}} '+'<br>'+
    '<b>Date de creation:</b> '+'<br>'+
    '<b>Source file Name:</b> '+'<br>'+
    '<b>Cible file Name:</b> '+'<br>'+'</div>'
 
  })
}

updateProject(project_id:any, project_Name:any):void{
  console.log("console-2 :"+project_id);
  localStorage.setItem('project_id', project_id);
  localStorage.setItem('project_Name', project_Name);
  console.log("console-2 :"+project_id);
  console.log("console-3 :"+project_Name);
  this.router.navigate(['/projects/edit-project', {project_id: project_id}]);
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  const currentUrl = '/projects/edit-project';
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}


deleteProject(idProject: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your project has been deleted.',
        'success'
      );

      this.idProject = idProject;
      this.projectService.deleteProject(idProject).subscribe(
        () => {
          console.log('Suppression réussie');
          // Reload the current page after successful deletion
         
        },
        (error) => {
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'This project cannot be deleted.',
            });
          }
          if (error.status === 200) {
            Swal.fire('Success', 'Your project has been deleted', 'success');
            // window.location.reload();
            this.getListProjects()
          }
        }
      );
    }
  });
}

navigateToPage(id_project: number) {
    this.router.navigate(["/projects/internal-list-a"], { queryParams: { id_project: id_project } });
  }


createProjectVersion(project_id: any): void  { 
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to versioning this project ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Success!',
        'New version created successfully.',
        'success'
      );
      const currentUrl = '/projects/list-of-projects';
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      this.getListProjects()
      this.projectService.createProjectVersion(project_id).subscribe(
        () => {
          console.log('Suppression réussie')
         
        },
        (error) => {
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'This project cannot be deleted.',
            });
          }
          if (error.status === 200) {
           // Swal.fire('Succès', 'New version created successfully.', 'success')
            this.getListProjects()
          }
        }
      );
    }
  });
}

//displayedColumns = ['project_Name', 'date_Creation', 'version', 'edit', 'delete', 'backup'];
displayedColumns: string[] = ['project_Name', 'date_Creation', 'version', 'actions'];

displayedColumnsFilters: string[] = ['project_Name', 'date_Creation', 'version', 'actions'];

}