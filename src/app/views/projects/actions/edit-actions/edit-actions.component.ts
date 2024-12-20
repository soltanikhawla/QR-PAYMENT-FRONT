import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Action } from 'src/app/_Model/Action';
import { Mapping } from 'src/app/_Model/Mapping';
import { ActionsService } from 'src/app/_Services/actions.service';
import { ActorService } from 'src/app/_Services/actor.service';
import { MappingService } from 'src/app/_Services/mapping.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-actions',
  templateUrl: './edit-actions.component.html',
  styleUrls: ['./edit-actions.component.scss']
})
export class EditActionsComponent {
  idAction!: any;
  action !: Action;
  listActor!: any;
  selectedActor: any;
  idMapping!: number;
  mappingAction !:Mapping;
  selectedActorName: string = '';
  formattedCreationDate: string = '';
  formattedEndDate: string = '';
  constructor(private actionService:ActionsService,private route:ActivatedRoute, private datePipe: DatePipe,
    private fb: FormBuilder,private actorService : ActorService,private mappingService:MappingService) { 
      
    }
    
  ngOnInit(): void {
    this.idAction = this.route.snapshot.paramMap.get('idAction');
    this.actionService.getActionByIdAction(this.idAction).subscribe(data => {
    this.action = data;
    this.formattedCreationDate = this.datePipe.transform(this.action.creation_Date, 'yyyy-MM-dd') || '';
    this.formattedEndDate = this.datePipe.transform(this.action.end_Date, 'yyyy-MM-dd') || '';
    console.log(this.action);

  });

    this.getListActors();
   
  }
  
  updateDateCreation(event: any) {
    const selectedDate = event.target.value;
    this.action.creation_Date = selectedDate;
    this.formattedCreationDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd') || '';
  }

  updateEndDate(event: any) {
    const selectedDate = event.target.value;
    this.action.end_Date = selectedDate;
    this.formattedEndDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd') || '';
  }
  
  onActorSelectionChange(event: any) {
    const selectedId = Number(event.target.value);
    this.selectedActor = this.listActor.find((actor: any) => actor.id_Actor === selectedId);
  }
  
  
  
  updateAction() {
    if (this.selectedActor) {
      this.action.actor = this.selectedActor;
    }
  
    this.actionService.updateActionByIdAction(this.idAction, this.action).subscribe(
      (updatedAction) => {
        Swal.fire('Success', 'Action updated successfully', 'success');
        console.log('Updated action:', updatedAction);
      },
      (error) => {
        if (error.status === 500) {
          Swal.fire('Error', 'Internal Server Error', 'error');
        } else {
          console.error('Error:', error);
        }
      }
    );
  }
  
saveForm = this.fb.group({
  action: ['', Validators.required],
  creation_Date:['', Validators.required],
  status : ['', Validators.required],
  end_Date : ['', Validators.required],
  external_ref: ['', Validators.required]
})

getListActors() {
  this.actorService.getActorByProjectId(localStorage.getItem("project_id")).subscribe(data => {
      this.listActor = data;
      console.log(this.listActor);

  })
}

getMappingByIdMapping() {
  this.mappingService.getMappingByIdMapping(this.idMapping).subscribe(data => {
    this.mappingAction = data;
    console.log(this.mappingAction);
  });
}

}
