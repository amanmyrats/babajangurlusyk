import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CompanyHomeComponent } from './company/company-home/company-home.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'company',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: CompanyHomeComponent,
        loadChildren: () => import('./company/company-routing.module').then(m => m.CompanyRoutingModule)
    },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'login' }];
