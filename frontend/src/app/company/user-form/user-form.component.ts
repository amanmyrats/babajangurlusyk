import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { Message, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { DropdownModule } from 'primeng/dropdown';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { User } from '../../models/user.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FormErrorPrinterService } from '../../services/form-error-printer.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    PanelModule,
    FormsModule, 
    ReactiveFormsModule,
    MessagesModule, 
    ButtonModule, 
    InputTextModule, 
    DropdownModule
  ],
  providers: [
    HttpErrorPrinterService, 
    FormErrorPrinterService, 
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{
  
  userForm: FormGroup;
  user: User | null = null;
  roles: Role[] = [];
  error_messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private userService: UserService,
    private roleService: RoleService,
    private httpErrorPrinter: HttpErrorPrinterService, 
    private formErrorPrinter: FormErrorPrinterService,
  ) { 
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.user = this.config.data.user;
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  submitForm() {
    if (this.userForm.valid) {
      if (this.user) {
        console.log('Updating user:', this.userForm.value);
        this.userService.updateUser(this.user?.id!, this.userForm.value).subscribe({
          next: (user) => {
            console.log('User updated:', user);
            this.dialogRef.close(user);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      } else {
        this.userService.createUser(this.userForm.value).subscribe({
          next: (user) => {
            console.log('User created:', user);
            this.dialogRef.close(user);
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
    }
    } else {
      this.formErrorPrinter.printFormValidationErrors(this.userForm);
    }
  }

  getRoles(queryString: string = '') {
    this.roleService.getRoles(queryString).subscribe({
      next: (paginatedRoles: PaginatedResponse<Role>) => {
        this.roles = paginatedRoles.results!;
        console.log("Successfully fetched roles");
        console.log(paginatedRoles);
      },
      error: (error: any) => {
        console.log("Error happened when fetching roles.");
        console.log(error);
      }
    });
  }
}
