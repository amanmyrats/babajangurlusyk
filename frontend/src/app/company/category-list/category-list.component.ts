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
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { environment as env } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
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
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
    
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;
  
  loading: boolean = false;
  categories: Category[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private categoryService: CategoryService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService, 
  ) { }

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
  }

  getCategories(queryString: string = '') {
    this.loading = true;
    this.categoryService.getCategories(queryString).subscribe({
      next: (paginatedExpenseTypes: PaginatedResponse<Category>) => {
        console.log('Fetched ExpenseTypes successfully: ');
        console.log(paginatedExpenseTypes);
        this.categories = paginatedExpenseTypes.results!;
        this.totalRecords = paginatedExpenseTypes.count!;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.httpErrorPrinter.printHttpError(error);
        this.loading = false;
      }
    });
  }

  updateObj(category: Category) {
    this.showForm(category);
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
        this.categoryService.deleteCategory(id).subscribe({
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

  showForm(objToEdit: Category | null = null) {
    this.ref = this.dialogService.open(CategoryFormComponent, {
        header: 'Çykdajy görnüşini goş/üýtget',
        styleClass: 'fit-content-dialog',
        contentStyle: { "overflow": "auto" },
      data: {
        category: objToEdit
      }, 
      draggable: true,
      resizable: true,
    });

    this.ref.onClose.subscribe((category: Category) => {
      if (category) {
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
    this.getCategories(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }


}