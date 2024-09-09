import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table'
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { environment as env } from '../../../environments/environment';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { Column } from '../../models/column.model';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ImportFormComponent } from '../../components/import-form/import-form.component';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    TableModule, 
    SharedToolbarComponent, 
    ToastModule, 
    ConfirmDialogModule,
    ActionButtonsComponent, 
    FilterSearchComponent, CommonModule, 
    SharedPaginatorComponent,
    FormsModule, 
    MultiSelectModule,
    SkeletonModule
    ,
  ],
  providers: [
    DialogService, 
    MessageService, 
    ConfirmationService,
    HttpErrorPrinterService,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, AfterViewInit {

  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  products: Product[] = [];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;
  refImport: DynamicDialogRef | undefined;
  categories: Category[] = [];

  cols: Column[] = [];
  _selectedColumns: Column[] = [];

  constructor(
    private productService: ProductService,
    private dialogService: DialogService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService, 
    private categoryService: CategoryService,
    private httpErrorPrinterService: HttpErrorPrinterService,
  ){
  }
  
  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;

    this.cols = [
      { field: 'name_2', header: 'Ady-2' },
      { field: 'name_3', header: 'Ady-3' },
      
      { field: 'unit', header: 'Birligi' },
      
      { field: 'initial_price', header: 'Gelen Bahasy' },

      { field: 'sale_price', header: 'Satyş Bahasy' },
      
      { field: 'category', header: 'Flight' },
      { field: 'description', header: 'Pick up' },
    ];

    const fieldNamesToRemove = [
      'name_2', 'name_3', 'description', 'category'
    ]; // Replace with your desired field names
  
      // Method 1: Using filter (Immutable)
      this._selectedColumns = this.cols.filter(col => !fieldNamesToRemove.includes(col.field!));
  
  }

  ngAfterViewInit(): void {

  }

  getProducts(queryString: string = ''){
    this.loading = true;
    this.productService.getProducts(queryString).subscribe({
      next: (paginatedResponse: PaginatedResponse<Product>) => {
        this.products = paginatedResponse.results!;
        this.totalRecords = paginatedResponse.count!;
        console.log("Successfully fetched products");
        console.log(paginatedResponse);
        this.loading = false;
      },
      error: (error: any) => {
        console.log("Error happened when fetching products.");
        console.log(error);
        this.loading = false;
      }
    })
  }

  showForm(productToEdit: Product | null = null): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Haryt goş/üýtget',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      width: '90%',
      height: '90%',
      baseZIndex: 10000, 
      data: {
        product: productToEdit
      }, 
      maximizable: true,
      resizable: true,
    });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        if (productToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Haryt üstünlikli üýtgedildi!' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Üstünlikli', detail: 'Haryt üstünlikli goşuldy!' });
        }
        this.filterSearch.search();
      }
    });
  }

  createObj(): void {
    this.showForm();
  }

  updateObj(product: Product): void {
    this.showForm(product);
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
      acceptLabel: "Sil",
      rejectLabel: "Goýbolsun et",
      dismissableMask: true,

      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.getProducts();
              this.messageService.add(
                {severity:'success', summary:'Üstünlikli', detail:'Üstünlikli pozuldy!'});
          },
          error: (error: any) => {
            console.log("Error happened when deleting product");
            console.log(error);
          }
        });
      }
    });

  }
  
  getCategories(queryString: string = ''): void {
    console.log("Getting categories...");
    this.categoryService.getCategories(queryString).subscribe({
      next: (paginatedResponse: PaginatedResponse<Category>) => {
        this.categories = paginatedResponse.results!;
        console.log("Successfully fetched categories");
        console.log(paginatedResponse);
      },
      error: (error: any) => {
        console.log("Error happened when fetching categories");
        console.log(error);
      }
    });
  }

  export(): void {
    this.productService.handleExport(this.filterSearch.getQueryParams());
  }

  import(): void {
    this.ref = this.dialogService.open(ImportFormComponent, {
      header: 'Harytlary lükgeläp import et',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      width: '90%',
      height: '90%',
      baseZIndex: 10000, 
      maximizable: true,
      resizable: true,
    });

    this.ref.onClose.subscribe((file: File) => {
      if (file) {
        console.log("File to import: ", file);
        this.productService.import(file).subscribe({
          next: () => {
            this.messageService.add(
              { severity: 'success', summary: 'Üstünlik', detail: 'Harytlar üstünlikli import edildi' });
            this.filterSearch.search();
          },
          error: (error: any) => {
            this.httpErrorPrinterService.printHttpError(error);
          }
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }

  search(queryString: string = ''): void {
    this.getProducts(queryString);
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
      //restore original order
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
}

}
