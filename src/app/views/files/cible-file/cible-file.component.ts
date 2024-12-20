import { FilesService } from 'src/app/_Services/files.service';
import { Component, OnInit, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';


import { Cible } from './cible';
import { User } from 'src/app/_Model/User';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

export class Group {
  level = 0;
  parent: Group | undefined;
  expanded = true;
  totalCounts = 0;
  [key: string]: any; 

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-cible-file',
  templateUrl: './cible-file.component.html',
  styleUrls: ['./cible-file.component.scss'],
 
})
export class CibleFileComponent implements OnInit {
  formGroup!: FormGroup;
  user!:User;
  id!: number;
  csvRecords: any[] = [];
  fileT: any;
  title = 'Grid Grouping';
  public dataCible = new MatTableDataSource<Cible | Group>([]);
  isDisabled = false;
  _alldata: any[] = [];
  columns: any[];
  displayedColumns: string[];
  targetFileName:string="";
  groupByColumns: string[] = [];
  Cible!:Cible[];



  errorTarget:any;
  constructor(protected dataTargetService: FilesService) {

    this.columns = [ {
      field: 'file'
    },
     {
      field: 'column_Name'
    },
    {
      field: 'description'
    },
   {
      field: 'column_Type'
    },
   
    {
      field: 'mondatory'
    },
    
    {
      field: '_Key'
    },
    {
      field: 'comments'
    }
    
  
  ];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['file'];
  }

  ngOnInit() {
    let _fileName = localStorage.getItem("fileNameC")
    this.getItemT(_fileName as string);
      }
  getItemT(fileName:string) {
    this.dataTargetService.getItemsCibleByName(fileName).subscribe(
      (data: any) => {
        if (data && data.length) {
          data.forEach((item: any, index: number) => {
            item.id = index + 1;
          });
          this._alldata = data;
          this.dataCible.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataCible.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataCible.filter = performance.now().toString();
        } else {
          console.error('Data is empty or not in the expected format.');
        }
      },
      (err: any) => console.log(err)
    );
  }
 
  
  groupBy(event: { stopPropagation: () => void; }, column: { field: any; }) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataCible.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataCible.filter = performance.now().toString();
  }

  checkGroupByColumn(field: string, add: boolean ) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if ( add ) {
        this.groupByColumns.push(field);
      }
    }
  }
  
  unGroupBy(event: { stopPropagation: () => void; }, column: { field: any; }) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
  
    this.dataCible.data.forEach((item: any) => {
      if (item instanceof Group) {
        item.expanded = false; 
      }
    });
  
    this.dataCible.filter = performance.now().toString();
  }
  
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataCible.data.filter(
      (      row: { [x: string]: any; }) => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row: { expanded: boolean; }) {
    row.expanded = !row.expanded;
    this.dataCible.filter = performance.now().toString();  
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }


  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        (row: any) => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify
    );
  
    const currentColumn = groupByColumns[level];
    let subGroups: any[] = [];
    groups.forEach((group: Group) => {
      const rowsInGroup = data.filter((row: any) => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }
  
  uniqueBy(a: any[], key: (value: any) => string) {
    const seen: { [key: string]: boolean } = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }
  
  isGroup(index: any, item: { level: number }): boolean {
    return item.level > 0;
  }
  submitFileC() {
    if (!this.fileT) {
      Swal.fire('info', 'Please select a file', 'info');
      return;
    }
  
    if (this.fileT.size === 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'The file is empty',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    if (this.fileT.name && !this.fileT.name.endsWith('.csv')) {
      Swal.fire('Error', 'The file must have the .csv extension', 'error');
      return;
    }
  
    let formData = new FormData();
    formData.set("file", this.fileT);
  
    this.dataTargetService.uploadFileC(formData).subscribe(
      (response) => {
        console.log('Result', response);
        this.csvRecords = response;
        console.log('Response', response);
        this.fileT = response;
        localStorage.setItem("fileNameC", this.fileT.message);
  
        this.getItemT(this.fileT.message);
  
        for (let i = 0; i <= response.length; i++) {
          console.log(response[i]);
        }
        this.isDisabled = true;
        Swal.fire('Success', 'File uploaded successfully', 'success');
      },
      (error) => {
        console.log(error);
        if (error.status === 400) {
          Swal.fire('Error', 'the file already exists ', 'error');
        } else if (error.status === 417) {
          Swal.fire('Error', 'Check the file structure ', 'error');
        } else if (error.status === 409) {
          Swal.fire('Error', 'A file with the same name already exists', 'error');
        } else if (error.status === 500) {
          window.location.href = '/500';
        } 
      }
    );
  }
  
  onFileSelect(event: any, hint: number) {
    if (hint == 1) {
      const selectedFile = event.target.files[0];
      
      if (selectedFile) {
        this.fileT = selectedFile;
       
        console.log(`Fichier sélectionné : ${this.fileT.name}`);
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
  }
  
}