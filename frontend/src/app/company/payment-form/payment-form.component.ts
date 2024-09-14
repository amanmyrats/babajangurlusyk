import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { CalendarModule } from 'primeng/calendar';
import { Payment } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Client } from '../models/client.model';
import { Supplier } from '../models/supplier.model';
import { ClientService } from '../services/client.service';
import { SupplierService } from '../services/supplier.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    PanelModule, 
    MessagesModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule, InputNumberModule, CalendarModule, 
    ButtonModule, FloatLabelModule, DropdownModule, CommonModule, 
    InputTextareaModule, 
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit{

  paymentForm: FormGroup;
  payment: Payment | null = null;
  clients: Client[] = [];
  suppliers: Supplier[] = [];
  paymentTypes: any[] = [];
  partnerTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private paymentService: PaymentService,
    private clientService: ClientService, 
    private supplierService: SupplierService, 
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) { 
    this.paymentForm = this.fb.group({
      id: [''],
      payment_type: ['', Validators.required],
      partner_type: ['', Validators.required],
      client: [''],
      supplier: [''],
      amount: [null, Validators.required],
      note: [''],
      date: [ new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit(): void {
    this.payment = this.config.data.payment;
    if (this.payment) {
      this.paymentForm.patchValue(this.payment);
    }
    this.getPaymentTypes();
    this.getPartnerTypes();
    this.getClients();
    this.getSuppliers();
  }

  submitForm() {
    if (this.paymentForm.valid) {
      if (this.payment) {
        console.log('Updating payment:', this.paymentForm.value);
        // Update the payment
        this.paymentService.updatePayment(this.payment?.id!, this.paymentForm.value).subscribe({
          next: (payment: Payment) => {
            console.log('Payment updated:', payment);
            this.dialogRef.close(payment);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
        
      }
      else {
        // Create a new payment
        console.log('Creating payment:', this.paymentForm.value);
        this.paymentService.createPayment(this.paymentForm.value).subscribe({
          next: (payment: Payment) => {
            console.log('Payment created:', payment);
            this.dialogRef.close(payment);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.paymentForm);
    }
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

  getPaymentTypes(): void {
    this.paymentTypes = this.paymentService.getPaymentTypes();
  }

  getPartnerTypes(): void {
    this.partnerTypes = this.paymentService.getPartnerTypes();
  }
}
