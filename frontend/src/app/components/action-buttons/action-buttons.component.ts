import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [
    ButtonModule, CommonModule

  ],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss'
})
export class ActionButtonsComponent implements OnInit{
  @Input() wantEdit: boolean = false;
  @Input() wantDelete: boolean = false;
  @Input() editRole: string = 'orunbasar';
  @Input() deleteRole: string = 'orunbasar';
  @Input() obj: any;
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public roleService: RoleService,
  ) { }

  ngOnInit(): void {
  }

  onUpdate() {
    this.updateEmitter.emit(this.obj);
  }

  onDelete() {
    this.deleteEmitter.emit(this.obj.id);
  }

  hasPermission(roleName: string): boolean {
    return this.roleService.hasRole(roleName);
  }
}
