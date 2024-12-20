import { Component, SecurityContext, ViewChild } from '@angular/core';
import { Project } from 'src/app/_Model/Project';
import { MappingService } from 'src/app/_Services/mapping.service';
import { ProjectService } from 'src/app/_Services/project.service';
import Swal from 'sweetalert2';
import {SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mapping } from 'src/app/_Model/Mapping';
import { Transco } from 'src/app/_Model/Transco';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorDialogComponent } from '../../projects/editor-dialog/editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-mapping-file',
  templateUrl: './mapping-file.component.html',
  styleUrls: ['./mapping-file.component.scss']
})
export class MappingFileComponent {
  project !: Project;
  listP : any;
  selectedProject:any;
  csvRecords: any[] = [];
  fileT: any;
  targetFileName:string="";
  profileForm: FormGroup;
  accountForm: FormGroup;
  addressForm: FormGroup;
  taggedMapping!:Mapping;
  taggedMappingList:Mapping[] = [];
  _taggedMappingList:Mapping[] = [];
  filteredItems: Mapping[] = [];
  searchTerm0: string = '';
  searchTerm1:string = '';
  searchTerm2:string = '';
  searchTerm3:string = '';
  searchTerm4:string = '';
  searchTerm5: number | null = null;
  searchTerm6:string = '';
  searchTerm7:string = '';
  searchTerm8:string = '';
  searchTerm9:string = '';
  selectedFileName!: string;
  selectedFileNameS: string | undefined;
  filterTransco: string = 'all';
  filterMapped: string = 'all';
  filterEvolution: string = 'all';
  transco:Transco[]=[];
  selectedTransco: any;
  currentDate: Date;
  itemM:Mapping[] = [];
  selectedFile:any
  errorSource: any;
  activeTab: string = 'project';
  isDisabled = false;
  uploadFile=false;
  pictureUrl: string = 'assets/img/avatars/1.jpg';
constructor(private dialog: MatDialog,private sanitizer: DomSanitizer,private mappingService:MappingService,private projectService:ProjectService,private fb: FormBuilder){
  this.currentDate = new Date();

  this.profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  this.accountForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  this.addressForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required]
  });
}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');

  }

