import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonService } from '../../services/common.service';
import { LazyLoadEvent } from 'primeng/api';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-filter-search',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    DropdownModule, 
    InputTextModule, 
    ButtonModule, 
    CalendarModule, 
    CommonModule, 
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './filter-search.component.html',
  styleUrl: './filter-search.component.scss'
})
export class FilterSearchComponent implements OnInit{
  date: Date = new Date();
  today: Date = new Date();

  @Input() wantClientFilter: boolean = false;
  @Input() wantSupplierFilter: boolean = false;
  @Input() wantCategoryFilter: boolean = false;
  @Input() wantRoleFilter: boolean = false;
  @Input() wantExpenseTypeFilter: boolean = false;
  @Input() wantPaymentTypeFilter: boolean = false;
  @Input() wantDateFilter: boolean = false;
  @Input() wantSearchFilter: boolean = true;
  
  @Input() clients: any[] = [];
  @Input() suppliers: any[] = [];  
  @Input() categories: any[] = [];  
  @Input() roles: any[] = [];
  @Input() expenseTypes: any[] = [];
  @Input() paymentTypes: any[] = [];
  @Input() filterTodayByDefault: boolean = false;
  
  // Pagination
  @Input() first: number = 0;
  @Input() rows: number = 2;
  @Input() totalRecords: number = 0;

  @Output() searchEmitter: EventEmitter<any> = new EventEmitter();
  @Output() getClientEmitter: EventEmitter<any> = new EventEmitter();
  @Output() getSupplierEmitter: EventEmitter<any> = new EventEmitter();
  @Output() getCategoryEmitter: EventEmitter<any> = new EventEmitter();
  
  filterSearchForm: FormGroup;
  event: LazyLoadEvent = {};



  selectedMusderi: any;
  selectedUssa: any;

  constructor(
    private fb: FormBuilder, 
    private commonService: CommonService, 
    private datePipe: DatePipe
  ){
    this.filterSearchForm = this.fb.group({
      client: [''],
      supplier: [''],
      category: [''],
      role: [''],
      expense_type: [''],
      search: [''], 
    });
  }
  ngOnInit(): void {
    this.event.rows = this.rows;
    this.checkActiveUrlQueryParamsAndPatchFormValuesWithQueryParams();
    this.getSupplierEmitter.emit();
    this.getClientEmitter.emit();
    this.getCategoryEmitter.emit();
    this.search();
    }

  onFilterChage(){
    // Reset page number to 1 when filter changes
    this.event.first = 0;
    this.first = 0;
    this.search();
  }

  onSubmit(){
    // Reset page number to 1 when filter changes
    this.event.first = 0;
    this.first = 0;
    this.search();
  }
  
  search(){
    console.log("Searching...");
    console.log(this.filterSearchForm.value);

    // Convert date to ISO 8601 format before sending data
    const selectedDate = this.filterSearchForm.get('date')?.value;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    if (formattedDate) {
      this.filterSearchForm.patchValue({ date: formattedDate });
    }
    this.event.filters = this.filterSearchForm.value;
    const queryString = this.commonService.buildPaginationParams(this.event)
    this.searchEmitter.emit(queryString);
    this.updateActiveUrlQueryParams(queryString);
  }

  getQueryParams(){
    return this.commonService.buildPaginationParams(this.event);
  }

  checkActiveUrlQueryParamsAndPatchFormValuesWithQueryParams(){
    const snaptshorUrl = window.location.href.split('?')[1];
    const urlSearchParams = new URLSearchParams(snaptshorUrl);

    urlSearchParams.forEach((value, key) => {
      if (this.filterSearchForm.controls[key]) {
            this.filterSearchForm.controls[key].patchValue(value);
          }
    } );
    if (this.filterTodayByDefault && !this.filterSearchForm.get('date')?.value) {
      this.filterSearchForm.patchValue({ date: new Date() });
    }
  }

  clearSearch(){
    this.filterSearchForm.reset();
    this.search();
  }

  updateActiveUrlQueryParams(queryString: string){
    window.history.replaceState({}, '', window.location.pathname + queryString);
  }

  clickCallBack(): void {
    console.log("Click callback");
  }

  nextDay() {
    const currentDate = this.filterSearchForm.get('date')?.value;
    if (currentDate) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);  // Increment by one day
      this.date = nextDate;
      this.filterSearchForm.patchValue({ date: this.date });
    }
  }

  prevDay() {
    const currentDate = this.filterSearchForm.get('date')?.value;
    if (currentDate) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);  // Decrement by one day
      this.date = prevDate;
      this.filterSearchForm.patchValue({ date: this.date });
    }
  }

}
