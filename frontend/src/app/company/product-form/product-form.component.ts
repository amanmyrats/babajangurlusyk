import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Currency } from '../models/currency.model';
import { CurrencyService } from '../services/currency.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { Unit } from '../models/unit.model';
import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    PanelModule, MessagesModule, InputTextModule, ButtonModule, 
    FormsModule, ReactiveFormsModule, InputMaskModule, InputTextareaModule, 
    DropdownModule, FloatLabelModule, InputNumberModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit{

  productForm: FormGroup;
  product: Product  | null = null;
  categories: Category[] = [];
  currencies: Currency[] = [];
  units: Unit[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private unitService: UnitService,
  ) { 
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      name_2: [''],
      name_3: [''],
      unit: [''],
      initial_price: [''],
      initial_price_currency: [''],
      sale_price: [''],
      sale_price_currency: [''],
      category: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.product = this.config.data.product;
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
    this.getCategories();
    this.getCurrencies();
    this.getUnits();
  }

  submitForm() {
    if (this.productForm.valid) {
      if (this.product) {
        this.productService.updateProduct(this.product.id!, this.productForm.value).subscribe({
          next: (product: Product) => {
            console.log('Successfully updated product:', product);
            this.dialogRef.close(product);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe({
          next: (product: Product) => {
            console.log('Successfully created product:', product);
            this.dialogRef.close(product);
          },
          error: (err: any) => {
            console.log(err);
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.productForm);
    }
  }

  getCategories(queryString: string = '') {
    this.categoryService.getCategories(queryString).subscribe({
      next: (paginatedResponse: any) => {
        this.categories = paginatedResponse.results!;
        console.log('Fetched categories successfully:', this.categories);
      },
      error: (err: any) => {
        console.log('Error happened when fetching categories:', err);
      }
    });
  }

  getCurrencies(queryString: string = '') {
    this.currencyService.getCurrencies(queryString).subscribe({
      next: (paginatedResponse: any) => {
        this.currencies = paginatedResponse.results!;
        console.log('Fetched currencies successfully:', this.currencies);
      },
      error: (err: any) => {
        console.log('Error happened when fetching currencies:', err);
      }
    });
  }

  getUnits(queryString: string = '') {
    this.unitService.getUnits(queryString).subscribe({
      next: (paginatedResponse: any) => {
        this.units = paginatedResponse.results!;
        console.log('Fetched units successfully:', this.units);
      },
      error: (err: any) => {
        console.log('Error happened when fetching units:', err);
      }
    });
  }

}