ngOnInit(){
  this.projectService.getProjectById(localStorage.getItem("project_id")).subscribe(data=>{
    this.project=data;

 })

 this.getListProjects();
 this.getMappingByIdProject();

}
 


  getListProjects() {
    this.projectService.getAllProjects().subscribe((data) => {
      this.listP=data;
      console.log(this.listP);
    });
  }

  onProjectSelectionChange(event: any) {
    this.selectedProject = event.target.value;
    console.log(this.selectedProject);
    // Reset the upload state whenever a new project is selected
    this.uploadFile = false;
  }

  async uploadFileAndFetchMappings() {
    const uploadSuccess = await this.uploaMappingFile();
    if (uploadSuccess) {
      this.getMappingByIdProject();
    }
  }

  uploaMappingFile(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.fileT) {
        Swal.fire('info', 'Please select a file', 'info');
        return resolve(false);
      }

      if (this.fileT.size === 0) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'The file is empty',
          showConfirmButton: false,
          timer: 1500
        });
        return resolve(false);
      }

      if (this.fileT.name && !this.fileT.name.endsWith('.csv')) {
        Swal.fire('Error', 'The file must have the .csv extension', 'error');
        return resolve(false);
      }
      Swal.fire({
        title: 'Loading...',
        text: 'Please wait while the file is being uploaded',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      let formData = new FormData();
      formData.set("file", this.fileT);
      this.mappingService.uploadFileMapping(this.selectedProject, formData).subscribe(
        (response) => {
          console.log('Result', response);
          this.csvRecords = response;
          console.log('Response', response);
          this.fileT = response;
          Swal.fire('Success', 'File uploaded successfully', 'success');
          this.uploadFile = true;
          console.log(this.uploadFile);
          resolve(true);
        },
        (error) => {
          console.log(error);
          if (error.status === 400) {
            Swal.fire('Error', 'Error', 'error');
          } else if (error.status === 417) {
            Swal.fire('Error', 'Check the file structure ', 'error');
          } else if (error.status === 409) {
            Swal.fire('Error', 'A file with the same name already exists', 'error');
          } else if (error.status === 500) {
            window.location.href = '/500';
          } 
        }
      );
    });
  }

 

  onFileSelect(event: any, hint: number) {
    if (hint == 1) {
      const selectedFile = event.target.files[0];
      
      if (selectedFile) {
        this.fileT = selectedFile;
        console.log(`Fichier sélectionné : ${this.fileT.name}`);
        this.selectedFile=this.fileT.name;
        console.log(this.selectedFile)
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Veuillez sélectionner un fichier',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
    this.getMappingByIdProject();
  }


  selectTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    if (this.activeTab === 'project') {
       if (this.selectedProject){
        this.selectTab('upload')
      }
 
    } else if (this.activeTab === 'upload') {
      if(this.uploadFile == true){ 
        this.selectTab('file')
      }
    }
  }
  previousTab() {
    if (this.activeTab === 'upload') {
      this.selectTab('project');
    } else if (this.activeTab === 'file') {
      this.selectTab('upload');
    }
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pictureUrl = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  /*-------------------------------------head of mapping table -----------------*/
  cancelFilterColName(): void {
    // Reset the search term and close the menu
    this.searchTerm0 = '';
    this.searchColumnName();
  }
  cancelFilterField(): void {
    this.searchTerm7 = '';
  this.searchFieldNumber();
  }
  cancelDescription(): void {
    this.searchTerm1 = '';
  this.searchDesc();
  }
  cancelTranscoTable(): void {
    this.searchTerm8 = '';
  this.searchTranscoTable();
  }
  cancelMapping(): void {
    this.searchTerm4 = '';
  this.searchStatus();
  }
  cancelStatus(): void {
    this.searchTerm9 = '';
  this.searchTranscoTable();
  }
  searchFieldNumber(): void {
    if (this.searchTerm7.trim() !== '' ) {
      this.filteredItems = this.itemM.filter(mapping =>
        ( mapping.fieldNumber.toLowerCase().includes(this.searchTerm7.toLowerCase()))
      );
    } else {
      this.filteredItems = this.itemM;
    }
  }

  searchColumnName(): void {
    if (this.searchTerm0.trim() !== '' || this.selectedFileName.trim() !== '') {
      this.itemM = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ( mapping.tgt_Column_Name.toLowerCase().includes(this.searchTerm0.toLowerCase()))
      );
    } else {
      this.itemM = this.taggedMappingList;
    }
  }
  searchDesc(): void {
    if (this.searchTerm1.trim() !== '' || this.selectedFileName.trim() !== '') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ( mapping.tgt_Column_Description.toLowerCase().includes(this.searchTerm1.toLowerCase()))
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;
    }
  }

  searchTransco(): void {
    if (this.searchTerm3.trim() !== '' || this.filterTransco !== 'all' || this.selectedFileName.trim() !== '') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ((this.filterTransco === 'all') ||
          (this.filterTransco === 'checked' && mapping.is_Transco) ||
          (this.filterTransco === 'unchecked' && !mapping.is_Transco)) &&
        Object.values(mapping).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm3.toLowerCase())
        )
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;
    }
  }
  searchTranscoTable(): void {
    if (this.searchTerm8.trim() !== '' || this.selectedFileName.trim() !== '') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ( mapping.transco_table.toLowerCase().includes(this.searchTerm8.toLowerCase()))
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;
    }
  }
  searchMappingRule(): void {
    if (this.searchTerm4.trim() !== '' || this.selectedFileName.trim() !== '') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ( mapping.mappingRule.toLowerCase().includes(this.searchTerm4.toLowerCase()))
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;
    }
  }

  searchMapped(): void {
    if (this.searchTerm6.trim() !== '' || this.selectedFileName.trim() !== '' || this.filterMapped !== 'all') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ((this.filterMapped === 'all') ||
          (this.filterMapped === 'checked' && mapping.mapped) ||
          (this.filterMapped === 'unchecked' && !mapping.mapped)) &&
        Object.values(mapping).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm6.toLowerCase())
        )
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;}
   }
   searchStatus(): void {
    if (this.searchTerm9.trim() !== '' || this.selectedFileName.trim() !== '') {
      this._taggedMappingList = this.taggedMappingList.filter(mapping =>
        ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
        ( mapping.status.toLowerCase().includes(this.searchTerm9.toLowerCase()))
      );
    } else {
      this._taggedMappingList = this.taggedMappingList;
    }
  }

  searchEvolution(): void {
    if (this.searchTerm6.trim() !== '' || this.selectedFileName.trim() !== '' || this.filterEvolution !== 'all') {
    this._taggedMappingList = this.taggedMappingList.filter(mapping =>
      ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
      ((this.filterEvolution === 'all') ||
        (this.filterEvolution === 'checked' && mapping.evolution) ||
        (this.filterEvolution === 'unchecked' && !mapping.evolution)) &&
      Object.values(mapping).some(value =>
        value && value.toString().toLowerCase().includes(this.searchTerm6.toLowerCase())
      )
    );
     } else {
      this._taggedMappingList = this.taggedMappingList; }
   }

  searchByVersion(): void {
     if (this.searchTerm5 !== null || this.selectedFileName.trim() !== '') {
    this._taggedMappingList = this.taggedMappingList.filter(mapping =>
      ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
      (this.searchTerm5 === null || mapping.id_version === this.searchTerm5)
      );
     } else {
       this._taggedMappingList = this.taggedMappingList; }
   }
   @ViewChild(EditorDialogComponent) editorDialog!: EditorDialogComponent;
   openEditorDialog(mappingRule: string, index: number): void {
     console.log(mappingRule);
     console.log(index)
     const dialogRef = this.dialog.open(EditorDialogComponent, {
       width: '900px',
       height: '600px',
       data: { mappingRule: mappingRule }
     });
   
     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         console.log(result);
         console.log(this._taggedMappingList)
         this._taggedMappingList[index].mappingRule = result;
         console.log('Updated mapping rule:', this._taggedMappingList[index].mappingRule);
       }
     });
   }
 
   sanitizeHtml(htmlContent: string): SafeHtml {
     const sanitizedFullContent = this.sanitizer.sanitize(SecurityContext.HTML, htmlContent);
     if (sanitizedFullContent !== null) {
         let truncatedContent = sanitizedFullContent.substring(0, 120);
         if (sanitizedFullContent.length > 120) {
             truncatedContent += '...';
         } 
         return this.sanitizer.bypassSecurityTrustHtml(truncatedContent);
     } else {
         return this.sanitizer.bypassSecurityTrustHtml('');
     }
    }
    //****************************************************MAPPING TABLE ************************************************/
    getMappingByIdProject(): void {
      if (this.selectedProject) {
        console.log(this.selectedProject);
        console.log(this.uploadFile);
        if (this.uploadFile) {
          console.log(this.selectedProject);
          console.log(this.uploadFile);
  
          console.log(this.selectedProject);
          console.log(this.selectedFile);
          this.mappingService.getMappingByIdProject(this.selectedProject).subscribe(
            data => {
              this.itemM = data;
              console.log(this.itemM);
            },
            error => {
              console.error(error);
            }
          );
        }
      }
    }
   
    
}