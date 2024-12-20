import { Component } from '@angular/core';
import { Action } from 'src/app/_Model/Action';
import { Project } from 'src/app/_Model/Project';
import { ActionsService } from 'src/app/_Services/actions.service';
import * as ExcelJS from 'exceljs';
import * as saveAs from 'file-saver';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-ext-list-of-actions',
  templateUrl: './ext-list-of-actions.component.html',
  styleUrls: ['./ext-list-of-actions.component.scss']
})
export class ExtListOfActionsComponent {
  
  listA : any;
  idActor:any;
  public favoriteColor = '#26ab3c';
  message =" ";
  searchQueryActions: string = '';
  originalListA: any[] = [];

  actions: any[] = [];
  itemAction :any;
  itemA: any[] = [];
  actionss !:Action[];
  projects !:Project[];
  fileName1 = 'ExcelAction.xlsx';

  public constructor(private actionService : ActionsService) {}

  ngOnInit(): void {
    this.getListActions();
  }
 
  getListActions() {
    this.actionService.getAllActions().subscribe(data => {

        this.listA = data;
        this.originalListA=data;

        console.log(this.listA);

    })

}

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const actionMergedCell = worksheet.getCell('A1');
    actionMergedCell.value = 'List of Actions';
    worksheet.mergeCells('A1:H1');
    this.styleMergedCell(actionMergedCell, 'ffdd6c17'); 
    const headerRow = worksheet.addRow([
      'ID Action', 'Action', 'Actor', 'Date Creation', 'Due Date', 'External reference', 'Status', 'Project'
    ]);

    this.styleHeaderCells(headerRow);
    this.listA.forEach((item: Action) => { 
      const creation_Date = formatDate(item.creation_Date, 'MM/dd/yyyy hh:mm a', 'en-US');
      const end_Date = formatDate(item.end_Date, 'MM/dd/yyyy hh:mm a', 'en-US');
      const rowData: string[] = [
        item.id_Action.toString(),
        item.action,
        item.actor.first_name,
        creation_Date ,
        end_Date  , 
        item.external_ref,
        item.status,
        item.mapping.project.project_Name,
      ];
  
      worksheet.addRow(rowData);
    });
  
    this.autoFitColumns(worksheet);
    
    workbook.xlsx.writeBuffer().then((excelData) => {
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const exportFileName = 'ExportedFile.xlsx';
      saveAs(blob, exportFileName);
      console.log('Excel file has been exported.');
    }).catch((error) => {
      console.error('Error exporting Excel file:', error);
    });
  }

  private styleHeaderCells(headerRow: ExcelJS.Row): void {
    headerRow.eachCell((cell) => {
      cell.font = {
        size: 12,
        bold: true,
      };
    });
  }
 private styleMergedCell(cell: ExcelJS.Cell, bgColor: string): void {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    };
    cell.font = {
      size: 14,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
  }
  private autoFitColumns(worksheet: ExcelJS.Worksheet): void {
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
  }


 

  onSearchActions() {
    if (this.searchQueryActions) {
      this.listA = this.filteredActions;
    } else {
      this.listA = this.originalListA; // Rétablir la liste d'origine
    }
  }
  

  // get filteredActions() {
  //   return this.listA.filter((itemObj: { action: string }) =>
  //     itemObj && itemObj.action && itemObj.action.toLowerCase().includes(this.searchQueryActions.toLowerCase())
  //   );
  // }


  get filteredActions() {
    return this.listA.filter((itemObj: any) => {
      const query = this.searchQueryActions.toLowerCase();
  
      // Ajoutez des conditions pour d'autres colonnes que vous souhaitez inclure dans la recherche
      return (
        itemObj &&
        (
          itemObj.id_Action.toString().toLowerCase().includes(query) ||
          itemObj.action.toLowerCase().includes(query) ||
          itemObj.actor.first_name.toLowerCase().includes(query) ||
          itemObj.creation_Date.toString().toLowerCase().includes(query) ||
          itemObj.end_Date.toString().toLowerCase().includes(query) ||
          itemObj.external_ref.toLowerCase().includes(query) ||
          itemObj.status.toLowerCase().includes(query) ||
          itemObj.mapping.project.project_Name.toLowerCase().includes(query)
        )
      );
    });
  }
  
}