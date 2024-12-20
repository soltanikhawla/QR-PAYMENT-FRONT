import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cible } from 'src/app/views/files/cible-file/cible';
import { Project } from 'src/app/_Model/Project';
import { ActorService } from 'src/app/_Services/actor.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-of-actors',
  templateUrl: './list_of_actors.component.html',
  styleUrls: ['./list_of_actors.component.scss']
})
export class ListOfActorsComponent {

  colCible : any;
  ItemS : any;
  cible !: Cible[];
  listA : any;
  idActor:any;
  public favoriteColor = '#26ab3c';
  message =" ";
  projects !:Project[];
  public constructor(private actorService : ActorService,private router :Router) {}

  ngOnInit(): void {
    this.getListActors();
  }
 
  getListActors() {
    this.actorService.getAllActors().subscribe(data => {

        this.listA = data;

        console.log(this.listA);

    })

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
updateActor(idActor:any):void{
  console.log("console-2"+idActor);
  localStorage.setItem('idActor', idActor);
  this.router.navigate(['/projects/edit-actor', {idActor: idActor}]);
}

deleteActor(idActor: number): void { 
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
        'Your file has been deleted.',
        'success'
      )
      this.idActor = idActor;
      this.actorService.deleteActor(idActor).subscribe(
        () => {
          console.log('Suppression réussie');
          //window.location.reload();
      this.getListActors();
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la suppression du fichier cible', error);
         if (error.status === 500) {
          Swal.fire('Error', 'you cannot delete this actor.', 'error');

        } else {
          console.error('Error:', error);
          this.getListActors();
        }
        }
      );
    }
  })
}
}
