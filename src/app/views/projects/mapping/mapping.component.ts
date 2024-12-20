import { TranscoService } from './../../../_Services/transco.service';
import { MappingService } from './../../../_Services/mapping.service';
import { Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Source } from '../../files/source-file/source';
import { Cible } from '../../files/cible-file/cible';
import { FilesService } from 'src/app/_Services/files.service';
import { Mapping } from 'src/app/_Model/Mapping';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDate } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/_Services/project.service';
import { Project } from 'src/app/_Model/Project';
import { Transco } from 'src/app/_Model/Transco';
import { ActionsService } from 'src/app/_Services/actions.service';
import { MatDialog } from '@angular/material/dialog';
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorDialogCommentComponent } from '../editor-dialog-comment/editor-dialog-comment.component';
import { RulesService } from 'src/app/_Services/rules.service';
import { Rules } from 'src/app/_Model/Rules';
import { GeneraleRule } from 'src/app/_Model/GeneraleRule';

@Component({

  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],

})

export class MappingComponent implements OnInit {
  project!: Project;
  submitted:boolean=false;
  fileS: string ='';
  fileT: string | null = null;
  fileC: string | null = null;
  itemS: Source[] = [];
  itemT: Cible[] = [];
  itemTF: any[] = [];
  itemM:Mapping[] = [];
  test!:Mapping;
  itemMAux:Mapping[] = [];
  taggedMapping!:Mapping;
  taggedMappingList:Mapping[] = [];
  _taggedMappingList:Mapping[] = [];
  mappingDataList: any[] = [];
  public edited = false;
  idProject!: any;
  files: string[] = ['File1'];
  groupedItemS: any = {};
  groupedItemT: any = {};
  _Mapped: string = "";
  _improvement: boolean = false;
  comment: string = "";
  creation_Date: string = "";
  id_version: any = {};
  is_Mandatory: boolean = false;
  is_Transco: string = "";
  last_Modification: string = "";
  mappingRule: string = "";
  tgt_Column_Description: string = "";
  tgt_Column_Length: any = {};
  tgt_Column_Name: string = "";
  transco_table: string = "";
  fileName: any;
  showMappingTable: boolean = false;
  fileNames: any;
  selectedStatus: string = '';
  statuses: string[] = [];
  selectedStatuses: { [fileNames: string]: string } = {};
  newStatus: string = '';
  fileName1 = 'ExcelMapping.xlsx';
  selectedRowIndex: number = -1;
  selectedFileName!: string;
  selectedFileNameS: string | undefined;
  clickedColumnNameS: string="";
  clickedColumnNameT: string | null = null;
  currentDate: Date;
  mappResult:string="";
  descriptionS:string='';
  formatS:string='';
  commentS:string='';
  regleGenerale: any;
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
  searchTerm10:string = '';
  searchTerm11:string = '';
  showChecked: boolean | null = null;
  filterTransco: string = 'all';
  filterMapped: string = 'all';
  filterEvolution: string = 'all';
  transco:Transco[]=[];
  selectedTransco: any;
  listAction!: any;
  idMapping!: number;
  private openGroupS: Set<string> = new Set<string>();
  private openGroupT: Set<string> = new Set<string>();
  id_Mapping: any;
  selectedItem: any;
  selectedRowId: number | undefined;
  selectedMappingId: any;
  selectedCoulmn!: string;
  MappingCible:any;
  public DateN = Date.now();
  rulesList: Rules[] = [];
  // isTableSourceOpen: boolean = false;
 // isTableTargetOpen: boolean = false;
  selectedGeneralRule: any;
  public get MyDate() {
    return this.DateN;
  }
  public set MyDate(value) {
    this.DateN = value;
  }

  isMappingIdEqual(): boolean {
    console.log(this._taggedMappingList[0].id_Mapping)
    console.log(this.listAction.mapping.id_Mapping)
    console.log(this._taggedMappingList[0].id_Mapping=== this.listAction.mapping.id_Mapping)
    return this.itemM[0].id_Mapping=== this.listAction.mapping.id_Mapping
  }

