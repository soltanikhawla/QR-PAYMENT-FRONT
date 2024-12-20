import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListActionComponent } from './actions/add-list-action/add-list-action.component';
import { EditProjectComponent } from './project/edit-project/editProjectcomponent';
import { ListOfProjectsComponent } from './project/list-of-projects/list-of-projects.component';
import { EditActorComponent } from './actor/edit-actor/edit-actor.component';
import { MappingComponent } from './mapping/mapping.component';
import { ListOfActorsComponent } from './actor/list_of_actors/list_of_actors.component';
import { FilesIComponent } from './files-I/files-I.component';
import { AddProject } from './project/add-project/add-project.component';
import { AddActorComponent } from './actor/add-actor/add-actor.component';
import { ExtListOfActionsComponent } from './actions/ext-list-of-actions/ext-list-of-actions.component';
import { InterListActionsComponent } from './actions/inter-list-actions/inter-list-actions.component';
import { EditActionsComponent } from './actions/edit-actions/edit-actions.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { TranscoComponent } from './transco/transco.component';
import { ViewWorkshopComponent } from './workshop/view-workshop/view-workshop.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListOfUsersComponent } from './users/list-of-users/list-of-users.component';
import { RulesComponent } from './rules/rules.component';
import { GenerateQRCodeComponent } from './generate-qrcode/generate-qrcode.component';
import { HistoriquePaymentComponent } from './historique-payment/historique-payment.component';
;
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Projects'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'form-control'
      },
      {
        path: 'list-of-projects',
        component: ListOfProjectsComponent,
        data: {
          title: 'List of Projects'
        }
      },
      {
        path: 'list-of-actors',
        component: ListOfActorsComponent,
        data: {
          title: 'List of Actors'
        }
      },
      {
        path: 'add-actor',
        component: AddActorComponent,
        data: {
          title: 'Add Actor'
                }
               
      },
      {
        path: 'add-project',
        component: AddProject,
        data: {
          title: 'Add Project'
        }
      },
      {
        path: 'edit-project',
        component: EditProjectComponent,
        data: {
          title: 'Edit Project'
        }
      },
      {
        path: 'mapping',
        component: MappingComponent,
        data: {
          title: 'Mapping'
        }
      },
      {
        path: 'edit-actor',
        component: EditActorComponent,
        data: {
          title: 'Edit Actor'
        }
      },
      {
        path: 'files-I',
        component: FilesIComponent,
        data: {
          title: 'Files'
        }
      },
      {
        path: 'HistoriquePayment',
        component: HistoriquePaymentComponent,
        data: {
          title: 'HistoriquePayment'
        }
      },
      {
        path: 'actions',
        component: AddListActionComponent,
        data: {
          title: 'Actions'
        }
      },
      {
        path: 'ext-list-of-actions',
        component: ExtListOfActionsComponent ,
        data: {
          title: 'List of Actions'
        }
      },
      {
        path: 'inter-list-actions',
        component: InterListActionsComponent ,
        data: {
          title: 'List of Actions'
        }
      },
      {
        path: 'edit-actions',
        component: EditActionsComponent,
        data: {
          title: 'Edit Actions'
        }
      },
      {
        path: 'workshops',
        component: WorkshopComponent,
        data: {
          title: 'Workshops'
        }
      },
      {
        path: 'generateQRCode',
        component: GenerateQRCodeComponent,
        data: {
          title: 'generateQRCode'
        }
      },
      {
        path: 'rules',
        component: RulesComponent,
        data: {
          title: 'Rules'
        }
      },
      {
        path: 'viewWorkshop',
        component: ViewWorkshopComponent,
        data: {
          title: ' View Workshop'
        }
      },
      {
        path: 'transco',
        component: TranscoComponent,
        data: {
          title: 'Transco'
        }
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        data: {
          title: 'add-user'
        }
      },
      {
        path: 'list-of-users',
        component: ListOfUsersComponent,
        data: {
          title: 'list-of-users'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {
}
