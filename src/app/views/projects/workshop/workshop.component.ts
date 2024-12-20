import { WorkshopsService } from './../../../_Services/workshops.service';
import { Component, ElementRef, ViewChild,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actor } from 'src/app/_Model/Actor';
import { ActorService } from 'src/app/_Services/actor.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent {
  @ViewChild('listOfWorkshopsTab') listOfWorkshopsTab!: ElementRef;
  actor !: Actor;
  selectedActor: any;
  listActor!: any;
  idProject!: any;
  isSuccessful = false;
  isSignUpFailed = false;
  selectedActors: Actor[] = [];
  workshopList!: any;
  submitted:boolean=false;
  idWorkshop!:any;
  constructor(private dialog: MatDialog, private fb: FormBuilder,private router: Router, private actorService: ActorService , private workshopsService: WorkshopsService) {
  }

  ngOnInit(): void {
    this.getListActors();
    this.getListWorkshops();
  }


  saveForm = this.fb.group({
    participants:  ['', Validators.required],
    workshop_Date: ['', Validators.required],
    mail_object: ['', Validators.required],
    description: ['', Validators.required]
  })
  
  onActorSelectionChange(event: any, actor: Actor) {
    if (event.target.checked) {
      this.selectedActors.push(actor);
    } else {
      this.selectedActors = this.selectedActors.filter(selectedActor => selectedActor !== actor);
    }
  
    const participantsString = this.selectedActors.map(selectedActor => selectedActor.email).join(',');
    this.saveForm.patchValue({
      participants: participantsString
    });
    this.listActor.forEach((listActor: any) => {
      listActor.selected = this.selectedActors.includes(listActor);
    });
  }
  
 getWorkshop(workshop_id:any):void{
    console.log("console-2 :"+ workshop_id);
    localStorage.setItem('workshop_id', workshop_id);
    this.router.navigate(['/projects/viewWorkshop', {workshop_id: workshop_id}]);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = '/projects/viewWorkshop';
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  
  getListActors() {
    this.actorService.getActorByProjectId(localStorage.getItem("project_id")).subscribe(data => {
      this.listActor = data;
      console.log(this.listActor);

    })
  }

  getListWorkshops() {
    this.workshopsService.getListWorkshopsByProject(localStorage.getItem("project_id")).subscribe(data => {
      this.workshopList = data;
      console.log(this.workshopList);

    })
  }
  removeHtmlTags(content: string): string {
    // Utilisation d'une expression régulière pour supprimer les balises HTML
    return content.replace(/<\/?[^>]+(>|$)/g, "");
}

  savingData(saveForm: FormGroup) {
    const idProject = localStorage.getItem("project_id");
    console.log(saveForm);
    this.submitted = true;
  
    if (saveForm.invalid) {    
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields of the form.',
      });
    } else {
      const formData = {
        ...saveForm.value,
        // description: this.removeHtmlTags(saveForm.value.description)
    };
      this.workshopsService.createWorkshop(idProject, formData).subscribe(
        (data) => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
  
          if (data) {
            Swal.fire('Success', 'Workshop created successfully', 'success');
            this.getListWorkshops()
            this.listOfWorkshopsTab.nativeElement.click();
            // Reset the form after successful save
            this.saveForm.reset();
          // Reload the current route to refresh the component
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              const currentUrl = '/projects/workshops';
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
              });
          }  
        },
        (error) => {
          this.isSignUpFailed = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error.',
          });
          console.error('Error:', error);
  
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error.',
            });
          } 
        },
      );
    }
  }
   
  SendEmailByIdWorkshop(idWorkshop: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to send an Email for this Workshop?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.workshopsService.SendEmailByIdWorkshop(idWorkshop).subscribe(
          () => {
            Swal.fire('Success', 'Email sent successfully', 'success').then(() => {
              this.getListWorkshops();
            });
          },
          (error) => {
            if (error.status === 500) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'The email could not be sent.',
              });
            
            } else {
                Swal.fire('Success', 'Email sent successfully', 'success')
                this.getListWorkshops();
            }
          }
        );
      }
    });
  }
  
  deleteWorkshop(idWorkshop: number): void { 
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
          'Your workshop has been deleted.',
          'success'
        )
        this.idWorkshop = idWorkshop;
        this.workshopsService.deleteWorkshop(idWorkshop).subscribe(
          () => {
            console.log('Suppression réussie');
           this.getListWorkshops();
        
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la suppression du fichier cible', error);
           if (error.status === 500) {
            Swal.fire('Error', 'you cannot delete this workshop', 'error');
  
          } else {
            console.error('Error:', error);
            this.getListWorkshops();
          }
          }
        );
      }
    })
  }
}
