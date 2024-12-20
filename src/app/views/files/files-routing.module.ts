
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CibleFileComponent } from './cible-file/cible-file.component';
import { SourceFileComponent } from './source-file/source-file.component';
import { CibleCRUDComponent } from './cible-crud/cible-crud.component';
import { SourceCRUDComponent } from './source-crud/source-crud.component';
import { ListOfFilesComponent } from './list-of-files/list-of-files.component';
import { MappingFileComponent } from './mapping-file/mapping-file.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Files'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'files'
      },
      {
        path: 'cible-file',
        component: CibleFileComponent,
        data: {
          title: 'CibleFile'
        }
      },
      {
        path: 'source-file',
        component: SourceFileComponent,
        data: {
          title: 'SourceFile'
        }
      },
      {
        path: 'source-crud',
        component: SourceCRUDComponent,
        data: {
          title: 'SourceCrud'
        }
      },
      {
        path: 'cible-crud',
        component: CibleCRUDComponent,
        data: {
          title: 'CibleCrud'
        }
      },
      {
        path: 'mapping-file',
        component: MappingFileComponent,
        data: {
          title: 'MappingFile'
        }
      },
      {
        path: 'list-of-files',
        component:ListOfFilesComponent ,
          
        data: {
          title: 'List of Files'
        }
      },
     
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonsRoutingModule {
}
