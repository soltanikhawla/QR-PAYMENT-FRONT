import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsService } from 'src/app/_Services/actions.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inter-list-actions',
  templateUrl: './inter-list-actions.component.html',
  styleUrls: ['./inter-list-actions.component.scss']
})
export class InterListActionsComponent {
  listAction: any;
  idAction:any;
  constructor(private actionService :ActionsService,private router :Router) { }

  ngOnInit(): void {
    
    this.getListActions();
  }
  getListActions() {
    this.actionService.getActionsByProjectId(localStorage.getItem("project_id")).subscribe(data => {
        this.listAction = data;
        console.log(this.listAction);
  
    })
  
  }
  updateAction(idAction:any):void{
    console.log("console-2"+idAction);
    localStorage.setItem('idActor', idAction);
    this.router.navigate(['/projects/edit-actions', {idAction: idAction}]);
  }
  
  deleteAction(idAction: number): void { 
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
        this.idAction = idAction;
        this.actionService.deleteAction(idAction).subscribe(
          () => {
            console.log('Suppression réussie');
            
          this.getListActions();
        
          },
          (error) => {
            if (error.status === 500) {
              Swal.fire('Error', 'you cannot delete this action', 'error');

            } else {
              console.error('Error:', error);
              this.getListActions();
            }
          }
        
            // window.location.reload();
        
        );
      }
    })
  }
}
