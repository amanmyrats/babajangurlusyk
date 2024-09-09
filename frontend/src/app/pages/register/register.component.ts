import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {  DropdownModule } from 'primeng/dropdown';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    ReactiveFormsModule,
    DropdownModule, MessagesModule,
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService, MessageService, 
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  employeeForm: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private userService: UserService,
    private httpErrorPrinterService: HttpErrorPrinterService,
    private formErrorPrinterService: FormErrorPrinterService,
  ) { 

    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('RegisterComponent: ngOnInit()');
  }
  
  onRegister() {
    console.log(this.employeeForm.value)
    if (this.employeeForm.valid) {
      this.loading = true;
      this.userService.registerUser(this.employeeForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (error:any) => {
          console.error(error);
          this.loading = false;
          this.httpErrorPrinterService.printHttpError(error);
        }
      });
    } else {
      this.formErrorPrinterService.printFormValidationErrors(this.employeeForm);
    }
  }

  
  onGotoLogin(queryParams: any = {}) {
    this.router.navigate(['/login'], { queryParams });
  }

  onBackToMain() {
    // Redirect to main page
    console.log('Redirect to main page');
    this.router.navigate(['/']);
  }
  
}