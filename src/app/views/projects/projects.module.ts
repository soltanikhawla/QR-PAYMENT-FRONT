import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  NavbarModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule
} from '@coreui/angular';
import { FormsRoutingModule } from './projects-routing.module';
import { MappingComponent } from './mapping/mapping.component';
import { EditProjectComponent } from './project/edit-project/editProjectcomponent';
import { AddProject } from './project/add-project/add-project.component';
import { ListOfActorsComponent } from './actor/list_of_actors/list_of_actors.component';
import { EditActorComponent } from './actor/edit-actor/edit-actor.component';
import { FilesIComponent } from './files-I/files-I.component';
import { ListOfProjectsComponent } from './project/list-of-projects/list-of-projects.component';
import { MatIconModule } from '@angular/material/icon';
import { AddActorComponent } from './actor/add-actor/add-actor.component';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconModule } from '@coreui/icons-angular';
import { ListOfFilesComponent } from '../files/list-of-files/list-of-files.component';
import { AddListActionComponent } from './actions/add-list-action/add-list-action.component';
import { ExtListOfActionsComponent } from './actions/ext-list-of-actions/ext-list-of-actions.component';
import { InterListActionsComponent } from './actions/inter-list-actions/inter-list-actions.component';
import { EditActionsComponent } from './actions/edit-actions/edit-actions.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { TranscoComponent } from './transco/transco.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { EditorDialogComponent } from './editor-dialog/editor-dialog.component';
import { ViewWorkshopComponent } from './workshop/view-workshop/view-workshop.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListOfUsersComponent } from './users/list-of-users/list-of-users.component';
import { MatSortModule } from '@angular/material/sort';
import { EditorDialogCommentComponent } from './editor-dialog-comment/editor-dialog-comment.component';
import { RulesComponent } from './rules/rules.component';
import { GenerateQRCodeComponent } from './generate-qrcode/generate-qrcode.component';
import { HistoriquePaymentComponent } from './historique-payment/historique-payment.component';


@NgModule({
  declarations: [
    MappingComponent,
    EditProjectComponent ,
    ListOfActorsComponent,
    EditActorComponent,
    FilesIComponent,
    AddProject,
    AddListActionComponent,
    ListOfProjectsComponent,
    AddActorComponent,
    ListOfFilesComponent,
    ExtListOfActionsComponent,
    InterListActionsComponent,
    EditActionsComponent,
    WorkshopComponent,
    TranscoComponent,
    EditorDialogComponent,
    ViewWorkshopComponent,
    AddUserComponent,
    ListOfUsersComponent,
    EditorDialogCommentComponent,
    RulesComponent,
    GenerateQRCodeComponent,
    HistoriquePaymentComponent,
   
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule,
    MatIconModule,
    TableModule,
    MatListModule,
    MatFormFieldModule,
    IconModule,
    SpinnerModule,
    TableModule,
    TabsModule,
    TooltipModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    DropdownModule,
    FormModule,
    GridModule,
    NavbarModule,
    NavModule,
    SharedModule,
    UtilitiesModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    EditorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    
  ],
  providers: [DatePipe,{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class ProjectModule {
}