  initializetaggedMappingList() {
    const currentDate = new Date().toISOString().slice(0, 19); 
    this.taggedMappingList = this.itemT.map((item) => ({
      id_Mapping: -1,
      fileNameT: item.file,
      fieldNumber:item.c1,
      tgt_Column_Name: item.column_Name,
      tgt_Column_Description: item.description,
      tgt_Column_Length: item.column_Type,
      commentT: item.comments,
      fileNameS:'',
      src_Column_Name: this.clickedColumnNameS,
      src_Column_Description: '',
      src_Column_Length: '',
      commentS: '',
      mappingRule: '', 
      mapped: false,
      evolution: false,
      comment: "",
      creation_Date:currentDate,
      id_version: 0,
      is_Mandatory: false,
      is_Transco: false,
      last_Modification:currentDate,
      transco_table: '',
      status: '',
      defaultvalue:'',
      project: item.project
    }));
  }

  constructor(private dialog: MatDialog,private transcoService:TranscoService, private actionService: ActionsService, 
    private mappingService: MappingService, private projectService: ProjectService, private fb: FormBuilder, 
    private file: FilesService,private router: Router,private sanitizer: DomSanitizer,private ruleService :RulesService) {
    this.currentDate = new Date();
    this.saveForm = this.fb.group({
      regleGenerale: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //this.getRuleByAndIdProject()
    this.getMappingByIdProject();
    this.getTargetFilesByIdProject();
    this.getSourceFilesByIdProject();
    this.getFileNamesT();
    this.triggerRefresh();
    //this.getAllTransco();
    this.getTranscoByTrancoTable();
     this.getListRules()
  }

  private triggerRefresh() {
    setTimeout(() => {
      this.getMappingByIdProject();
      this.getTargetFilesByIdProject();
      this.getSourceFilesByIdProject();
      this.getFileNamesT();
    }, 1000);
  }

  saveForm = this.fb.group({
    regleGenerale: ['', Validators.required]

  })
 /*--------------------------Generate Excel File-----------------*/
stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}
 exportToExcel(): void {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

    const targetRow = worksheet.addRow([]);
    const mergedCell = worksheet.getCell('A1');
    mergedCell.value = 'Target';
    worksheet.mergeCells('A1:E1');

  
      mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
      mergedCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ffdd6c17' }, 
      };
      mergedCell.font = {
        size: 14,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };


  
    const sourceMergedCell = worksheet.getCell('F1');
    sourceMergedCell.value = 'Source';
    worksheet.mergeCells('F1:J1');
    sourceMergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sourceMergedCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff19c519' }, // Green color
    };
    sourceMergedCell.font = {
      size: 14,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };

