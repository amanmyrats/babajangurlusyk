import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { CalendarModule } from 'primeng/calendar';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Client } from '../models/client.model';
import { Supplier } from '../models/supplier.model';
import { ClientService } from '../services/client.service';
import { SupplierService } from '../services/supplier.service';
import { Cek } from '../models/cek.model';
import { CekService } from '../services/cek.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';


  // Custom validator
  function clientOrSupplierValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup;
      const client = formGroup.get('client')?.value;
      const supplier = formGroup.get('supplier')?.value;
  
      if (!client && !supplier) {
        return { clientOrSupplierRequired: true };
      }
  
      return null;
    };
  }

@Component({
  selector: 'app-cek-form',
  standalone: true,
  imports: [
    PanelModule, 
    MessagesModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule, InputNumberModule, CalendarModule, 
    ButtonModule, FloatLabelModule, DropdownModule, CommonModule, 
    SelectButtonModule, InputTextareaModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService
  ],
  templateUrl: './cek-form.component.html',
  styleUrl: './cek-form.component.scss'
})
export class CekFormComponent implements OnInit{

  isNesyeOptions: any[] = [
    { label: 'Nesýe', value: true },
    { label: 'Nagt', value: false }
  ];
  cekForm: FormGroup;
  cek: Cek | null = null;
  clients: Client[] = [];
  suppliers: Supplier[] = [];
  ussalar: Client[] = [];
  partnerTypes: any[] = [];
  cekTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private cekService: CekService,
    private clientService: ClientService, 
    private supplierService: SupplierService, 
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) { 
    this.cekForm = this.fb.group({
      id: [''],
      cek_type: [],
      no: [''],
      partner_type: ['', Validators.required],
      client: [''],
      supplier: [''],
      is_nesye: [''],
      amount: [null, Validators.required],
      alan_zatlary: [''],
      referenced_by: [''],
      reference_percentage: [5],
      note: [''],
      date: [ new Date().toISOString().split('T')[0], Validators.required],
    }, {
      validators: [clientOrSupplierValidator()]
  });
  }

  ngOnInit(): void {
    this.cek = this.config.data.cek;
    if (this.cek) {
      this.cekForm.patchValue(this.cek);
    }
    this.getCekTypes();
    this.getPartnerTypes();
    this.getClients();
    this.getSuppliers();
    this.getUssas();
  }

  submitForm() {
    if (this.cekForm.value.partner_type === 'CLIENT') {
      this.cekForm.patchValue({ supplier: '' });
    }
    if (this.cekForm.value.partner_type === 'SUPPLIER') {
      this.cekForm.patchValue({ client: '' });
    }
    if (this.cekForm.valid) {
      if (this.cek) {
        console.log('Updating cek:', this.cekForm.value);
        // Update the cek
        this.cekService.updateCek(this.cek?.id!, this.cekForm.value).subscribe({
          next: (cek: Cek) => {
            console.log('Cek updated:', cek);
            this.dialogRef.close(cek);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
        
      }
      else {
        // Create a new cek
        // Set cek_type to 'SATYS' if partner_type is 'CLIENT'
        if (this.cekForm.value.partner_type === 'CLIENT') {
          this.cekForm.patchValue({ cek_type: 'SATYS' });
        }
        if (this.cekForm.value.partner_type === 'SUPPLIER') {
          this.cekForm.patchValue({ cek_type: 'SATYN_ALYS' });
        }
        console.log('Creating cek:', this.cekForm.value);
        this.cekService.createCek(this.cekForm.value).subscribe({
          next: (cek: Cek) => {
            console.log('Cek created:', cek);
            this.dialogRef.close(cek);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.cekForm);
      console.log(this.cekForm.errors);
    }
  }

  getClients(queryString: string = ''): void {
    this.clientService.getClients(queryString).subscribe({
      next: (paginatedObjects: PaginatedResponse<Client>) => {
        this.clients = paginatedObjects.results!;
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }

  getSuppliers(queryString: string = ''): void {
    this.supplierService.getSuppliers(queryString).subscribe({
      next: (paginatedObjects: PaginatedResponse<Supplier>) => {
        this.suppliers = paginatedObjects.results!;
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }

  getUssas(queryString: string = '?is_ussa=1'): void {
    this.clientService.getClients(queryString).subscribe({
      next: (paginatedObjects: PaginatedResponse<Client>) => {
        this.ussalar = paginatedObjects.results!;
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }

  getCekTypes(): void {
    this.cekTypes = this.cekService.getCekTypes();
  }

  getPartnerTypes(): void {
    this.partnerTypes = this.cekService.getPartnerTypes();
  }


}
