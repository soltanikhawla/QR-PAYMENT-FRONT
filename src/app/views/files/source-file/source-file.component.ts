import { FilesService } from 'src/app/_Services/files.service';
import { Component} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Source } from './source';
import Swal from 'sweetalert2';

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
  selector: 'app-source-file',
  templateUrl: './source-file.component.html',
  styleUrls: ['./source-file.component.scss']
})
export class SourceFileComponent {
  id!:number;
  csvRecords: any[] = [];
  fileS: any;
  title = 'Grid Grouping';
  sourceFileName:string="";
  public dataSource = new MatTableDataSource<Source | Group>([]);
  isDisabled = false;
  _alldata: any[] = [];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];
  Source!:Source[];
  errorSource: any;
  isButtonClicked: boolean = false;
  constructor(protected dataSourceService: FilesService) {

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
   let _fileName = localStorage.getItem("fileNameS")
   this.getItemS(_fileName as string);
     }


  getItemS(fileName:string) {
    this.dataSourceService.getItemsSourceByName(fileName).subscribe(
      (data: any) => {
        if (data && data.length) {
          data.forEach((item: any, index: number) => {
            item.id = index + 1;
          });
          this._alldata = data;
          this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
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
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
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
  
    this.dataSource.data.forEach((item: any) => {
      if (item instanceof Group) {
        item.expanded = false; 
      }
    });
  
    this.dataSource.filter = performance.now().toString();
  }
  
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
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
    this.dataSource.filter = performance.now().toString();  
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
  submitFileS() {
    if (!this.fileS) {
      Swal.fire('info', 'Please select a file', 'info');
      return;
    }
  
    if (this.fileS.size === 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'The file is empty',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    if (this.fileS.name && !this.fileS.name.endsWith('.csv')) {
      Swal.fire('Error', 'The file must have the .csv extension', 'error');
      return;
    }
  
    let formData = new FormData();
    formData.set("file", this.fileS);
  
    this.dataSourceService.uploadFileS(formData).subscribe(
      (response) => {
        console.log('Result', response);
        this.csvRecords = response;
        console.log('Response', response);
        this.fileS = response;
        localStorage.setItem("fileNameS", this.fileS.message);
        this.getItemS(this.fileS.message);
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
        this.fileS = selectedFile;
        console.log(`Fichier sélectionné : ${this.fileS.name}`);
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