import { Actor } from '../../../../_Model/Actor';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActorService } from 'src/app/_Services/actor.service';
import Swal from 'sweetalert2';

export class Group {

  level = 0;
  parent: Group | undefined;
  expanded = true;
  totalCounts = 0;
  [key: string]: any; 

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-add-actor',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.scss']
})
export class AddActorComponent {
  isSuccessful = false;
  isSignUpFailed = false;
  errorCible: any;
  errorSource: any;
  project_id!: any;
  listActor!:any;
  first_name = '';
  last_name = '';
  role = '';
  email = '';

  actor!: Actor[];
  _actor!: Actor;
  id_PROJECT!: any;
  newDate!: any;
  

  public DateNow = Date.now(); 
  submitted:boolean=false;
  public get MyDate() {
    return this.DateNow;  
  }
  public set MyDate(value) {
    this.DateNow = value;
  
  }
  constructor(private actorService:ActorService, private fb: FormBuilder) {
   
  }

  ngOnInit(): void {
    this.getListActors();
  }
    saveForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    role : ['', Validators.required],
    email : ['', Validators.required],
    
    
  })
  getListActors() {
    this.actorService.getActorByProjectId(localStorage.getItem("project_id")).subscribe(data => {
        this.listActor = data;
        console.log(this.listActor);

    })

}
savingData(saveForm: FormGroup): Promise<boolean> | undefined {
  if (saveForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill in all fields of the form.',
    });
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    this.actorService.addActor(saveForm.value, localStorage.getItem("project_id")).subscribe(
      (data: any) => {
        console.log("ahmed " + localStorage.getItem("id_PROJECT"));
        console.log("console 3 : " + JSON.stringify(data));
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Actor successfully added!',
        });
        this.getListActors();
        saveForm.reset();
        // this.router.navigate(['/projects/internal-list-a', { id_project: localStorage.getItem("project_id") }]);
        resolve(true);
      },
      (err: { error: { colCible: any; }; }) => {
        this.errorCible = err.error.colCible;
        this.isSignUpFailed = true;
        reject(false);
      }
    );
  });
}

}