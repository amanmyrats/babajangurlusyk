import { Component, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseService } from '../services/expense.service';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { TableModule } from 'primeng/table';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { environment as env } from '../../../environments/environment';
import { ExpenseType } from '../models/expense-type';
import { ExpenseTypeService } from '../services/expense-type.service';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule,
    ToastModule,
    InputTextModule,
    ConfirmDialogModule,
    ActionButtonsComponent,
    SharedToolbarComponent,
    ExpenseFormComponent,
    FilterSearchComponent, SharedPaginatorComponent
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  expenses: Expense[] = [];
  expenseTypes: ExpenseType[] = [];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private expenseService: ExpenseService,
    private expenseTypeService: ExpenseTypeService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService, 
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
  }

  getExpenses(queryString: string = '') {
    this.loading = true;
    this.expenseService.getExpenses(queryString).subscribe({
      next: (paginatedExpenses: PaginatedResponse<Expense>) => {
        this.expenses = paginatedExpenses.results!;
        this.totalRecords = paginatedExpenses.count!;
        this.loading = false;
        console.log(paginatedExpenses);
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
        this.loading = false;
      }
    });
  }

  getExpenseTypes(queryString: string = '') {
    this.expenseTypeService.getExpenseTypes(queryString).subscribe({
      next: (paginatedExpenseTypes: PaginatedResponse<ExpenseType>) => {
        this.expenseTypes = paginatedExpenseTypes.results!;
        console.log('Successfully fetched Expense Types');
        console.log(paginatedExpenseTypes);
      },
      error: (err: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(err);
      }
    });
  }

  updateObj(expense: Expense) {
    this.showForm(expense);
  }

  createObj() {
    this.showForm();
  }

  deleteObj(id: string) {
    this.confirmationService.confirm({
      message: 'Anyk pozmak isleýärsiňizmi?',
      header: 'Pozmak',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Poz",
      rejectLabel: "Goýbolsun et",
      dismissableMask: true,

      accept: () => {
        this.expenseService.deleteExpense(id).subscribe({
          next: (res: any) => {

            this.messageService.add(
              { severity: 'success', summary: 'Başarılı', detail: 'Başarıyla silindi!' });
            this.filterSearch.search(); 
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    });
  }

  showForm(objToEdit: Expense | null = null) {
    this.ref = this.dialogService.open(ExpenseFormComponent, {
      header: 'Çykdajy goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      data: {
        expense: objToEdit
      }, 
      draggable: true, 
      resizable: true, 
    });

    this.ref.onClose.subscribe((expense: Expense) => {
      if (expense) {
        if (objToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli üytgedildi' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli goşuldy' });
        }
      }
      this.filterSearch.search();
    });
  }

  search(queryString: string = ''): void {
    this.getExpenses(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }

}
