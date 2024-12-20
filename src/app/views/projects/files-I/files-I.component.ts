import { Component,OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Project } from 'src/app/_Model/Project';
import { FilesService } from 'src/app/_Services/files.service';
import { ProjectService } from 'src/app/_Services/project.service';
import swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-layout',
  templateUrl: './files-I.component.html',
  styleUrls: ['./files-I.component.scss']
})
export class FilesIComponent implements OnInit {

  idProject!: any;
  project !: Project;
  newDate!:any;
  itemS: any[] = [];
  itemSource :any;
  itemCible:any;
  itemC: any[] = [];
  selectedItemS: any[] = [];
  selectedItemC: any[] = [];
  searchQueryS: string = '';
  searchQueryC: string = '';
  combinedItems: boolean[] = [];

  fileNames: string[] = [];
  public DateNow = Date.now();
  submitted:boolean=false;
  public get MyDate() {
    return this.DateNow;  
  }
  public set MyDate(value) {
    this.DateNow = value;
  }

  constructor( private toastr: ToastrService,private snackBar: MatSnackBar,private router: Router,private projectService:ProjectService,
    private fb: FormBuilder,private file: FilesService) { }

  ngOnInit(): void {
   
    this.getItemsSource();
    this.getItemsCible();
    this.getItemSForProject();
    this.getItemCForProject();
    this.triggerRefresh();
    this.getProjectName();
  }

  private triggerRefresh() {
    setTimeout(() => {
      this.getProjectName();
      this.getItemsSource();
      this.getItemsCible();
      this.getItemSForProject();
      this.getItemCForProject();
    }, 300);
  }
  updateProject(){
    this.projectService.updateProjectById(localStorage.getItem("project_id"),this.project).subscribe(data =>{
    console.log(data);
  })
}


saveForm = this.fb.group({
  project_Name: [''],
  date_Creation: [''],
  status : [''],
  version : [''],
 
 
})

getProjectName(): void {
  this.projectService.getProjectById((localStorage.getItem("project_id"))).subscribe(project => 
    this.project = project);
  }
onSearchS() {
  this.itemSource = this.filteredItemS;
}
onSearchC() {
  this.itemCible = this.filteredItemC;
}

getItemSForProject() {
  this.file.getFileNameSByProject(localStorage.getItem('project_id'))
    .pipe(
      catchError(error => {
        console.error('Error fetching items for project:', error);
         this.getItemsSource();
        return of([]);
      })
    )
    .subscribe(data => {
      const itemsForProject = data.map(item => ({
        item: item,
        checked: true
      }));

      const filteredItemsWithoutDuplicates = this.filteredItemS.filter(item => {
        return !itemsForProject.some(projectItem => projectItem.item === item.item);
      });

      this.itemSource = [...itemsForProject, ...filteredItemsWithoutDuplicates];
    });
}
//get items not checked
getItemsSource() {
  this.file.getAllSource().subscribe(data => {
      this.itemS = data.map(item => ({
          item: item,
          checked: false 
         
      }));
      this.updateSelectedItemS();
  });
}

getItemCForProject() {

  this.file.getFileNameCByProject(localStorage.getItem('project_id'))
    .pipe(
      catchError(error => {
        console.error('Error fetching items for project:', error);
        this.getItemsCible();
        return of([]);
      })
    )
    .subscribe(data => {
      const itemsForProject = data.map(item => ({
        item: item,
        checked: true
      }));

      const filteredItemsWithoutDuplicates = this.filteredItemC.filter(item => {
        return !itemsForProject.some(projectItem => projectItem.item === item.item);
      });

      this.itemCible = [...itemsForProject, ...filteredItemsWithoutDuplicates];
      console.log(filteredItemsWithoutDuplicates);
      console.log(this.itemCible)
    });
}

getItemsCible() {
  this.file.getAllCible().subscribe(data => {
      this.itemC = data.map(item => ({
          item: item,
          checked: false 
      }));
      this.updateSelectedItemC();
  });
 
}

updateSelectedItemS() {
  this.selectedItemS = this.itemS
      .filter((itemObj: { checked: any; }) => itemObj.checked)
      .map((itemObj: { item: any; }) => itemObj.item);
}

updateSelectedItemC() {
  this.selectedItemC = this.itemC
      .filter((itemObj: { checked: any; }) => itemObj.checked)
      .map((itemObj: { item: any; }) => itemObj.item);
}

updateFiles() {
  this.updateSelectedItemS();
  this.updateSelectedItemC();
}

get filteredItemS() {
  return this.itemS.filter(itemObj =>
      itemObj.item.toLowerCase().includes(this.searchQueryS.toLowerCase())
  );
}
get filteredItemC() {
  
  return this.itemC.filter((itemObj: { item: string; }) =>
      itemObj.item.toLowerCase().includes(this.searchQueryC.toLowerCase())
  );
  
}

