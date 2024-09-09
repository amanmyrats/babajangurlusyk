import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { ToastModule } from 'primeng/toast';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Column } from '../../models/column.model';
import { environment as env } from '../../../environments/environment';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    TableModule, SharedToolbarComponent, ToastModule, ActionButtonsComponent, FilterSearchComponent, 
    ConfirmDialogModule, SharedPaginatorComponent,
    CommonModule, FormsModule, 
    MultiSelectModule, 
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  clients: Client[] = [];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;

  cols: Column[] = [];

  _selectedColumns: Column[] = [];

  constructor(
    private clientService: ClientService, 
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
    this.cols = [
      { field: 'is_ussa', header: 'Ussamy?' },
      { field: 'phone', header: 'Telefon' },
      { field: 'phone_2', header: 'Telefon-2' },
      { field: 'phone_3', header: 'Telefon-3' },
      { field: 'passport_no', header: 'Pasport NO' },
      { field: 'address', header: 'Adres' },
      { field: 'email', header: 'E-Poçta' },
      { field: 'note', header: 'Bellik' },
    ];
    
    const fieldNamesToRemove = [
      'phone_2', 'phone_3', 'passport_no', 'address', 'email',
    ]; 
    this._selectedColumns = this.cols.filter(col => !fieldNamesToRemove.includes(col.field!));
  }

  getClients(queryString: string = '') {
    this.loading = true;
    this.clientService.getClients(queryString).subscribe({
      next: (paginatedAgencies: PaginatedResponse<Client>) => {
        this.clients = paginatedAgencies.results!;
        this.totalRecords = paginatedAgencies.count!;
        console.log('Successfully fetched Clients:');
        console.log(paginatedAgencies);
        this.loading = false;
      },
      error: (err: any) => {
        this.httpErrorPrinter.printHttpError(err);
        this.loading = false;
      }
    });
  }

  createObj(): void {
    this.showForm();
  }

  updateObj(objToEdit: Client): void {
    this.showForm(objToEdit);
  }

  deleteObj(id: string): void {
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
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            this.getClients();
            this.messageService.add(
              {severity:'success', summary:'Üstünlikli', detail:'Üstünlikli pozuldy!'});
          },
          error: (error: any) => {
            this.messageService.add(
              {severity:'success', summary:'Şowsuz', detail:'Pozup bolmady!'});
              this.httpErrorPrinter.printHttpError(error);
          }
        });
      }
    });           
  }

  showForm(objToEdit: Client | null = null): void {
    this.ref = this.dialogService.open(ClientFormComponent, {
      header: 'Müşderi goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      data: {
        client: objToEdit
      }, 
      draggable: true,
      resizable: true, 
    });

    this.ref.onClose.subscribe((client: Client) => {
      if (client) {
        if (objToEdit) {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Müşderi üytgedildi'});
        } else {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Müşderi goşuldy'});
        }
        this.filterSearch.search();
      }
    });
  }
  search(queryString: string = ''): void {
    this.getClients(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }
}
