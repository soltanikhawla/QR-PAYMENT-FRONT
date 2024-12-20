import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/_Model/User';
import {FilesService} from 'src/app/_Services/files.service';
import Swal from 'sweetalert2';
import { Cible } from '../cible-file/cible';



@Component({
  selector: 'app-list-of-files',
  templateUrl: './list-of-files.component.html',
  styleUrls: ['./list-of-files.component.scss']
})
export class ListOfFilesComponent implements OnInit {
  userC !: User;
  colCible : any;
  ItemS : any;
  cible !: Cible[];
  ItemC : any;
  fileName : any;

  public constructor(private filesService : FilesService,private router :Router, private http :HttpClient) {}

  ngOnInit(): void {

      this.getItemsC();

      this.getItemsS();

  }
  getItemsC() {

      this.filesService.getItemsCibleByNameAndDateCreation().subscribe(data => {

          this.ItemC = data;

          console.log(this.ItemC);

      })

  }
  getItemsS() {

      this.filesService.getItemsSourceByNameAndDateCreation().subscribe(data => {

          this.ItemS = data;

          console.log(this.ItemS);

      })

  }
  navigateToPage(fileName: string) {
    if (this.ItemS && this.isFileNameInItemS(fileName)) {
      this.router.navigate(["/files/source-crud"], { queryParams: { fileName: fileName } });
    } else if (this.ItemC && this.isFileNameInItemC(fileName)) {
      this.router.navigate(["/files/cible-crud"], { queryParams: { fileName: fileName } });
    } else {
      // Handle the case when neither source nor cible file exists
      console.log("File not found.");
      // You can display an error message or perform any other action here
    }
  }
 
  isFileNameInItemS(fileName: string): boolean {
    return this.ItemS && this.ItemS.some((item: any) => item.fileName === fileName);
  }
 
  isFileNameInItemC(fileName: string): boolean {
    return this.ItemC && this.ItemC.some((item: any) => item.fileName === fileName);
  }
       
   
      deleteSourceFile(fileName: string): void {
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
            this.fileName = fileName;
          this.filesService.deleteItemsBySourceFName(fileName).subscribe(
            () => {
              console.log('Suppression réussie');
              window.location.reload();
              // Ajoutez ici le code supplémentaire à exécuter après la suppression du fichier source
            },
            (error) => {
              console.error('Une erreur s\'est produite lors de la suppression du fichier source', error);
              // Ajoutez ici le code supplémentaire pour gérer l'erreur
            }
          );
          }
        })
         
        }
       

        deleteCibleFile(fileName: string): void {
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
              this.fileName = fileName;
              this.filesService.deleteItemsByCibleFName(fileName).subscribe(
                () => {
                  console.log('Suppression réussie');
                  window.location.reload();
             
                },
                (error) => {
                  console.error('Une erreur s\'est produite lors de la suppression du fichier cible', error);
               
                }
              );
            }
          })
       
        }

}

