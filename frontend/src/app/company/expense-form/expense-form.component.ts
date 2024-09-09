import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { Expense } from '../models/expense.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseService } from '../services/expense.service';
import { MessagesModule } from 'primeng/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { ExpenseType } from '../models/expense-type';
import { ExpenseTypeService } from '../services/expense-type.service';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Currency } from '../models/currency.model';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    InputNumberModule, 
    InputTextModule, 
    ButtonModule, 
    PanelModule, 
    MessagesModule, 
    DropdownModule, InputTextareaModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {

  expenseForm: FormGroup;
  expense: Expense | null = null;
  currencies: Currency[] = [];
  expenseTypes: ExpenseType[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private expenseService: ExpenseService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private currencyService: CurrencyService,
    private expenseTypeService: ExpenseTypeService,
    private formErrorPrinter: FormErrorPrinterService,
  ) { 
    this.expenseForm = this.fb.group({
      id: [''],
      expense_type: ['', Validators.required],
      description: [''],
      amount: [ null, Validators.required],
      currency: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.expense = this.config.data.expense;
    if (this.expense) {
      this.expenseForm.patchValue(this.expense);
    }
    this.getCurrencies();
    this.getExpenseTypes();
  }

  submitForm() {
    if (this.expenseForm.valid) {
      if (this.expense) {
        console.log('Updating expense:', this.expenseForm.value);
        // Update the expense
        this.expenseService.updateExpense(this.expense?.id!, this.expenseForm.value).subscribe({
          next: (expense) => {
            console.log('Expense updated:', expense);
            this.dialogRef.close(expense);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
        
      }
      else {
        // Create a new expense
        console.log('Creating expense:', this.expenseForm.value);
        this.expenseService.createExpense(this.expenseForm.value).subscribe({
          next: (expense) => {
            console.log('Expense created:', expense);
            this.dialogRef.close(expense);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.expenseForm);
    }
  }

  getCurrencies(queryString: string = '') {
    this.currencyService.getCurrencies(queryString).subscribe({
      next: (paginatedCurrencies: PaginatedResponse<Currency>) => {
        this.currencies = paginatedCurrencies.results!;
        console.log('Fetched Currencies successfully.');
        console.log(paginatedCurrencies);
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }

  getExpenseTypes(queryString: string = '') {
    this.expenseTypeService.getExpenseTypes(queryString).subscribe({
      next: (paginatedExpenseTypes: PaginatedResponse<ExpenseType>) => {
        console.log('Fetched Expense Types successfully.');
        console.log(paginatedExpenseTypes);
        this.expenseTypes = paginatedExpenseTypes.results!;
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }


}
