import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef } from '@angular/core';
import { Transco } from 'src/app/_Model/Transco';
import { TranscoService } from 'src/app/_Services/transco.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transco',
  templateUrl: './transco.component.html',
  styleUrls: ['./transco.component.scss']
})
export class TranscoComponent {
  transco: Transco[] = [];
  submitted: boolean = false;
  transcoTable = '';
  sourceValue = '';
  targetValue = '';
  idTransco:any;
  transcoTableNew = '';
  idTranscoNew : any;
  sourceValueNew = '';
  targetValueNew = '';
  isSuccessful = false;
  isSignUpFailed = false;
  errorCible: any;
  showAddTranscoRow: boolean = false;
  searchTerm0: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  transcoForm: FormGroup;

  constructor(private transcoService: TranscoService, private fb: FormBuilder) {
    this.transcoForm = this.fb.group({
      transcoTableNew: ['', Validators.required],
      sourceValueNew: ['', Validators.required],
      targetValueNew: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllTransco();
  }

  saveForm = this.fb.group({
    transcoTable: ['', Validators.required],
    sourceValue: ['', Validators.required],
    targetValueNew: ['', Validators.required],
  });

  getAllTransco() {
    this.transcoService.getAllTransco().subscribe((data) => {
      this.transco = data;
      console.log(this.transco);
    });
  }
 
  // addTransco(saveForm: FormGroup): Promise<boolean> | undefined {
  //   if (saveForm.invalid) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please fill in all fields of the form.',
  //     });
  //     return Promise.resolve(false);
  //   }

  //   return new Promise((resolve, reject) => {
  //     this.transcoService.addTransco(saveForm.value).subscribe(
  //       (data: any) => {
  //         console.log('ahmed ' + localStorage.getItem('id_PROJECT'));
  //         console.log('console 3 : ' + JSON.stringify(data));
  //         console.log(data);
  //         this.isSuccessful = true;
  //         this.isSignUpFailed = false;
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Success',
  //           text: 'Actor successfully added!',
  //         });
  //         this.getAllTransco();
  //         saveForm.reset();
  //         // this.router.navigate(['/projects/internal-list-a', { id_project: localStorage.getItem("project_id") }]);
  //         resolve(true);
  //       },
  //       (err: { error: { colCible: any } }) => {
  //         this.errorCible = err.error.colCible;
  //         this.isSignUpFailed = true;
  //         reject(false);
  //       }
  //     );
  //   });
  // }

  addTranscoRow() {
    this.showAddTranscoRow = true;
    this.idTranscoNew='';
    this.transcoTableNew = '';
    this.sourceValueNew = '';
    this.targetValueNew = '';
  }

  saveTransco(): void {
    const validateInput = () => {
      if ( !this.transcoTableNew || !this.sourceValueNew || !this.targetValueNew) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill in all fields.',
        });
        return false;
      }
      return true;
    };
  
    const addTransco = () => {
      const newTransco: Transco = {
        idTransco: this.idTranscoNew,
        transcoTable: this.transcoTableNew,
        sourceValue: this.sourceValueNew,
        targetValue: this.targetValueNew,
      };
  
      this.transcoService.addTransco(newTransco).subscribe(
        (data: any) => {
          console.log('console 3 : ' + JSON.stringify(data));
          this.isSuccessful = true;
          this.isSignUpFailed = false;
  
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Transco successfully added!',
          });
          this.getAllTransco();
          this.showAddTranscoRow = false;
        },
        (err: { error: { colCible: any } }) => {
          this.errorCible = err.error.colCible;
          this.isSignUpFailed = true;
        }
      );
    };
  
    if (validateInput()) {
      addTransco();
    }
  }
  cancelAddTransco() {
    this.showAddTranscoRow = false;
  }

  deleteTransco(idTransco: any): void { 
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
          'Transco has been deleted.',
          'success'
        )
        this.idTransco = idTransco;
        this.transcoService.deleteTransco(idTransco).subscribe(
          () => {
            console.log('Suppression réussie');
           this.getAllTransco();
        
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la suppression du transco', error);
           if (error.status === 500) {
            Swal.fire('Error', 'you cannot delete this transco', 'error');
  
          } else {
            console.error('Error:', error);
            this.getAllTransco();
          }
          }
        );
      }
    })
  }

  searchTransco(): void {
    if (this.searchTerm0.trim() !== '') {
      this.transco = this.transco.filter(item =>
        item.transcoTable.toLowerCase().includes(this.searchTerm0.toLowerCase()) 
        // item.sourceValue.toLowerCase().includes(this.searchTerm0.toLowerCase()) ||
        // item.targetValue.toLowerCase().includes(this.searchTerm0.toLowerCase())
      );
    } else {
      this.getAllTransco();
    }
  }
  
  cancelTransco(): void {
    // Reset the search term and close the menu
    this.searchTerm0 = '';
    this.searchTransco();
  }
  cancelTargetValue(): void {
    this.searchTerm1 = '';
    this.searchTargetValue();
  }
  cancelSourceValue(): void {
    this.searchTerm2 = '';
    this.searchSourceValue();
  }
  
  searchSourceValue():void{

    if (this.searchTerm2.trim() !== '') {
        this.transco = this.transco.filter(item =>
           item.sourceValue.toLowerCase().includes(this.searchTerm2.toLowerCase())
        );
      } else {
        this.getAllTransco();
      }
    }

  searchTargetValue():void{
  if (this.searchTerm1.trim() !== '') {
      this.transco = this.transco.filter(item =>
         item.targetValue.toLowerCase().includes(this.searchTerm1.toLowerCase())
      );
    } else {
      this.getAllTransco();
    }
  }
}