import { Component, Inject } from '@angular/core';
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editor-dialog-comment',
  templateUrl: './editor-dialog-comment.component.html',
  styleUrls: ['./editor-dialog-comment.component.scss']
})
export class EditorDialogCommentComponent {
  uniqueId: number; 
  comment: string;
  constructor( 
    public dialogRef: MatDialogRef<EditorDialogCommentComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { comment: string } 
  ) {
    this.uniqueId = Date.now();
    this.comment = data?.comment || '';
  }

  onOk(): void {
    this.dialogRef.close(this.comment); 
  }

  onCancel(): void { 
    this.dialogRef.close(); 
  } 

  onEditorChange(content: string): void {   
    console.log(content)
    this.comment = content;
  }
  onEditorInit(editor: { on: (arg0: string, arg1: () => void) => void; getContent: () => string; }) {
    editor.on('change', () => {
      this.comment = editor.getContent();
    });
  }


}