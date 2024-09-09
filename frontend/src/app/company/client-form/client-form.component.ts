import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    PanelModule, MessagesModule, InputTextModule, ButtonModule, 
    FormsModule, ReactiveFormsModule, InputMaskModule, InputTextareaModule, 
    SelectButtonModule, FloatLabelModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit{

  clientForm: FormGroup;
  client: Client  | null = null;

  isUssaOptions: any[] = [
    { label: 'Ussa', value: true },
    { label: 'Ussa Däl', value: false }];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private clientService: ClientService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) {    
    this.clientForm = this.fb.group({
      id: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      is_ussa: [''],
      phone: [''],
      phone_2: [''],
      phone_3: [''],
      passport_no: [''],
      address: [''],
      email: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.client = this.config.data.client;
    if (this.client) {
      this.clientForm.patchValue(this.client);
    }
  }

  submitForm() {
    if (this.clientForm.valid) {
      if (this.client) {
        this.clientService.updateClient(this.client.id!, this.clientForm.value).subscribe({
          next: (client: Client) => {
            console.log('Successfully updated client:', client);
            this.dialogRef.close(client);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      } else {
        this.clientService.createClient(this.clientForm.value).subscribe({
          next: (client: Client) => {
            console.log('Successfully created client:', client);
            this.dialogRef.close(client);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.clientForm);
    }
  }

}
