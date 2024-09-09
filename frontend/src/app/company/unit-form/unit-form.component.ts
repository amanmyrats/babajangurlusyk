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
import { Unit } from '../models/unit.model';
import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-unit-form',
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
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.scss'
})
export class UnitFormComponent implements OnInit {

  unitForm: FormGroup;
  unit: Unit | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private unitService: UnitService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) {
    this.unitForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.unit = this.config.data.unit;
    if (this.unit) {
      this.unitForm.patchValue(this.unit);
    }
  }

  submitForm() {
    if (this.unitForm.valid) {
      if (this.unit) {
        console.log('Updating unit:', this.unitForm.value);
        // Update the unit
        this.unitService.updateUnit(this.unit?.id!, this.unitForm.value).subscribe({
          next: (unit: Unit) => {
            console.log('Unit updated:', unit);
            this.dialogRef.close(unit);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });

      }
      else {
        // Create a new unit
        console.log('Creating unit:', this.unitForm.value);
        this.unitService.createUnit(this.unitForm.value).subscribe({
          next: (unit: Unit) => {
            console.log('Unit created:', unit);
            this.dialogRef.close(unit);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.unitForm);
    }
  }

}
