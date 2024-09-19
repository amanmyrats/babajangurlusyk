import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ActiveRouteService } from '../../services/active-route.service';
import { Router } from '@angular/router';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    standalone: true,
    imports: [
        MenubarModule,
        BadgeModule,
        AvatarModule,
        InputTextModule,
        RippleModule,
        CommonModule,
        OverlayPanelModule,
        ButtonModule,
        MenuModule,
    ]
})
export class NavbarComponent implements OnInit {

    @ViewChild('op') op: OverlayPanel | null = null;

    items: MenuItem[] | undefined;
    userMenuItems: MenuItem[] | undefined;
    activeRoute: string = '';
    logoPath: string = '';
    firstName: string = '';

    constructor(
        private activeRouteService: ActiveRouteService,
        private router: Router,
        private roleService: RoleService, 
    ) { }

    ngOnInit() {
        this.getFirstName();

        this.logoPath = 'assets/images/logo_transparent.png';
        const roleName = localStorage.getItem('roleName');
        console.log('this.roleService.hasRole(isSuperUser)', this.roleService.hasRole('isSuperUser'));
        if (this.roleService.hasRole('isSuperUser') || 
        this.roleService.hasRole('baslyk') || this.roleService.hasRole('admin')) {
            this.setSuperAdminMenu();
        } else if (roleName === 'orunbasar') {
            this.setOrunbasarMenu();
        } else if (roleName === 'isgar') {
            this.setIsgarMenu();
        }

        this.setUserMenu();

        this.activeRouteService.activeRoute$.subscribe(route => {
            this.activeRoute = route;
        });

    }

    onMenuItemClick(linkAddress: string) {
        (this.op ?? { hide: () => { } }).hide();
        this.router.navigateByUrl(linkAddress);
    }

    getFirstName(): void {
        this.firstName = localStorage?.getItem('firstName')!;
    }

    private setSuperAdminMenu() {
        this.items = [
            {
                label: 'Babajan Gurluşyk',
                icon: 'pi pi-home',
                routerLink: '/company',
            },
            {
                label: 'Harytlar',
                icon: 'pi pi-car',
                routerLink: '/company/products',
            },
            {
                label: 'Çekler',
                icon: 'pi pi-address-book',
                routerLink: '/company/ceks',
            },
            {
                label: 'Tölegler',
                icon: 'pi pi-address-book',
                routerLink: '/company/payments',
            },
            {
                label: 'Çykdajylar',
                icon: 'pi pi-address-book',
                routerLink: '/company/expenses',
            },
            {
                label: 'Müşderiler',
                icon: 'pi pi-address-book',
                routerLink: '/company/clients',
                routerLinkActive: 'active-menu-item'
            },
            {
                label: 'Telekeçiler',
                icon: 'pi pi-address-book',
                routerLink: '/company/suppliers',
            },
            {
                label: 'Başlyk Menu',
                icon: 'pi pi-user-edit',
                items: [
                    {
                        label: 'Işgärler',
                        icon: 'pi pi-pencil',
                        routerLink: '/company/users'
                    },
                    {
                        label: 'Çykdajy Görnüşleri',
                        icon: 'pi pi-pencil',
                        routerLink: '/company/expensetypes'
                    },
                    {
                        label: 'Pul Birlikleri',
                        icon: 'pi pi-pencil',
                        routerLink: '/company/currencies'
                    },
                    {
                        separator: true
                    },
                ]
            },
        ];
    }

    private setOrunbasarMenu() {
        this.items = [
            {
                label: 'Babajan Gurluşyk',
                icon: 'pi pi-home',
                routerLink: '/company',
            },
            {
                label: 'Harytlar',
                icon: 'pi pi-car',
                routerLink: '/company/products',
            },
            {
                label: 'Çekler',
                icon: 'pi pi-address-book',
                routerLink: '/company/ceks',
            },
            {
                label: 'Tölegler',
                icon: 'pi pi-address-book',
                routerLink: '/company/payments',
            },
            {
                label: 'Çykdajylar',
                icon: 'pi pi-address-book',
                routerLink: '/company/expenses',
            },
            {
                label: 'Müşderiler',
                icon: 'pi pi-address-book',
                routerLink: '/company/clients',
            },
            {
                label: 'Telekeçiler',
                icon: 'pi pi-address-book',
                routerLink: '/company/suppliers',
            },
        ];
    }

    private setIsgarMenu() {
        this.items = [
            {
                label: 'Babajan Gurluşyk',
                icon: 'pi pi-home',
                routerLink: '/company',
            },
            {
                label: 'Harytlar',
                icon: 'pi pi-car',
                routerLink: '/company/products',
            },
        ];
    }

    private setUserMenu() {
        this.userMenuItems = [
            {
                label: 'Şahsy Maglumatlar',
                icon: 'pi pi-user',
                command: () => this.onMenuItemClick('/company/users/profile')

            },
            {
                label: 'Parol Täzele',
                icon: 'pi pi-key',
                command: () => this.onMenuItemClick('/company/users/changepassword')
            },
            {
                label: 'Çykyş',
                icon: 'pi pi-sign-out',
                command: () => this.onMenuItemClick('/logout')
            },
        ];
    }

}