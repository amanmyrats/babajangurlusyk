import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Message, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';

@Component({
  selector: 'app-user-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule, 
    MessagesModule
  ],
  providers: [
    MessageService,
    HttpErrorPrinterService, FormErrorPrinterService,
  ],
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss'
})
export class UserProfileFormComponent  implements OnInit {
  error_messages: Message[] = [];
  user: User = {};
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig, 
    private httpErrorPrinter: HttpErrorPrinterService,
    private formErrorPrinter: FormErrorPrinterService,

  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.config.data.user;
    this.profileForm.patchValue(this.user);
  }

  submitForm() {
    if (this.profileForm.valid) {
      this.userService.updateUser(this.user?.id!, this.profileForm.value).subscribe({
        next: (user: User) => {
          console.log('User updated:', user);
          this.dialogRef.close(user);
        },
        error: (error: any) => {
          this.httpErrorPrinter.printHttpError(error);
        }
      });
    } else {
      // Validate and display errors if necessary
      this.profileForm.markAllAsTouched();
      this.formErrorPrinter.printFormValidationErrors(this.profileForm);
    }
  }
}