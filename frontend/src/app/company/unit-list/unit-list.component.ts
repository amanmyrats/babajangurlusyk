import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { Currency } from '../models/currency.model';
import { CurrencyService } from '../services/currency.service';
import { environment as env } from '../../../environments/environment';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    InputTextModule,
    ConfirmDialogModule,
    ActionButtonsComponent,
    SharedToolbarComponent, FilterSearchComponent, 
    SharedPaginatorComponent, 
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService,
  ],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.scss'
})
export class UnitListComponent implements OnInit {
    
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  loading: boolean = false;
  currencies: Currency[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private currencyService: CurrencyService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
  }

  getCurrencies(queryString: string = '') {
    this.loading = true;
    this.currencyService.getCurrencies(queryString).subscribe({
      next: (paginatedResponse: PaginatedResponse<Currency>) => {
        console.log('Fetched Currencies successfully: ', paginatedResponse.results);
        this.currencies = paginatedResponse.results!;
        this.totalRecords = paginatedResponse.count!;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching Currencies: ', error)
        this.loading = false;
      }
    });
  }

  updateObj(currency: Currency) {
    this.showForm(currency);
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
        this.currencyService.deleteCurrency(id).subscribe({
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

  showForm(objToEdit: Currency | null = null) {
    this.ref = this.dialogService.open(UnitFormComponent, {
      header: 'Birlik goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      data: {
        currency: objToEdit
      }, 
      draggable: true,
      resizable: true,
    });

    this.ref.onClose.subscribe((currency: Currency) => {
      if (currency) {
        if (objToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Birlik üytgedildi' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Birlik goşuldy' });
        }
        this.filterSearch.search();
      }
    });
  }

  search(queryString: string = ''): void {
    this.getCurrencies(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }


}
