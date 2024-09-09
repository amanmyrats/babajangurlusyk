import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { ExpenseType } from '../models/expense-type';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseTypeService } from '../services/expense-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';

@Component({
  selector: 'app-expense-type-form',
  standalone: true,
  imports: [
    PanelModule, 
    MessagesModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule,
    ButtonModule
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './expense-type-form.component.html',
  styleUrl: './expense-type-form.component.scss'
})
export class ExpenseTypeFormComponent implements OnInit{

  expenseTypeForm: FormGroup;
  expenseType: ExpenseType | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private expenseTypeService: ExpenseTypeService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService, 
  ) { 
    this.expenseTypeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.expenseType = this.config.data.expenseType;
    if (this.expenseType) {
      this.expenseTypeForm.patchValue(this.expenseType);
    }
  }

  submitForm() {
    if (this.expenseTypeForm.valid) {
      if (this.expenseType) {
        console.log('Updating expenseType:', this.expenseTypeForm.value);
        // Update the expenseType
        this.expenseTypeService.updateExpenseType(this.expenseType?.id!, this.expenseTypeForm.value).subscribe({
          next: (expenseType: ExpenseType) => {
            console.log('ExpenseType updated:', expenseType);
            this.dialogRef.close(expenseType);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
        
      }
      else {
        // Create a new expenseType
        console.log('Creating expenseType:', this.expenseTypeForm.value);
        this.expenseTypeService.createExpenseType(this.expenseTypeForm.value).subscribe({
          next: (expenseType: ExpenseType) => {
            console.log('ExpenseType created:', expenseType);
            this.dialogRef.close(expenseType);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.expenseTypeForm);
    }
  }


}
