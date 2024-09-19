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
import { Cek } from '../models/cek.model';
import { CekService } from '../services/cek.service';
import { CekFormComponent } from '../cek-form/cek-form.component';

@Component({
  selector: 'app-cek-list',
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
  templateUrl: './cek-list.component.html',
  styleUrl: './cek-list.component.scss'
})
export class CekListComponent implements OnInit {
  
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  ceks: Cek[] = [];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;

  cols: Column[] = [];

  _selectedColumns: Column[] = [];

  constructor(
    private cekService: CekService, 
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
    
    this.cols = [
      { field: 'referenced_by', header: 'Kim getirdi?' },
      { field: 'reference_percentage', header: 'Ussa %' },
      { field: 'alan_zatlary', header: 'Alynan Harytlar' },
      { field: 'note', header: 'Bellik' },
    ];
    
    const fieldNamesToRemove = [
      'referenced_by', 'reference_percentage', 'note', 
    ]; 
    this._selectedColumns = this.cols.filter(col => !fieldNamesToRemove.includes(col.field!));
  }

  getCeks(queryString: string = '') {
    this.loading = true;
    this.cekService.getCeks(queryString).subscribe({
      next: (paginatedAgencies: PaginatedResponse<Cek>) => {
        this.ceks = paginatedAgencies.results!;
        this.totalRecords = paginatedAgencies.count!;
        console.log('Successfully fetched Ceks:');
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

  updateObj(objToEdit: Cek): void {
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
        this.cekService.deleteCek(id).subscribe({
          next: () => {
            this.getCeks();
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

  showForm(objToEdit: Cek | null = null): void {
    this.ref = this.dialogService.open(CekFormComponent, {
      header: 'Çek goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      data: {
        cek: objToEdit
      }, 
      draggable: true,
      resizable: true, 
    });

    this.ref.onClose.subscribe((cek: Cek) => {
      if (cek) {
        if (objToEdit) {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Çek üytgedildi'});
        } else {
          this.messageService.add({severity:'success', summary: 'Üstünlikli', detail: 'Çek goşuldy'});
        }
        this.filterSearch.search();
      }
    });
  }
  search(queryString: string = ''): void {
    this.getCeks(queryString);
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
