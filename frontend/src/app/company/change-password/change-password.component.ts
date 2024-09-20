import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MessagesModule } from 'primeng/messages';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    PanelModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    CommonModule, 
    MessagesModule, PasswordModule, 
  ],
  providers: [MessageService],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent  implements OnInit {
  passwordForm: FormGroup;
  error_messages: Message[] = [];
  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService, 
    ) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, { validator: this.passwordConfirmationValidator });
  }

  ngOnInit(): void {
  }

  submitForm() {
    if (this.passwordForm.valid) {
      // Logic to handle form submission (e.g., send data to backend)
      console.log('Form submitted with values:', this.passwordForm.value);
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: response => {
          console.log('Password changed successfully');
          this.authService.logout();

          // create query params to pass to the login page in turkish
          const queryParams = {
            'lang': 'tr', 
            'msg': 'Şifreniz başarıyla değiştirildi. Lütfen tekrar giriş yapın.'
          };
          this.onGotoLogin(queryParams);

        }, 
        error: error => {
          console.error('Error changing password:', error);
          console.error(error)
          // show this error message to the user in the UI
          this.messageService.add({severity:'error', summary:'Error', detail: error.error.status});
        }
      });
      // Reset form after submission (optional)
      this.passwordForm.reset();
    }
  }

  passwordConfirmationValidator(control: AbstractControl) {
    const new_password = control.get('new_password');
    const confirm_password = control.get('confirm_password');
    if (new_password?.value !== confirm_password?.value) {
      confirm_password?.setErrors({ passwordMismatch: true });
    }
  }
  
  onGotoLogin(queryParams: any = {}) {
    // Redirect to main page
    console.log('Redirect to login page');
    // add queryparams to the route
    this.router.navigate(['/login'], { queryParams });
  }

}