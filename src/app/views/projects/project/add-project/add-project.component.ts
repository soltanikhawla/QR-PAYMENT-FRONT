import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';

import { Project } from 'src/app/_Model/Project';
import { ProjectService } from 'src/app/_Services/project.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProject {

  

  isSuccessful = false;
  isSignUpFailed = false;
  errorCible: any;
  errorSource: any;

  project_Name = '';
  date_Creation = '';
  status = '';
  version = '';


  project!: Project[];
  _project!: Project;

  id_PROJECT!: any;
  newDate!: any;

  disableTextbox =  false;
  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  public DateNow = Date.now(); 
  submitted:boolean=false;
  public get MyDate() {
    return this.DateNow;  
  }
  public set MyDate(value) {
    this.DateNow = value;
  
  }
  constructor(private projectService:ProjectService, private fb: FormBuilder, private router:Router) {
    this.saveForm = this.fb.group({
      project_Name: ['', Validators.required],
      date_Creation: ['', Validators.required],
      status: ['', Validators.required],
      //version: ['', Validators.required],
      version:1,
    });
  }


  ngOnInit(): void {
  }

  updateProject(){
    this.projectService.updateProjectById(this.id_PROJECT,this._project).subscribe(data =>{
    console.log(data);
   
  })
}
    saveForm = this.fb.group({
    project_Name: [''],
    date_Creation: [''],
    status : [''],
    version : 1,

  })
 
  
  savingData(saveForm: FormGroup) {
    this.submitted = true;
  
    if (saveForm.valid) {
      this.projectService.addProject(saveForm.value).subscribe(
        (data) => {
          console.log("console 3 : " + JSON.stringify(data));
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          let myObj = JSON.parse(JSON.stringify(data));
          console.log("(myObj.id_PROJECT : " + myObj.id_PROJECT);
          localStorage.setItem("project_id", myObj.id_PROJECT);
          this.id_PROJECT = myObj.id_PROJECT;
          this.router.navigate(['/projects/add-actor', { project_id: this.id_PROJECT }]);
  
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Project added successfully!',
          });
        },
        (err) => {
          this.errorCible = err.error.colCible;
          this.isSignUpFailed = true;
  
          if (err.status === 409) {
            // Le code d'erreur 409 signifie que le projet existe déjà, affichez le message correspondant
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Project name already exists.',
            });
          } else {
            // Affichage d'une alerte d'erreur générique en cas d'erreur différente de 409
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add project. ' + this.errorCible,
            });
          }
          window.location.reload();
        }
      );
    }
  }
  
}