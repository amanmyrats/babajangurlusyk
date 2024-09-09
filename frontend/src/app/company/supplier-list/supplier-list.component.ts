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
import { Supplier } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';

@Component({
  selector: 'app-supplier-list',
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
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit {
  
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  suppliers: Supplier[] = [];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;

  cols: Column[] = [];

  _selectedColumns: Column[] = [];

  constructor(
    private supplierService: SupplierService, 
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
    this.cols = [
      { field: 'last_name', header: 'Familiýasy' },
      { field: 'phone', header: 'Telefon' },
      { field: 'phone_2', header: 'Telefon-2' },
      { field: 'phone_3', header: 'Telefon-3' },
      { field: 'address', header: 'Adres' },
      { field: 'email', header: 'E-Poçta' },
      { field: 'note', header: 'Bellik' },
    ];
    
    const fieldNamesToRemove = [
      'address', 'email', 
    ]; 
    this._selectedColumns = this.cols.filter(col => !fieldNamesToRemove.includes(col.field!));
  }

  getSuppliers(queryString: string = '') {
    this.loading = true;
    this.supplierService.getSuppliers(queryString).subscribe({
      next: (paginatedAgencies: PaginatedResponse<Supplier>) => {
        this.suppliers = paginatedAgencies.results!;
        this.totalRecords = paginatedAgencies.count!;
        console.log('Successfully fetched Suppliers:');
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

  updateObj(objToEdit: Supplier): void {
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
        this.supplierService.deleteSupplier(id).subscribe({
          next: () => {
            this.getSuppliers();
            this.messageService.add(
              {severity:'success', summary:'Üstünlikli', detail:'Üstünlikli pozuldy!'});
          },
          error: (error: any) => {
            this.messageService.add(
              {severity:'error', summary:'Şowsuz', detail:'Pozup bolmady!'});
              this.httpErrorPrinter.printHttpError(error);
          }
        });
      }
    });           
  }

  showForm(objToEdit: Supplier | null = null): void {
    this.ref = this.dialogService.open(SupplierFormComponent, {
      header: 'Telekeçi goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      data: {
        supplier: objToEdit
      }, 
      draggable: true,
      resizable: true, 
    });

    this.ref.onClose.subscribe((supplier: Supplier) => {
      if (supplier) {
        if (objToEdit) {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Telekeçi üýtgedildi'});
        } else {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Telekeçi goşuldy'});
        }
        this.filterSearch.search();
      }
    });
  }
  search(queryString: string = ''): void {
    this.getSuppliers(queryString);
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
