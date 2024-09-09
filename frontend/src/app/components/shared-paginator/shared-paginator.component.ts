import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-shared-paginator',
  standalone: true,
  imports: [ PaginatorModule, ],
  templateUrl: './shared-paginator.component.html',
  styleUrl: './shared-paginator.component.scss'
})
export class SharedPaginatorComponent implements OnInit{
  
  @Input() first: number = 0;
  @Input() rows: number = env.pagination.defaultPageSize;
  @Input() totalRecords: number = 0;

  @Output() onPageChangeEmitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onPageChange(event: any): void {
    this.onPageChangeEmitter.emit(event);
  }
}
