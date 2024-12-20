import { Project } from './../../../../_Model/Project';
import { ActionsService } from 'src/app/_Services/actions.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from 'src/app/_Services/mapping.service';
import { Mapping } from 'src/app/_Model/Mapping';;
import { Actor } from 'src/app/_Model/Actor';
import Swal from 'sweetalert2';
import { ActorService } from 'src/app/_Services/actor.service';
import { ProjectService } from 'src/app/_Services/project.service';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-list-action.component.html',
  styleUrls: ['./add-list-action.component.scss']
})
export class AddListActionComponent implements OnInit {
  isSuccessful = false;
  isSignUpFailed = false;
  errorCible: any;
  errorSource: any;
  listActor!: any;
  listAction!: any;
  mappingAction !: Mapping;
  action = '';
  creation_Date = '';
  status = '';
  end_Date = '';
  idMapping!: number;
  tgt_Column_Name = '';
  fileName = '';
  parsedData: any;
  actor !: Actor;
  selectedActor: any;
  mapping !: Mapping
  project !: Project;
  constructor(private route: ActivatedRoute, private actionService: ActionsService, private fb: FormBuilder,
    private projectService:ProjectService, private actorService: ActorService, private mappingService: MappingService) {

  }

  _taggedMappingList!: { tgt_Column_Name: any; fileName: any; };

  ngOnInit(): void {
    this.getListActors();
    this.getProjectName();

    this.route.queryParams.subscribe(params => {
      this.idMapping = +params['id_Mapping'];
      console.log(this.idMapping);
      if (this.idMapping) {
        this.getMappingByIdMapping()
      } else {
        console.error('id_Mapping not found in the URL.');
      }
    });

    this.getMappingByIdMapping()
    this.getListAction()

  }

  getProjectName(): void {
     this.projectService.getProjectById((localStorage.getItem("project_id")))
     .subscribe(project => this.project = project);
     }

  getMappingByIdMapping() {
    this.mappingService.getMappingByIdMapping(this.idMapping).subscribe(data => {
      this.mappingAction = data;
      console.log(this.mappingAction);
    });
  }

  getListActors() {
    this.actorService.getActorByProjectId(localStorage.getItem("project_id")).subscribe(data => {
      this.listActor = data;
      console.log(this.listActor);

    })
  }

  getListAction() {
    this.actionService.getActionsByIdMapping(this.idMapping).subscribe(data => {
      this.listAction = data;
      console.log(this.listAction);

    })

  }

  saveForm = this.fb.group({
    action: '',
    creation_Date: '',
    status: '',
    end_Date: '',
    external_ref: '',

  })

  onActorSelectionChange(event: any) {
    this.selectedActor = Number(event.target.value);
    console.log(this.selectedActor);
  }

  savingData(saveForm: FormGroup) {
    console.log(saveForm);
    this.actionService.createActionsByIdMappindAndIdActor(this.idMapping, this.selectedActor, saveForm.value).subscribe(
      (data) => {
        console.log("console 3 : " + JSON.stringify(data));
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        if (data) {
          Swal.fire('Success', 'Action created successfully', 'success');
          this.getListAction();
          saveForm.reset();
        } 
      },
      (err) => {
        this.errorCible = err.error.colCible;
        this.isSignUpFailed = true;
        Swal.fire('Error', 'An error occurred while adding action', 'error');
      }
    );
  }

}
