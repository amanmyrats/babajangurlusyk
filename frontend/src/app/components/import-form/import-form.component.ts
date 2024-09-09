import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-import-form',
  standalone: true,
  imports: [FileUploadModule, ToastModule, PanelModule, ],
  providers: [MessageService],
  templateUrl: './import-form.component.html',
  styleUrl: './import-form.component.scss'
})
export class ImportFormComponent {

  constructor(
    private messageService: MessageService, 
    private dialogRef: DynamicDialogRef,
  
  ) {}

  uploadExcel(event: any) {
    this.dialogRef.close(event.files[0]);
  }
}
