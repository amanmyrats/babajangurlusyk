import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    PanelModule, 
    MessagesModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule,
    ButtonModule
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, 
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit{

  categoryForm: FormGroup;
  category: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private categoryService: CategoryService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService, 
  ) { 
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.category = this.config.data.category;
    if (this.category) {
      this.categoryForm.patchValue(this.category);
    }
  }

  submitForm() {
    if (this.categoryForm.valid) {
      if (this.category) {
        console.log('Updating category:', this.categoryForm.value);
        // Update the category
        this.categoryService.updateCategory(this.category?.id!, this.categoryForm.value).subscribe({
          next: (category: Category) => {
            console.log('Category updated:', category);
            this.dialogRef.close(category);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
        
      }
      else {
        // Create a new category
        console.log('Creating category:', this.categoryForm.value);
        this.categoryService.createCategory(this.categoryForm.value).subscribe({
          next: (category: Category) => {
            console.log('Category created:', category);
            this.dialogRef.close(category);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.categoryForm);
    }
  }


}
