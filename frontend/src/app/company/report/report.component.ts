import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RoleService } from '../../services/role.service';

interface DashboardData {
  jemiMusderi: number;
  jemiUssa: number;
  jemiHaryt: number;
  jemiSatys: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CardModule, CommonModule, 
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent  implements OnInit {

  dashboardData: DashboardData | undefined;

  constructor(
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    // Replace this with your logic to fetch data from your backend API
    this.dashboardData = {
      jemiMusderi: 123,
      jemiUssa: 45,
      jemiHaryt: 78,
      jemiSatys: 78
    };
  }

  hasPermission(role: string): boolean {
    return this.roleService.hasRole(role);
  }

}