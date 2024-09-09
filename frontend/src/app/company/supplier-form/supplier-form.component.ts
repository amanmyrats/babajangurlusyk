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
import { Supplier } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    PanelModule, MessagesModule, InputTextModule, ButtonModule, 
    FormsModule, ReactiveFormsModule, InputMaskModule, InputTextareaModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit{

  supplierForm: FormGroup;
  supplier: Supplier  | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private supplierService: SupplierService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) {    
    this.supplierForm = this.fb.group({
      id: [''],
      first_name: ['', Validators.required],
      last_name: [''],
      phone: ['', Validators.required],
      phone_2: [''],
      phone_3: [''],
      address: [''],
      email: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.supplier = this.config.data.supplier;
    if (this.supplier) {
      this.supplierForm.patchValue(this.supplier);
    }
  }

  submitForm() {
    if (this.supplierForm.valid) {
      if (this.supplier) {
        this.supplierService.updateSupplier(this.supplier.id!, this.supplierForm.value).subscribe({
          next: (supplier: Supplier) => {
            console.log('Successfully updated supplier:', supplier);
            this.dialogRef.close(supplier);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      } else {
        this.supplierService.createSupplier(this.supplierForm.value).subscribe({
          next: (supplier: Supplier) => {
            console.log('Successfully created supplier:', supplier);
            this.dialogRef.close(supplier);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.supplierForm);
    }
  }

}
