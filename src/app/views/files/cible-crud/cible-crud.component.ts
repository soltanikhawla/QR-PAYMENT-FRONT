import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_Model/User';
import { FilesService } from 'src/app/_Services/files.service';
import Swal from 'sweetalert2';
import { Cible } from '../cible-file/cible';







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
  selector: 'app-cible-crud',
  templateUrl: './cible-crud.component.html',
  styleUrls: ['./cible-crud.component.scss']
})
export class CibleCRUDComponent {
  [x: string]: any;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  
  updatedItem: any = {
    file: '',
    column_Name: '',
    description: '',
    column_Type: '',
    mondatory: '',
    _Key: '',
    comments: ''
  };

    formGroup!: FormGroup;
    user!:User;
    id!: number;
    csvRecords: any[] = [];
    fileC: any;
    title = 'Grid Grouping';
    sourceFileName:string="";
    cibleFileName:string="";
    public dataCible = new MatTableDataSource<Cible | Group>([]);
    isDisabled = false;
    _alldata: any[] = [];
    columns: any[];
    displayedColumns: string[];
    groupByColumns: string[] = [];
    Cible!:Cible[];
    fileName:any;
    selectedItem: any;
   


    newItem: any = {

      file: '',
      column_Name: '',
      description: '',
      column_Type: '',
      mondatory: '',
      _Key: '',
      comments: '',
      C1: '',
      C2: '',
      C3: '',
      C4: '',
      C5: '',
      status: false,
      fileName: '',
      date: '',
      user: {
        id: localStorage.getItem("user_id")
      }
       
    };
  

   
  
  
    errorCible:any;
    constructor(protected dataService: FilesService, private route :ActivatedRoute) {
  
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
      },
      {
         field: 'deleteButton'
      },
      {
        field: 'editButton'
      }
    
      
    
    ];
      this.displayedColumns = this.columns.map(column => column.field);
      this.groupByColumns = ['file'];
    }
  
    ngOnInit() {

      this.route.queryParams.subscribe(params => {
  
           this.fileName = params['fileName'];
        
           if (this.fileName) {
        
            this.getItemC(this.fileName);
        
           }
        
          });
          const userId = localStorage.getItem("user_id");
          console.log(userId);
        }
    getItemC(fileName:string) {
      this.dataService.getItemsCibleByName(fileName).subscribe(
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
   

    addNewRow(newItem: any) {

      this.dataService.addItemToExistingFCible( this.fileName , newItem).subscribe(
  
        () => {
         window.location.reload();
          console.log('Nouvel item ajouté avec succès');
  
        },
  
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'item :', error);
        }
      );
    }

    // editRow(idItemCible: number, row: any) {
    //   this.selectedItem = { ...row };

    // }
    editRow(idItemSource: number, row: any) {
      this.selectedItem = { ...row };
    
      Swal.fire({
        title: 'Edit line',
        html: `
          <input type="text" id="fileInput" class="swal2-input" value="${this.selectedItem.file}" placeholder="file" style="font-size: 13px; " />
          <input type="text" id="columnNameInput" class="swal2-input" value="${this.selectedItem.column_Name}" placeholder="Nom de colonne" 
          style="font-size: 13px; "/>
          <input type="text" id="descriptionInput" class="swal2-input" value="${this.selectedItem.description}"  style="font-size: 13px;  placeholder="Description" />
          <input type="text" id="columnTypeInput"  class="swal2-input"value="${this.selectedItem.column_Type}"  style="font-size: 13px;   placeholder="column_Type" />
          <input type="text" id="mandatoryInput" class="swal2-input" value="${this.selectedItem.mondatory}"  style="font-size: 13px;  placeholder="mandatory" />
          <input type="text" id="keyInput" class="swal2-input" value="${this.selectedItem._Key}"  style="font-size: 13px;" placeholder="_Key" />
          <input type="text" id="commentsInput" class="swal2-input" value="${this.selectedItem.comments}"  style="font-size: 13px; " placeholder="comments" />
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: () => {
          const fileValue = (document.getElementById('fileInput') as HTMLInputElement).value;
          const columnNameValue = (document.getElementById('columnNameInput') as HTMLInputElement).value;
          const descriptionValue = (document.getElementById('descriptionInput') as HTMLInputElement).value;
          const columnTypeValue = (document.getElementById('columnTypeInput') as HTMLInputElement).value;
          const mandatoryValue = (document.getElementById('mandatoryInput') as HTMLInputElement).value;
          const keyValue = (document.getElementById('keyInput') as HTMLInputElement).value;
          const commentsValue = (document.getElementById('commentsInput') as HTMLInputElement).value;
    
          this.selectedItem.file = fileValue;
          this.selectedItem.column_Name = columnNameValue;
          this.selectedItem.description = descriptionValue;
          this.selectedItem.column_Type = columnTypeValue;
          this.selectedItem.mondatory = mandatoryValue;
          this.selectedItem._Key = keyValue;
          this.selectedItem.comments = commentsValue;
    
          this.updateRow();
        }
      });
    }
    
    updateRow() {
      const id_Item_Cible = this.selectedItem.id_Item_Cible;
      const updatedItem = { ...this.selectedItem };
    
      // Appeler la méthode pour mettre à jour les données dans votre service ou votre API
      this.dataService.editItemInExistingFCible(id_Item_Cible, updatedItem).subscribe(
        (response) => {
          window.location.reload();
          console.log('Successfully updated');
          // Ajoutez ici le code supplémentaire à exécuter après la mise à jour des données
          // Fermer la boîte de dialogue et effectuer d'autres actions si nécessaire
          this.selectedItem = null;
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la mise à jour de l\'élément', error);
          // Ajoutez ici le code supplémentaire pour gérer l'erreur
        }
      );
    }
    // editRow(idItemCible: number, updatedItem: any) {
    
    //   this.dataService.editItemInExistingFCible(idItemCible, updatedItem).subscribe(
    //     (response) => {
    //       console.log('Édition réussie');
    //     },
    //     (error) => {
    //       console.error('Une erreur s\'est produite lors de l\'édition de l\'élément', error);
    //     }
    //   );
    // }
  
   onDeleteItem(id_Item_Cible: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
     if (this.menuTrigger) {
       this.menuTrigger.openMenu(); // Ouvrez le menu contextuel
       this.dataService.deleteRowCibleInExistingFile(id_Item_Cible).subscribe(
         () => {
           console.log('Suppression réussie');
           window.location.reload();
           // Ajoutez ici le code supplémentaire à exécuter après la suppression de l'élément dans la base de données
           const index = this._alldata.findIndex((item: any) => item.id_Item_Cible === id_Item_Cible);
           if (index !== -1) {
             this._alldata.splice(index, 1);
           }
           
           Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          ).then(() => {
            window.location.reload();
          });
         },
         (error) => {
           console.error('Une erreur s\'est produite lors de la suppression de l\'élément', error);
           // Ajoutez ici le code supplémentaire pour gérer l'erreur
          }
          );
        }
          
        })
        
      }
      
    }
  