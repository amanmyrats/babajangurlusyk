import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { HttpErrorPrinterService } from '../../services/http-error-printer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedToolbarComponent } from '../../components/shared-toolbar/shared-toolbar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { SharedPaginatorComponent } from '../../components/shared-paginator/shared-paginator.component';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableModule, 
    ToastModule, 
    ToolbarModule, 
    ButtonModule, 
    SplitButtonModule, 
    InputTextModule, 
    ActionButtonsComponent,
    SharedToolbarComponent, 
    ConfirmDialogModule, 
    FilterSearchComponent, SharedPaginatorComponent, 
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    HttpErrorPrinterService,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  
  // Pagination
  @ViewChild(FilterSearchComponent) filterSearch!: FilterSearchComponent;
  first: number = 0;
  rows: number = 2;
  totalRecords: number = 0;

  loading: boolean = false;
  users: User[] = [];
  roles: Role[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpErrorPrinter: HttpErrorPrinterService
  ){}

  ngOnInit(): void {
    this.rows = env.pagination.defaultPageSize;
    this.getUsers();
    this.getRoles();
  }

  getUsers(queryString: string = ''){
    this.loading = true;
    this.userService.getUsers(queryString).subscribe({
      next: (paginatedUsers: PaginatedResponse<User>) => {
        this.users = paginatedUsers.results!;
        this.totalRecords = paginatedUsers.count!;
        console.log("Successfully fetched users");
        console.log(paginatedUsers);
        this.loading = false;
      },
      error: (error: any) => {
        console.log("Error happened when fetching users.");
        console.log(error);
        this.loading = false;
      }
    })
  }

  getRoles(queryString: string = ''){
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
    })
  }

  updateObj(user: User) {
    this.showForm(user);
  }

  createObj() {
    this.showForm();
  }

  deleteObj(id: string) {
    this.confirmationService.confirm({
      message: 'Anyk pozmak isleýärsiňizmi?',
      header: 'Pozmak',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Poz",
      rejectLabel: "Goýbolsun et",
      dismissableMask: true,

      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: (res: any) => {
            this.messageService.add(
              { severity: 'success', summary: 'Üstünlikli', detail: 'Üstünlikli pozuldy!' });
            this.getUsers();
          },
          error: (err: HttpErrorResponse) => {
            this.httpErrorPrinter.printHttpError(err);
          }
        });
      }
    });

  }

  showForm(objToEdit: User | null = null) {
    this.ref = this.dialogService.open(UserFormComponent, {
      header: 'Kullanıcı Ekle/Düzenle',
      styleClass: 'fit-content-dialog',
      contentStyle: { "overflow": "auto" },
      data: {
        user: objToEdit
      },
      draggable: true,
      resizable: true
    });

    this.ref.onClose.subscribe((user: User) => {
      if (user) {
        if (objToEdit) {
          this.messageService.add(
            { severity: 'success', summary: 'Success', detail: 'User updated successfully' });
        } else {
          this.messageService.add(
            { severity: 'success', summary: 'Success', detail: 'User added successfully' });
        }
        this.getUsers();
      }
    });
  }

  search(queryString: string = ''): void {
    this.getUsers(queryString);
  }

  onPageChange(event: any): void {
    this.filterSearch.event.first = event.first;
    this.filterSearch.event.rows = event.rows;
    this.filterSearch.search();
  }

}
