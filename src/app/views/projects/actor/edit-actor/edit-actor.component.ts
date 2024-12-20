import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/_Model/Actor';
import { ActorService } from 'src/app/_Services/actor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-actor',
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.scss']
})
export class EditActorComponent implements OnInit {

  idActor!: any;
  actor !: Actor;
  
 

  constructor(private actorService:ActorService,private route:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.idActor = this.route.snapshot.paramMap.get('idActor');
    this.actorService.getActorById(this.idActor).subscribe(data=>{
      this.actor=data;
      console.log("Ahmed" + this.actor);

    })
  }

saveForm = this.fb.group({
  first_name: [''],
  last_name: [''],
  email:[''],
  role : [''],
})

 updateActor() {
    
    this.actorService.updateActorById(this.idActor,this.actor).subscribe(
      (updatedActor) => {
       Swal.fire('Success', 'Actor updated successfully', 'success');
        
        console.log('Updated actor:', updatedActor);
      },
      (error) => {
  
        console.error('Error:', error);
        Swal.fire('Error', 'Erreur ', 'error');
      }
    );
  }
}

