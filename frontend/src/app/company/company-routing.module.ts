import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExpenseListComponent } from './expense-list/expense-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { ReportComponent } from './report/report.component';
import { RoleGuard } from '../guards/role.guard';
import { ProductListComponent } from './product-list/product-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { ClientListComponent } from './client-list/client-list.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';

const routes: Routes = [
  { path: '', component: ReportComponent },
  {
    path: 'products', canActivate: [RoleGuard], component: ProductListComponent,
    data: {
      roles: ['isgar']
    }
  },
  {
    path: 'payments', canActivate: [RoleGuard], component: PaymentListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'clients', canActivate: [RoleGuard], component: ClientListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'suppliers', canActivate: [RoleGuard], component: SupplierListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'expenses', canActivate: [RoleGuard], component: ExpenseListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'currencies', canActivate: [RoleGuard], component: CurrencyListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'expensetypes', canActivate: [RoleGuard], component: ExpenseTypeListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  {
    path: 'users', canActivate: [RoleGuard], component: UserListComponent,
    data: {
      roles: ['orunbasar']
    }
  },
  { path: 'users/profile', component: UserDetailComponent },
  { path: 'users/changepassword', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use ForChild for lazy loading
  exports: [RouterModule]
})
export class CompanyRoutingModule { }