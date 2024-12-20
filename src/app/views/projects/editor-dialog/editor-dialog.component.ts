import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss']
})

export class EditorDialogComponent {
  uniqueId: number; 
  mappingRule: string;
  constructor( 
    public dialogRef: MatDialogRef<EditorDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { mappingRule: string } 
  ) {
    this.uniqueId = Date.now();
    this.mappingRule = data?.mappingRule || '';
  }

  onOk(): void {
    this.dialogRef.close(this.mappingRule); 
  }

  onCancel(): void { 
    this.dialogRef.close(); 
  } 

  onEditorChange(content: string): void {   
    console.log(content)
    this.mappingRule = content;
  }
  onEditorInit(editor: { on: (arg0: string, arg1: () => void) => void; getContent: () => string; }) {
    editor.on('change', () => {
      this.mappingRule = editor.getContent();
    });
  }


}