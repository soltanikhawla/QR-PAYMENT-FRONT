import { ProjectService } from 'src/app/_Services/project.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { FilesService } from 'src/app/_Services/files.service';
import swal from 'sweetalert2';
import { catchError, of } from 'rxjs';
import { Project } from 'src/app/_Model/Project';
import { ActionsService } from 'src/app/_Services/actions.service';

@Component({
  selector: 'app-edit-project-labels',
  templateUrl: './editProject.component.html',
  styleUrls: ['./editProject.component.scss']
})
export class EditProjectComponent implements OnInit {
  idProject!: any;
  project !: Project;
  newDate!:any;
  itemS: any[] = [];
  itemSource :any;
  itemCible:any;
  itemC: any[] = [];
  listAction: any;
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

  constructor(private projectService:ProjectService,private route:ActivatedRoute, private fb: FormBuilder,private file: FilesService,
    private actionService :ActionsService) { }

  ngOnInit(): void {
   
    this.projectService.getProjectById(localStorage.getItem("project_id")).subscribe(data=>{
      this.project=data;
       this.newDate = moment(this.project.date_Creation).format(("YYYY-MM-DD"));
       this.getProjectVersion(this.project.id_PROJECT);
    })
    this.getItemsSource();
    this.getItemSForProject();

    this.getItemsCible();
    this.getItemCForProject();
    
    this.getListActions();
    this.triggerRefresh();
  }

  private triggerRefresh() {
    setTimeout(() => {
      this.getItemsSource();
      this.getItemSForProject();
      this.getItemsCible();
      this.getItemCForProject();
      this.getListActions();
    }, 300);
  }


  onSearchS() {
    this.itemSource = this.filteredItemS;
  }
  onSearchC() {
    this.itemCible = this.filteredItemC;
  }
  

  updateProject(){
    this.projectService.updateProjectById(localStorage.getItem("project_id"),this.project).subscribe(data =>{
    console.log(data);
  })
}

getProjectVersion(projectId: any) {
 
  this.projectService.getProjectVersion(projectId).subscribe((version: number) => {
    this.project.version = version;
  }, (error) => {
    console.error('Erreur lors de la récupération de la version du projet :', error);
  });

}

saveForm = this.fb.group({
  project_Name: [''],
  date_Creation: [''],
  status : [''],
  version : [''],
  
  
})

getItemSForProject() {
  this.file.getFileNameSByProject(localStorage.getItem("project_id"))
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
  this.file.getFileNameCByProject(localStorage.getItem("project_id"))
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

      const filteredItemsWithoutDuplicates = this.itemC.filter(item => {
        return !itemsForProject.some(projectItem => projectItem.item === item.item);
      });

      this.itemCible = [...itemsForProject, ...filteredItemsWithoutDuplicates];
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

  toggleItemSelectionS(itemObj: any) {
    if (itemObj.checked) {
      this.selectedItemS.push(itemObj.item);
    } else {
      const index = this.selectedItemS.findIndex(selectedItem => selectedItem === itemObj.item);
      if (index !== -1) {
        this.selectedItemS.splice(index, 1);
      }
    }
  }


  toggleItemSelectionC(itemObj: any) {
    if (itemObj.checked) {
      this.selectedItemC.push(itemObj.item);
    } else {
      const index = this.selectedItemC.findIndex(selectedItem => selectedItem === itemObj.item);
      if (index !== -1) {
        this.selectedItemC.splice(index, 1);
      }
    }
  }
  
 
    
ButtonFunction() { 
  this.updateProject()
  this.updateItemS()
  this.updateItemC()
  

  swal.fire({
    title: "Project updated",
    text: "Successfully",
    icon: "success"
  });
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
        // Handle success
      },
      error => {
        console.error('Error updating items', error);
        // Handle error
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
        // Handle error
      }
    );
}


getListActions() {
  this.actionService.getActionsByProjectId(localStorage.getItem("project_id")).subscribe(data => {
      this.listAction = data;
      console.log(this.listAction);

  })

}


}
