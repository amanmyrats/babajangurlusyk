import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-toolbar',
  standalone: true,
  imports: [
    ToolbarModule, 
    ButtonModule, 
    SplitButtonModule,
    InputTextModule, CommonModule, 
  ],
  templateUrl: './shared-toolbar.component.html',
  styleUrl: './shared-toolbar.component.scss'
})
export class SharedToolbarComponent implements OnInit {
  @Input() createRole: string = 'no_role';
  @Output() createEmitter: EventEmitter<any> = new EventEmitter();
  @Output() searchEmitter: EventEmitter<any> = new EventEmitter();
  @Output() exportEmitter: EventEmitter<any> = new EventEmitter();
  @Output() importEmitter: EventEmitter<any> = new EventEmitter();

  items: MenuItem[] | undefined;

  constructor(
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Update',
          icon: 'pi pi-refresh'
      },
      {
          label: 'Delete',
          icon: 'pi pi-times'
      }
  ];
  }

  create(): void {
    this.createEmitter.emit();
  }

  search(): void {
    this.searchEmitter.emit();
  }

  export(): void {
    this.exportEmitter.emit();
  }

  import(): void {
    this.importEmitter.emit();
  }

  hasPermission(roleName: string): boolean {
    return this.roleService.hasRole(roleName);
  }
}
