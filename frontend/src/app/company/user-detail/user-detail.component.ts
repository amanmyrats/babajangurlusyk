import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { UserProfileFormComponent } from '../user-profile-form/user-profile-form.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    AvatarModule, 
    ButtonModule, 
    FormsModule,
    PanelModule,
    InputTextModule, 
    UserProfileFormComponent, 
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService, 
    DialogService, 
    MessageService,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent  implements OnInit {

  profileFormRef: DynamicDialogRef | undefined;

  userId: string = '';
  user: User = {};
  constructor(
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    public dialogService: DialogService, 
    public messageService: MessageService
  ) { }

  ngOnInit() {
    console.log('userId:', this.userId)
    this.userId = this.getUserIdFromAccessToken();
    console.log('userId:', this.userId)
    this.getUser();
  }

  getUser(): any {
    this.userService.getUser(this.userId).subscribe({
      next: (user: User) => {
        console.log('User loaded:', user);
        this.user = user;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
      }
    });
  }

  saveChanges() {
    // Implement save functionality here
    console.log('Saving changes...', this.user);
    // Example: You might want to send an HTTP request to save changes to backend
  }

  getUserIdFromAccessToken(): string {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken['user_id'];
      return userId;
    } else {
      return '';
    }
  }

  showProfileForm() {
    this.profileFormRef = this.dialogService.open(UserProfileFormComponent, {
        header: 'Şahsy maglumatlaryňyzy täzeläň',
        width: '70%',
        height: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          user: this.user
      },
    });

    this.profileFormRef.onClose.subscribe((user: User) => {
        if (user) {
            this.messageService.add({ severity: 'info', summary: 'Üstünlikli täzelendi!', detail: user.first_name + ' ' + user.last_name});
            this.user = user;
            console.log('User updated:', user);
        }
    });
}

}