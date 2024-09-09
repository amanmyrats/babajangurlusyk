import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { Paginator } from 'primeng/paginator';
import { environment as env } from '../../../environments/environment';
import { Payment } from '../models/payment.model';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { CommonModule } from '@angular/common';
import { Client } from '../models/client.model';
import { Supplier } from '../models/supplier.model';
import { PaymentService } from '../services/payment.service';
import { ClientService } from '../services/client.service';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    TableModule, 
    ToastModule, 
    InputTextModule, 
    ConfirmDialogModule,
    ActionButtonsComponent, 
    SharedToolbarComponent, 
    SharedPaginatorComponent,
    FilterSearchComponent, 
    CommonModule, 
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService, 
  ],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent implements OnInit{
  @ViewChild('paginator', { static: true }) paginator!: Paginator;

  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  loading: boolean = false;
  payments: Payment[] = [];
  paymentTypes: any[] = [];
  clients: Client[] = [];
  suppliers: Supplier[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private paymentService: PaymentService, 
    public dialogService: DialogService,
    public messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private httpErrorPrinter: HttpErrorPrinterService, 
    private clientService: ClientService,
    private supplierService: SupplierService,
  ) {}

  ngOnInit() {
    this.rows = env.pagination.defaultPageSize;
    this.getPaymentTypes();
    this.getClients();
    this.getSuppliers();
  }

  getPayments(queryString: string = '') {
    this.loading = true;
    this.paymentService.getPayments(queryString).subscribe({
      next: (paginatedObjects: PaginatedResponse<Payment>) => {
        this.payments =paginatedObjects.results!;
        this.totalRecords = paginatedObjects.count!;
        this.loading = false;
        console.log('Payments: ', paginatedObjects);
      },
      error: (error: any) => {
        console.error('Error fetching Payments: ', error)
        this.loading = false;
      }
    });
  }

  updateObj(payment: Payment) {
    this.showForm(payment);
  }

  createObj() {
    this.showForm();
  }

  deleteObj(id: string) {
    this.confirmationService.confirm({
      message: 'Anyk pozmak isleýärsiňizmi?',
      header: 'Pozmak',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      acceptLabel: "Poz",
      rejectLabel: "Goýbolsun et",
      dismissableMask: true, 

      accept: () => {
        this.paymentService.deletePayment(id).subscribe({
          next: (res: any) => {
            this.messageService.add(
              {severity:'success', summary:'Üstünlikli', detail:'Üstünlikli pozuldy!'});
            this.filterSearch.search();
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    });

  }

  showForm(objToEdit: Payment | null = null) {
    this.ref = this.dialogService.open(PaymentFormComponent, {
      header: 'Töleg goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      data: {
        payment: objToEdit
      },
      draggable: true,
      resizable: true

    });

    this.ref.onClose.subscribe((payment: Payment) => {
      if (payment) {
        if (objToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Töleg üytgedildi' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Töleg goşuldy' });
        }
        this.filterSearch.search();
      }
    });
  }

  search(queryString: string = ''): void {
    this.getPayments(queryString);
  }

  getPaymentTypes(): void {
    this.paymentTypes = this.paymentService.getPaymentTypes();
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

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }

}
