import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule, MessagesModule, CommonModule,
  ],
  providers: [
    HttpErrorPrinterService, FormErrorPrinterService,
    MessageService,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  queryParams: any = null;
  messages: Message[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private httpErrorPrinterService: HttpErrorPrinterService,
    private formErrorPrinterService: FormErrorPrinterService,
    private messageService: MessageService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      // Redirect to company page
      console.log('Redirect to company page');
      this.router.navigate(['/company']);
    }
    this.getQueryParams();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value
      ).subscribe({
        next: (success) => {
          if (success) {
            console.log(success)
            // Redirect to company page
            console.log('Redirect to company page');
            this.router.navigate(['/company']);
            this.loading = false;
          } else {
            // Show error message
            console.log('Login failed');
            this.loading = false;
          }
        },
        error: (error) => {
          console.log('Login failed');
          this.loading = false;
          this.httpErrorPrinterService.printHttpError(error);
        }
      });
    } else {
      // Show error message
      console.log('Invalid form');
      this.formErrorPrinterService.printFormValidationErrors(this.loginForm);
    }
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onBackToMain() {
    this.router.navigate(['/']);
  }

  onGoToPasswordReset() {
    console.log('Redirect to password reset page');
    this.router.navigate(['/passwordreset']);
  }

  getQueryParams() {
    this.queryParams = this.router.parseUrl(this.router.url).queryParams;
    if (this.queryParams.msg) {
      this.messages = [{ severity: 'success', detail: this.queryParams.msg }];
    }
  }
}
