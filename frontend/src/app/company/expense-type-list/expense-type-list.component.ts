import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ExpenseType } from '../models/expense-type';
import { ExpenseTypeService } from '../services/expense-type.service';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExpenseTypeFormComponent } from '../expense-type-form/expense-type-form.component';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-expense-type-list',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    InputTextModule,
    ConfirmDialogModule,
    ActionButtonsComponent,
    SharedToolbarComponent, FilterSearchComponent, SharedPaginatorComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService,
  ],
  templateUrl: './expense-type-list.component.html',
  styleUrl: './expense-type-list.component.scss'
})
export class ExpenseTypeListComponent implements OnInit {
    
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;
  
  loading: boolean = false;
  expense_types: ExpenseType[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private expenseTypeService: ExpenseTypeService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService, 
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
  }

  getExpenseTypes(queryString: string = '') {
    this.loading = true;
    this.expenseTypeService.getExpenseTypes(queryString).subscribe({
      next: (paginatedExpenseTypes: PaginatedResponse<ExpenseType>) => {
        console.log('Fetched ExpenseTypes successfully: ');
        console.log(paginatedExpenseTypes);
        this.expense_types = paginatedExpenseTypes.results!;
        this.totalRecords = paginatedExpenseTypes.count!;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(error);
        this.loading = false;
      }
    });
  }

  updateObj(expenseType: ExpenseType) {
    this.showForm(expenseType);
  }

  createObj() {
    this.showForm();
  }

  deleteObj(id: string) {
    this.confirmationService.confirm({
      message: 'Anyk pozmak isleýärsiňizmi?',
      header: 'Silme İşlemi',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Pozmak",
      rejectLabel: "Goýbolsun et",
      dismissableMask: true,

      accept: () => {
        this.expenseTypeService.deleteExpenseType(id).subscribe({
          next: (res: any) => {
            this.messageService.add(
              { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli pozuldy!' });
            this.filterSearch.search();
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    });

  }

  showForm(objToEdit: ExpenseType | null = null) {
    this.ref = this.dialogService.open(ExpenseTypeFormComponent, {
        header: 'Çykdajy görnüşini goş/üýtget',
        styleClass: 'fit-content-dialog',
        contentStyle: { "overflow": "auto" },
      data: {
        expenseType: objToEdit
      }, 
      draggable: true,
      resizable: true,
    });

    this.ref.onClose.subscribe((expenseType: ExpenseType) => {
      if (expenseType) {
        if (objToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli üytgedildi' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli üytgedildi' });
        }
        this.filterSearch.search();
      }
    });
  }

  search(queryString: string = ''): void {
    this.getExpenseTypes(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }


}