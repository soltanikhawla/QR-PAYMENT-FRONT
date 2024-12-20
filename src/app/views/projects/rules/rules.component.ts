import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Rules } from 'src/app/_Model/Rules';
import { RulesService } from 'src/app/_Services/rules.service';
import Swal from 'sweetalert2';
import tinymce from 'tinymce';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  @ViewChild('listOfRulesTab') listOfRulesTab!: ElementRef;
  rulesList: any[] = [];
  filteredRulesList: any[] = [];
  projectFilter: string = '';
  ruleFilter: string = '';
  statusFilter: string = '';
  descriptionFilter='';
  submitted:boolean=false;
  isSuccessful = false;
  isSignUpFailed = false;
  idRule!:any;
  rules!:Rules
  RulesToUpdate: Rules | null = null; 
 

  constructor(private fb: FormBuilder,private router: Router, 
     private rulesService: RulesService) {
      this.saveForm = this.fb.group({
        rule: ['', Validators.required],
        status: ['', Validators.required],
        description: ['', Validators.required]
      });
  }
 
  ngOnInit(){
    this.getListRules()
  }


getRules(Rules_id:any):void{
  console.log("console-2 :"+ Rules_id);
  localStorage.setItem('Rules_id', Rules_id);
  this.router.navigate(['/projects/rules', {Rules_id: Rules_id}]);
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  const currentUrl = '/projects/rules';
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}
getListRules() {
  this.rulesService.getListRulesByProject(localStorage.getItem("project_id")).subscribe(data => {
    this.rulesList = data;
    console.log(this.rulesList);
    this.applyFilters();
  })
}
applyFilters() {
  this.filteredRulesList = this.rulesList.filter(rule =>
    this.filterByProject(rule) &&
    this.filterByRule(rule) &&
    this.filterByStatus(rule)&&
    this.filterByDescription(rule)
  );
}




filterByProject(rule: any): boolean {
  return this.projectFilter ? rule.project.project_Name.toLowerCase().includes(this.projectFilter.toLowerCase()) : true;
}

filterByRule(rule: any): boolean {
  return this.ruleFilter ? rule.rule.toLowerCase().includes(this.ruleFilter.toLowerCase()) : true;
}

filterByStatus(rule: any): boolean {
  return this.statusFilter ? rule.status.toLowerCase().includes(this.statusFilter.toLowerCase()) : true;
}
filterByDescription(rule: any): boolean {
  return this.descriptionFilter ? rule.description.toLowerCase().includes(this.descriptionFilter.toLowerCase()) : true;
}

saveForm = this.fb.group({
  rule:  ['', Validators.required],
  status: ['', Validators.required],
  description: ['', Validators.required]
})


savingData(saveForm: FormGroup) {
  if (saveForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill in all fields of the form.',
    });
  }
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
      //description: this.removeHtmlTags(saveForm.value.description)
  };
    this.rulesService.createRules(idProject, formData).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        if (data) {
          Swal.fire('Success', 'Rule created successfully', 'success');
          this.getListRules()
          this.listOfRulesTab.nativeElement.click();
          // Reset the form after successful save
          this.saveForm.reset();
        // Reload the current route to refresh the component
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = '/projects/rules';
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
deleteRules(idRules: number): void { 
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
        'Your rule has been deleted.',
        'success'
      )
      this.idRule= idRules;
      this.rulesService.deleteRules(idRules).subscribe(
        () => {
          console.log('Suppression réussie');
         this.getListRules();
      
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la suppression du fichier cible', error);
         if (error.status === 500) {
          Swal.fire('Error', 'you cannot delete this rule', 'error');

        } else {
          console.error('Error:', error);
          this.getListRules();
        }
        }
      );
    }
  })
}

updateRules(idRules: any): void {
  localStorage.setItem('idRules', idRules);
  console.log("console-2" + idRules);
  this.rulesService.getRulesById(idRules).subscribe(data => {
    this.rules = data;
    this.showUpdateRuleModal();
  });
}



 stripHtmlTags(str: string) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || div.innerText || '';
}

showUpdateRuleModal(): void {
  const formHtml = `
  <div class="container-fluid">
     <div class="row mb-3" >
      <div class="col-md-6">
          <label for="rule" style="display: flex;">Rule : </label>
          <input class="form-control" type="text" id="rule" name="rule" value="${this.rules.rule}" required>
        </div>
        <div class="col-md-6">
          <label for="description" style="display: flex;">Description : </label>
          <input class="form-control" type="text" id="description" name="description" value="${this.stripHtmlTags(this.rules.description)}" required>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="status" style="display: flex;">Status : </label>
          <select id="status" class="form-select cSelect">
          <option ${this.rules.status === 'Done' ? 'selected' : ''}>Done</option>
          <option ${this.rules.status === 'Skipped' ? 'selected' : ''}>Skipped</option>
          <option ${this.rules.status === 'ToDo' ? 'selected' : ''}>ToDo</option>
          <option ${this.rules.status === 'ToReview' ? 'selected' : ''}>ToReview</option>
        </select>
        </div>
      </div>
    </div>
  `;

  Swal.fire({
    title: '<strong style="color: #c2d28e;">Update rule</strong>',  
    html: formHtml,
    showCancelButton: true,
    confirmButtonColor: "#c2d28e",
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    customClass: {
      container: 'custom-modal-container',
      popup: 'custom-modal-popup'
    },
    icon: "info",
    preConfirm: () => {
      const ruleElement = document.getElementById('rule') as HTMLInputElement;
      const descriptionElement = document.getElementById('description') as HTMLInputElement;
      const statusElement = document.getElementById('status') as HTMLInputElement;

      if (!ruleElement || !descriptionElement || !statusElement) {
        Swal.showValidationMessage('All fields are required');
        return;
      }

      const rule = ruleElement.value;
      const description = descriptionElement.value;
      const status = statusElement.value;

      if (!rule || !description || !status) {
        Swal.showValidationMessage('All fields are required');
        return;
      }

      return {
        rule,
        description,
        status
      };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      const formValues = result.value as {
        rule: string;
        description: string;
        status: string;
      };

      this.rules.rule = formValues.rule;
      this.rules.description = formValues.description;
      this.rules.status = formValues.status;

      this.submitUpdate();
    }
  });
}





submitUpdate(): void {
    this.rulesService.updateRuleById(localStorage.getItem("idRules"),this.rules).subscribe(data => {
      console.log("Rule updated successfully", data);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Rule updated successfully',
      });
      // Actualiser la liste des régles après la mise à jour
      this.getListRules();
      this.RulesToUpdate = null; // update the rule
    });
}
}