  // toggleItemSelectionS(itemObj: any) {
  //   if (itemObj.checked) {
  //     this.selectedItemS.push(itemObj.item);
  //   } else {
  //     const index = this.selectedItemS.findIndex(selectedItem => selectedItem === itemObj.item);
  //     if (index !== -1) {
  //       this.selectedItemS.splice(index, 1);
  //     }
  //   }
  // }
  toggleItemSelectionS(itemObj: any): void {
    if (itemObj.checked) {
      this.selectedItemS.push(itemObj.item);
    } else {
      const projectId = localStorage.getItem("project_id");
      if (projectId) {
        this.file.checkMappingExistsSource(projectId, itemObj.item).subscribe(
          exists => {
            if (exists) {
              // If a mapping exists, prevent unchecking
              itemObj.checked = true;
              this.toastr.warning('Cannot deselect this source file as a mapping exists for this file.', 'Warning', {
                toastClass: 'custom-toast-warning ngx-toastr',
                closeButton: true, 
                timeOut: 6000,
                progressBar: true,
                positionClass: 'toast-bottom-right',
                titleClass:'custom-toast-warning',
                extendedTimeOut:6000
              });
            } else {
              // If no mapping exists, allow unchecking
              const index = this.selectedItemS.findIndex(selectedItem => selectedItem === itemObj.item);
              if (index !== -1) {
                this.selectedItemS.splice(index, 1);
              }
            }
          },
          error => {
            console.error('Error checking mapping', error);
            itemObj.checked = true; // Prevent unchecking on error
          }
        );
      } else {
        console.error('Project ID not found in local storage');
      }
    }
  }
  // toggleItemSelectionC(itemObj: any) {
  //   if (itemObj.checked) {
  //     this.selectedItemC.push(itemObj.item);
  //   } else {
  //     const index = this.selectedItemC.findIndex(selectedItem => selectedItem === itemObj.item);
  //     if (index !== -1) {
  //       this.selectedItemC.splice(index, 1);
  //     }
  //   }
  // }
  toggleItemSelectionC(itemObj: any): void {
    if (itemObj.checked) {
      this.selectedItemC.push(itemObj.item);
    } else {
      const projectId = localStorage.getItem("project_id");
      if (projectId) {
        this.file.checkMappingExistsTarget(projectId, itemObj.item).subscribe(
          exists => {
            if (exists) {
              // If a mapping exists, prevent unchecking
              itemObj.checked = true;
              this.toastr.warning('Cannot deselect this target file as a mapping exists for this file.', 'Warning', {
                toastClass: 'custom-toast-warning ngx-toastr',
                closeButton: true, 
                timeOut: 6000,
                progressBar: true,
                positionClass: 'toast-bottom-right',
                titleClass:'custom-toast-warning',
                extendedTimeOut:6000
              });
            } else {
              // If no mapping exists, allow unchecking
              const index = this.selectedItemC.findIndex(selectedItem => selectedItem === itemObj.item);
              if (index !== -1) {
                this.selectedItemC.splice(index, 1);
              }
            }
          },
          error => {
            console.error('Error checking mapping', error);
            itemObj.checked = true; // Prevent unchecking on error
          }
        );
      } else {
        console.error('Project ID not found in local storage');
      }
    }
  }
ButtonFunction() {
  this.updateItemS()
  this.updateItemC()
  this.goToMapping()

   if (this.selectedItemS.length > 0 || this.selectedItemC.length > 0) {
    swal.fire({
      title: "Project updated",
      text: "Successfully",
      icon: "success"
    });
  } else {
    swal.fire({
      title: "No files selected",
      text: "Please select source or target files before updating.",
      icon: "error"
    });
  }
}
updateItemS(): void {
  const newFileNames = this.itemSource
        .filter((itemObj: { checked: any; }) => itemObj.checked)
        .map((itemObj: { item: any; }) => itemObj.item);
  let projectId= localStorage.getItem("project_id");  

  this.file.updateItemSForProject(projectId, newFileNames)
    .subscribe(
      response => {
        console.log('Items updated successfully', response);
       
      },
      error => {
        console.error('Error updating items', error);
       
      }
    );
}
updateItemC(): void {
  const newFileNames = this.itemCible
        .filter((itemObj: { checked: any; }) => itemObj.checked)
        .map((itemObj: { item: any; }) => itemObj.item);
  let projectId= localStorage.getItem("project_id");  

  this.file.updateItemCForProject(projectId, newFileNames)
    .subscribe(
      response => {
        console.log('Items updated successfully', response);
        // Handle success
      },
      error => {
        console.error('Error updating items', error);

      }
    );
}


goToMapping() {
  const idProject = localStorage.getItem("project_id");
  //const idMapping = localStorage.getItem("idMapping");
  this.router.navigate(['/projects/mapping'], {
    queryParams: { id_project: idProject }
  });
}

 }
