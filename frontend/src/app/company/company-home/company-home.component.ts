import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-company-home',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, 
    FooterComponent
  ],
  templateUrl: './company-home.component.html',
  styleUrl: './company-home.component.scss'
})
export class CompanyHomeComponent {

}
