import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CurrencyService } from '../services/currency.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { Currency } from '../models/currency.model';

@Component({
  selector: 'app-currency-form',
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
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.scss'
})
export class CurrencyFormComponent implements OnInit {

  currencyForm: FormGroup;
  currency: Currency | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private currencyService: CurrencyService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) {
    this.currencyForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currency = this.config.data.currency;
    if (this.currency) {
      this.currencyForm.patchValue(this.currency);
    }
  }

  submitForm() {
    if (this.currencyForm.valid) {
      if (this.currency) {
        console.log('Updating currency:', this.currencyForm.value);
        // Update the currency
        this.currencyService.updateCurrency(this.currency?.id!, this.currencyForm.value).subscribe({
          next: (currency: Currency) => {
            console.log('Currency updated:', currency);
            this.dialogRef.close(currency);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });

      }
      else {
        // Create a new currency
        console.log('Creating currency:', this.currencyForm.value);
        this.currencyService.createCurrency(this.currencyForm.value).subscribe({
          next: (currency: Currency) => {
            console.log('Currency created:', currency);
            this.dialogRef.close(currency);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.currencyForm);
    }
  }

}