    const mappingMergedCell = worksheet.getCell('K1');
    mappingMergedCell.value = 'Mapping';
    worksheet.mergeCells('K1:Q1');
    mappingMergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
    mappingMergedCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff1f439d' }, // blue color
    };
    mappingMergedCell.font = {
      size: 14,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };

 
    const headerRow = worksheet.addRow([
      'File Name', 'Field Name', 'Field Description', 'Format', 'Comment',
      'FileName', 'Fiels Name', 'Field Description', 'Format', 'Comment',
      'Transco', 'Transco Table', 'Mapping Rule', 'Mapping Date', 'Mapped', 'Evolution','Version',
    ]);

    headerRow.eachCell((cell, number) => {
      if (
          cell.value === 'File Name' ||
          cell.value === 'Field Name' ||
          cell.value === 'Field Description' ||
          cell.value === 'Format' ||
          cell.value === 'Comment'
   
      ) {
          cell.font = {
            size: 12,
            bold: true,
        };
      }
      else if (
        cell.value === 'FileName' ||
        cell.value === 'Fiels Name' ||
        cell.value === 'Field Description' ||
        cell.value === 'Format' ||
        cell.value === 'Comment'

    ) {
        cell.font = {
          size: 12,
          bold: true,
      
      };
    }else if (
      cell.value === 'Transco' ||
      cell.value === 'Transco Table' ||
      cell.value === 'Mapping Rule' ||
      cell.value === 'Mapping Date' ||
      cell.value === 'Mapped'||
      cell.value === 'Evolution'||
      cell.value === 'Version'
    ) {
      cell.font = {
        size: 12,
        bold: true,
    };
    }
    });
    for (let mapping of this.taggedMappingList) {
    const formattedDate = formatDate(mapping.last_Modification, 'MM/dd/yyyy hh:mm a', 'en-US');
    const mappingRule = this.stripHtml(mapping.mappingRule);
    worksheet.addRow([
        mapping.fileNameT, mapping.tgt_Column_Name, mapping.tgt_Column_Description,
        mapping.tgt_Column_Length, mapping.commentT, mapping.fileNameS, mapping.src_Column_Name,
        mapping.src_Column_Description, mapping.src_Column_Length, mapping.commentS,
        mapping.is_Transco ? 'Yes' : 'No', mapping.transco_table, mappingRule,
        formattedDate, // Format the date
        mapping.mapped ? 'Yes' : 'No', mapping.evolution ? 'Yes' : 'No', mapping.id_version
    ]);
    }
    worksheet.columns.forEach((column) => {
    if (column) {
      let maxLength = 0;
      if (column && column.eachCell) {
          column.eachCell((cell) => {
              const columnLength = cell.value ? cell.value.toString().length : 10;
              if (columnLength > maxLength) {
                  maxLength = columnLength;
              }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
      }
    }
    });
    Swal.fire({
      title: 'Export Excel',
      text: 'To manage an excel file you must consult all the files',
      footer: '<h5 style="color:red;">If you do not check any files the excel file will be generated, without mapping.</h5>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, export it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
    
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const exportFileName = 'MappingFile.xlsx';
          saveAs(blob, exportFileName);

          Swal.fire({
            title: 'Export Successful',
            text: 'Excel file has been exported.',
            icon: 'success',
          });
        }).catch((error) => {
          //console.error('Error exporting Excel file:', error);
          Swal.fire({
            title: 'Export Error',
            text: 'An error occurred while exporting the Excel file.',
            icon: 'error',
          });
        });
      } else {
        Swal.fire({
          title: 'Export Canceled',
          text: 'Excel file export has been canceled.',
          icon: 'info',
        });
      }
    });
    
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
    cancelFileNameS(): void {
      this.searchTerm10 = '';
    this.searchFileNameS();
    }
    cancelSRCColName(): void {
      this.searchTerm11 = '';
    this.searchSRCColName();
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
      if (this.searchTerm7 !== null) {
        const searchRegex = new RegExp(this.searchTerm7, 'i'); 
        this._taggedMappingList = this.taggedMappingList.filter(mapping =>
          ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
          searchRegex.test(mapping.fieldNumber.toString())  
        );
      } else {
        this._taggedMappingList = this.taggedMappingList;
      }
    }

    searchColumnName(): void {
      if (this.searchTerm0.trim() !== '' || this.selectedFileName.trim() !== '') {
        this._taggedMappingList = this.taggedMappingList.filter(mapping =>
          ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
          ( mapping.tgt_Column_Name.toLowerCase().includes(this.searchTerm0.toLowerCase()))
        );
      } else {
        this._taggedMappingList = this.taggedMappingList;
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
    searchFileNameS(): void {
      if (this.searchTerm10.trim() !== '' || this.selectedFileName.trim() !== '') {
        this._taggedMappingList = this.taggedMappingList.filter(mapping =>
          ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
          ( mapping.fileNameS.toLowerCase().includes(this.searchTerm10.toLowerCase()))
        );
      } else {
        this._taggedMappingList = this.taggedMappingList;
      }
    }
    searchSRCColName(): void {
      if (this.searchTerm11.trim() !== '' || this.selectedFileName.trim() !== '') {
        this._taggedMappingList = this.taggedMappingList.filter(mapping =>
          ((this.selectedFileName.trim() === '') || (mapping.fileNameT === this.selectedFileName)) &&
          ( mapping.src_Column_Name.toLowerCase().includes(this.searchTerm11.toLowerCase()))
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

//***************************************************Mapping**************************************************//
  @ViewChild(EditorDialogComponent) editorDialog!: EditorDialogComponent;
  openEditorDialog(mappingRule: string, index: number): void {
    console.log(mappingRule);
    console.log(index)
    const dialogRef = this.dialog.open(EditorDialogComponent, {
      width: '900px',
      height: '540px',
      data: { mappingRule: mappingRule },
      position: { top: '200px' }
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
  @ViewChild(EditorDialogCommentComponent) editorDialogComment!: EditorDialogCommentComponent;
  openEditorDialogComment(comment: string, index: number): void {
    console.log(comment);
    console.log(index)
    const dialogRef = this.dialog.open(EditorDialogCommentComponent, {
      width: '900px',
      height: '540px',
      data: { comment: comment },
      position: { top: '200px' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        console.log(this._taggedMappingList)
        this._taggedMappingList[index].comment = result;
        console.log('Updated comment', this._taggedMappingList[index].comment);
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
  
  getListAction(mappingId: number): void {
    this.actionService.getActionsByIdMapping(mappingId).subscribe(
      data => {
        this.listAction = data;
        console.log(this.listAction);
      },
      error => {
        console.error(error);
      }
    );
  }

  getTranscoByTrancoTable() {
    this.transcoService.getTranscoByTrancoTable().subscribe((data) => {
      this.transco = data;
      console.log(this.transco);
    });
  }
  onTranscoSelectionChange(event: any) {
    this.selectedTransco = event.target.value;
    console.log(this.selectedTransco);
  }

  getProjectName(): void {
    this.projectService.getProjectById((localStorage.getItem("project_id")))
      .subscribe(project => this.project = project);
  }
 
  // onSave(): void {
  //   const idProject = localStorage.getItem("project_id");
  //   let isSubListIncluded = this._taggedMappingList.every(item => this.itemM.includes(item));
  //   console.log(isSubListIncluded);
  
  //   if (isSubListIncluded) {
  //     Swal.fire('info', 'Nothing to update', 'info');
  //   } else {
  //     let isMappingModified = false;
  //     console.log(this._taggedMappingList)
  //     for (let mapping of this._taggedMappingList) {
  //       console.log(this._taggedMappingList)
  //       if (mapping.mappingRule && mapping.mappingRule === '') {
  //         this.saveIsTranscoValue();
  //         if (mapping.id_Mapping && mapping.id_Mapping !== -1) {
  //           this.mappingService.editMapping(idProject, mapping).subscribe(
              
  //             (response) => {
  //               console.log(this._taggedMappingList)
  //               if (response.message === 'Mapping updated successfully.') {
  //                 console.log(response);
  //                 isMappingModified = true;
  //                 Swal.fire({
  //                   title: 'Confirmation',
  //                   text: 'Do you want to update the mapping ?',
  //                   icon: 'question',
  //                   showCancelButton: true,
  //                   confirmButtonText: 'Yes',
  //                   cancelButtonText: 'No'
  //                 }).then((result) => {
  //                   if (result.isConfirmed) {
  //                    // Reload the current route to refresh the component
  //               this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //               const currentUrl = '/projects/mapping';
  //               this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //                 this.router.navigate([currentUrl]);
  //               });
  //                   } else {
  //                     Swal.fire('Error', 'Error ', 'error');
  //                   }
  //                 });
  //                 // Swal.fire('Success', 'Mapping updated successfully', 'success');
  //               }
  //             },
  //             (error) => {
  //               console.error('Erreur :', error);
  //               Swal.fire('Error', 'An error occurred while updating mapping', 'error');
  //             }
  //           );
  //         } else {
  //           this.mappingService.saveMapping(idProject, mapping).subscribe(
  //             (response) => {
  //               if (response.message === 'Mapping created successfully.') {
  //                 isMappingModified = true;
  
  //                 Swal.fire({
  //                   title: 'Confirmation',
  //                   text: 'Do you want to save the mapping ?',
  //                   icon: 'question',
  //                   showCancelButton: true,
  //                   confirmButtonText: 'Yes',
  //                   cancelButtonText: 'No'
  //                 }).then((result) => {
  //                   if (result.isConfirmed) {
  //                     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //                     const currentUrl = '/projects/mapping';
  //                     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //                       this.router.navigate([currentUrl]);
  //                     });
  //                   } else {
  //                     Swal.fire('Error', 'Error ', 'error');
  //                   }
  //                 });
  //               }
  //             },
  //             (error) => {
  //               console.error('Erreur lors de la création du Mapping :', error);
  //               Swal.fire('Error', 'An error occurred while creating mapping', 'error');
  //             }
  //           );
  //         }
  //       } else {
  //         Swal.fire('info', 'You must fill in the mapping rule field', 'info');
  //         return; 
  //       }
      
  //     }
  
  //     if (!isMappingModified) {
  //       Swal.fire('info', 'No modifications were made', 'info');
  //     }
  //   }
  
  // }
  onSave(): void {
    const idProject = localStorage.getItem("project_id");
    let isSubListIncluded = this._taggedMappingList.every(item => this.itemM.includes(item));
    console.log(isSubListIncluded);
  
    if (isSubListIncluded) {
     // Swal.fire('info', 'Nothing to update', 'info');
    } else {
      let isMappingModified = false;
  
      for (let mapping of this._taggedMappingList) {
          this.saveIsTranscoValue();
          if (mapping.id_Mapping && mapping.id_Mapping !== -1) {
            this.mappingService.editMapping(idProject, mapping).subscribe(
              (response) => {
                if (response.message === 'Mapping updated successfully.') {
                  console.log(response);
                  isMappingModified = true;
                  Swal.fire({
                    title: 'Confirmation',
                    text: 'Do you want to update the mapping ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                  }).then((result) => {
                    if (result.isConfirmed) {
                     // Reload the current route to refresh the component
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                const currentUrl = '/projects/mapping';
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
                    } else {
                      Swal.fire('Error', 'Error ', 'error');
                    }
                  });
                  // Swal.fire('Success', 'Mapping updated successfully', 'success');
                }
              },
              (error) => {
                console.error('Erreur :', error);
                Swal.fire('Error', 'An error occurred while updating mapping', 'error');
              }
            );
          } else {
            this.mappingService.saveMapping(idProject, mapping).subscribe(
              (response) => {
                if (response.message === 'Mapping created successfully.') {
                  isMappingModified = true;
  
                  Swal.fire({
                    title: 'Confirmation',
                    text: 'Do you want to save the mapping ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                      const currentUrl = '/projects/mapping';
                      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate([currentUrl]);
                      });
                    } else {
                      Swal.fire('Error', 'Error ', 'error');
                    }
                  });
                }
              },
              (error) => {
                console.error('Erreur lors de la création du Mapping :', error);
                Swal.fire('Error', 'An error occurred while creating mapping', 'error');
              }
            );
          }
      
      }
  
      // if (!isMappingModified) {
      //   Swal.fire('info', 'No modifications were made', 'info');
      // }
    }
  
  }  
 SaveMapping(){
  this.onSave()
  this.CreateRegle()
  
 }
saveIsTranscoValue(): void {
  this.taggedMappingList.forEach(item => {
    // Si la case est cochée, assignez 'O', sinon assignez une chaîne vide
    item.is_Transco = item.is_Transco ? 'O' : ''; 
  });
}

 EditMapping(): void {    
    const idProject = localStorage.getItem("project_id");
      console.log("test : ", this._taggedMappingList)
      for (let mapping of this._taggedMappingList) {
          
            this.mappingService.editMapping(idProject,mapping).subscribe(
              (response) => {
                if (response) {
                  console.log(response)
                  Swal.fire('Success', 'Mapping updated successfully', 'success');
                this.getMappingByIdProject()
                } 
              },
              (error) => {
                console.error('Erreur :', error);
                Swal.fire('Error', 'An error occurred while creating mapping', 'error');
              })
          }
    }
    
    getListRules() {
      this.ruleService.getListRulesByProject(localStorage.getItem("project_id")).subscribe(data => {
        this.rulesList = data;
        console.log(this.rulesList);
      })
    }
    onRuleSelectionChange(event: any) {
      this.selectedGeneralRule = event.target.value;
      console.log(this.selectedGeneralRule);
    }
   getIdMapping(id_Mapping: Number): boolean {
    return this.itemM && this.itemM.some((item: any) => item.id_Mapping === id_Mapping);
  }
  CreateRegle( ): void {
    this.submitted = true;
     const newRegle = this.saveForm.get('regleGenerale')!.value;
     const formValues = this.saveForm.value;
     const generalRule: GeneraleRule = {
      generalrule: formValues.regleGenerale ?? '',
       filename: this.selectedFileName,
       id_gr: 0
     };
   console.log(localStorage.getItem("project_id"));
   console.log(this.selectedFileName)
   console.log(generalRule)
       // this.mappingService.updateRegleGenerale(this.selectedFileName, localStorage.getItem("project_id"), newRegle)
        this.ruleService.createG(this.selectedFileName,localStorage.getItem("project_id"), generalRule)
          .subscribe(
            () => {
              console.log(this.selectedFileName)
               //Swal.fire('Success', 'Regle created successfully', 'success');
            },
            (error) => {
               // Swal.fire('Error', 'Error', 'error');
         });
  }

  getRuleByAndIdProject(){
    console.log(this.selectedFileName)
    this.ruleService.getGeneralRuleByIdProjectAndFilename(this.selectedFileName,localStorage.getItem("project_id")).subscribe( 
      data =>{
      console.log(data)
      this.regleGenerale = data;
      console.log(this.regleGenerale)
      })
  }
  
  navigateToAction(id_Mapping: Number) {
    const idProject = localStorage.getItem("project_id");
    if ( this.itemM && this.getIdMapping(id_Mapping)) {
      this.router.navigate(["/projects/actions"], { queryParams: { id_project: idProject, id_Mapping: id_Mapping } });
    } 
  }  

  //***************************************************SOURCE************************************************* */
  getSourceFilesByIdProject() {
    this.mappingService.getFileNameSByIdProject(localStorage.getItem("project_id")).subscribe(data => {
      this.itemS = data;
      this.groupItemSourceByFileName();
    });
  }

   getGroupedItemKeySource(): string[] {
    return Object.keys(this.groupedItemS);
  }

  toggleGroupSource(file: string): void {
    if (this.openGroupS.has(file)) {
      this.openGroupS.delete(file);
    } else {
      this.openGroupS.add(file);
    }
 ;
  }

  groupItemSourceByFileName() {
    this.groupedItemS = this.itemS.reduce((acc: any, item: any) => {
      if (!acc[item.file]) {
        acc[item.file] = [];
      }
      acc[item.file].push(item);
      return acc;
    }, {});
 
  }

  isGroupOpenSource(file: string): boolean {
    return this.openGroupS.has(file);
  }

  handleColumnNameSClick(columnName: string): void {
    console.log('Clicked column_NameS:', columnName);
    this.clickedColumnNameS = columnName;
  }
  // toggleSourceTable(): void {
  //   this.isTableSourceOpen = !this.isTableSourceOpen;
  // }
  get isTableSourceOpen(): boolean {
    return this.file.isTableSourceOpen;
  }

  //**************************************************TARGET******************************************** */

  getTargetFilesByIdProject() {
    this.mappingService.getFileNameTByIdProject(localStorage.getItem("project_id")).subscribe(data => {
      this.itemT = data;
      this.groupItemTByFileName();
      this.initializetaggedMappingList()
    });
  }

  filteredTaggedMappingByFile(): Mapping[] {
  //  if (this.selectedFileName) {
      console.log(this.selectedFileName)
      console.log(this.taggedMappingList)
      this._taggedMappingList = this.taggedMappingList.filter((item) => item.fileNameT === this.selectedFileName), 
      console.log(this._taggedMappingList)
      // this.getRuleByAndIdProject()
      return this.mixeItemMWithtaggedMappingList()
    //}
    return [];
  } 
 
  mixeItemMWithtaggedMappingList(): Mapping[] {
    //console.log(this._taggedMappingList)
    //console.log(this.itemM)
    this._taggedMappingList.forEach(taggedMapping => {
      this.itemM.forEach(item => {
        if (taggedMapping.fileNameT === item.fileNameT
        && taggedMapping.tgt_Column_Name === item.tgt_Column_Name)
        {
          taggedMapping.id_Mapping=item.id_Mapping
          taggedMapping.mappingRule = item.mappingRule
          taggedMapping.comment = item.comment
          taggedMapping.creation_Date = item.creation_Date
          taggedMapping.evolution=item.evolution
          taggedMapping.id_version=item.id_version
          taggedMapping.mapped=item.mapped
          taggedMapping.is_Transco=item.is_Transco
          taggedMapping.is_Mandatory=item.is_Mandatory
          taggedMapping.last_Modification=item.last_Modification
          taggedMapping.transco_table=item.transco_table
          taggedMapping.fileNameS=item.fileNameS
          taggedMapping.src_Column_Name=item.src_Column_Name,
          taggedMapping.src_Column_Description=item.src_Column_Description
          taggedMapping.src_Column_Length=item.src_Column_Length
          taggedMapping.commentS=item.commentS
          taggedMapping.status=item.status
          taggedMapping.defaultvalue=item.defaultvalue
          taggedMapping.project=item.project
       // console.log(taggedMapping.project)
        }
      });
     
    })
    
    //console.log(this._taggedMappingList)
    //console.log(this.taggedMappingList)
    const serializedData = JSON.stringify(this._taggedMappingList);
      localStorage.setItem('_taggedMappingList', serializedData);
    return this._taggedMappingList
  }

  get getTaggedMappingList() {
    return  this.filteredTaggedMappingByFile();
  }

extractTgtFilename(mappingRule: string): string {
  const regex = /\[([^\.]+)\]\./;
  const match = regex.exec(mappingRule);
  return match ? match[1] : '';
}

  getFileNamesT() {
    this.file.getFileNameCByProject(localStorage.getItem("project_id")).subscribe(data => {
      this.fileNames = data;
    });
  }
  groupItemTByFileName() {
    this.groupedItemT = this.itemT.reduce((acc: any, item: any) => {
      if (!acc[item.file]) {
        acc[item.file] = [];
      }
      acc[item.file].push(item);
      return acc;
    }, {});

  }
  getGroupedItemKeyTarget(): string[] {
    //console.log(this.groupedItemT)
    return Object.keys(this.groupedItemT);

  }
  toggleGroupTarget(fileC: string): void {
    if (this.openGroupT.has(fileC)) {
      this.openGroupT.delete(fileC);
     // this.selectedFileName = undefined; // Deselect the file
    } else {
      this.openGroupT.add(fileC);
      this.selectedFileName = fileC;
      console.log(this.selectedFileName);
    }
    this.showMappingTable = true;
    console.log(this.filteredItemsByFile)
   
     this.filteredTaggedMappingByFile()
     this.getRuleByAndIdProject()
  }

  isGroupOpenTarget(file: string): boolean {
    return this.openGroupT.has(file);
  }

  updateStatus(): void {
    const status = 'bbb';
    const file = 'File1';
    this.selectedStatuses[file] = status;
    this.mappingService.updateStatus(file, localStorage.getItem("project_id"), status)
      .subscribe(
        (response) => {
          console.log('Status updated successfully:', response);
        },
        (error) => {
          console.error('Error updating status:', error);
        }
      );
  }
  // toggleTargetTable(): void {
  //   this.isTableTargetOpen = !this.isTableTargetOpen;
  // }
  get isTableTargetOpen(): boolean {
    return this.file.isTableTargetOpen;
  }

  //****************************************************MAPPING TABLE ************************************************/
  getMappingByIdProject(): void {
    this.mappingService.getMappingByIdProject(localStorage.getItem("project_id")).subscribe(
      data => {
        this.itemM = data;
        console.log(this.itemM);
        this.itemM.forEach(mapping => {
          if (mapping.status === 'Done') {
            mapping.mapped = true;
          }
        });
  
        if (this.itemM && this.itemM.length > 0) {
          const mappingId = this.itemM[0].id_Mapping;
          this.getListAction(mappingId);
        }
      },
      error => {
        console.error(error);
      }
    );
  }
  onStatusChange(mapping: any): void {
    if (mapping.status === 'Done' ) {
      mapping.mapped = true;
    } else {
      mapping.mapped = false;
    }
  }
  get mappingByIdProject():Mapping[]{
    this.mappingService.getMappingByIdProject(localStorage.getItem("project_id")).subscribe(
      data =>{
       // console.log(data)
        return data
      }
   
      );
       return []
  }

  getMatchingItem(file: string):any{
    console.log("filee", file);
  }

  getMappedRuleByFileAndColumnName(i:number,file: string, columnName: string): string {
    console.log("filee", file);
    console.log("columnName", columnName);
    console.log(this.itemM);
 
    const matchingItem = this.itemM.find(item =>
      item?.tgt_Column_Name === columnName &&
      item.mappingRule.includes(`[${file}].[${columnName}]`)
    );
 
    console.log(matchingItem)
    if (matchingItem) {
      this.mappingDataList[i] =  matchingItem;
      console.log(this.mappingDataList[i].mappingRule);
      return matchingItem.mappingRule;
    }
    console.log(this.mappingDataList[i].mappingRule)
    return this.mappingDataList[i].mappingRule;
  }
 
  refreshTable(): void {
    window.location.reload();
}

  get filteredItemsByFile(): Cible[] {
    if (this.selectedFileName) {
      console.log(this.selectedFileName)
      return this.itemT.filter((item) => item.file === this.selectedFileName);
    }
    return [];
  }

  selectedMapping(id: number,selectedItem : any, view:number) {
   
    if(view===1)
    {
      console.log('Clicked column_NameS:', selectedItem.file);
      this.fileS=selectedItem.file;
      this.clickedColumnNameS = selectedItem.column_Name
      this.descriptionS = selectedItem.description
      this.formatS = selectedItem.column_Type
      this.commentS = selectedItem.comments
      console.log('Clicked file:' +this.fileS);
      this._taggedMappingList[this.selectedMappingId].fileNameS=this.fileS
      this._taggedMappingList[this.selectedMappingId].src_Column_Name=this.clickedColumnNameS
      this._taggedMappingList[this.selectedMappingId].src_Column_Description=this.descriptionS
      this._taggedMappingList[this.selectedMappingId].src_Column_Length=this.formatS
      this._taggedMappingList[this.selectedMappingId].commentS=this.commentS
      //this._taggedMappingList[this.selectedMappingId].mappingRule = "["+this.fileT + "].["+this.clickedColumnNameT + "] power it with ["+this.fileS + "].[" + this.clickedColumnNameS + "]" ;
      console.log(this._taggedMappingList[this.selectedMappingId]);
    
    }
    else{
      
      this.fileT=selectedItem.fileNameT;
      this.clickedColumnNameT = selectedItem.tgt_Column_Name

      console.log('Clicked column_NameT:', this.clickedColumnNameT);
      console.log('Clicked file:' +this.fileT);
       
   
    this.selectedMappingId = id;
    console.log('ID de la ligne sélectionnée :', this.selectedMappingId);
    this.selectedRowIndex = id;
    this.fileS='';
    this.clickedColumnNameS ='';
    }
    
    // if(this._taggedMappingList[this.selectedMappingId].mappingRule === "" )
    // {
    //   this._taggedMappingList[this.selectedMappingId].mappingRule = "["+this.fileT + "].["+this.clickedColumnNameT + "] power it with ["+this.fileS + "].[" + this.clickedColumnNameS + "]" ;
    //   console.log(this._taggedMappingList[this.selectedMappingId]);
    //   this.fileS='';
    //   this.clickedColumnNameS ='';
    // }
  
  }

  goToAction() {
    const idProject = localStorage.getItem("project_id");
    const idMapping = localStorage.getItem("idMapping");
 
    this.router.navigate(['/projects/actions'], {
      queryParams: { id_project: idProject, idMapping: idMapping }
    });
  }
 
}
