import { ChartData } from './../../shared/models/chart-data';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { SettingsService } from '../../core/settings/settings.service';
import { User } from '../../core/models/user';
import { DashboardService } from './dashboard.service';
import { changeColorsOpacity, generateRandomColors } from '../../core/core-util';
import { Chart } from '../../shared/models/chart';
import { UserRolEnum } from '../../core/enums/user-rol.enum';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit {
  saleStats: {
    day: { count: number, total: number },
    week: { count: number, total: number },
    month: { count: number, total: number }
  } | null = null;

  dailySales: Chart = { data: {}, options: {} };

  dailyCountSales: Chart = { data: {}, options: {} };

  monthlySales: Chart = { data: {}, options: {} };

  monthlyCountSales: Chart = { data: {}, options: {} };

  pastelData: any;
  pastelOptions: any;

  data: any;
  options: any;

  multiData: any;
  multiOptions: any;

  userInfo: User | null = null

  constructor(
    private _breadcrumService: BreadcrumbService,
    private _settings: SettingsService,
    private _dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.initializeBreadcrumb()

    this.userInfo = this._settings.getUserInfo()
    let username = this.userInfo?.username || ''
    if(this.userInfo?.role === UserRolEnum.ADMINISTRADOR) {
      username = "ALL"
    }

    this.getSalesStats(username)
    this.getDailySalesOfCurrentMonth(username)
    this.getMonthlySalesOfLastSixMonths(username)
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs([]);
  }

  getSalesStats(username: string) {
    this._settings.showSpinner()
    this._dashboardService.getSalesStats(username)
    .then((stats) => {
      this.saleStats = stats;
      this._settings.hideSpinner()
    }, (error) => {
      console.error('Error fetching sales stats:', error);
      this._settings.hideSpinner()
    });
  }

  getDailySalesOfCurrentMonth(username: string) {
    this._settings.showSpinner()
    this._dashboardService.getDailySalesOfCurrentMonth(username)
    .then((chartData) => {
      this.initDailySalesChart(chartData[0])
      this.initDailyCountSalesChart(chartData[1])
      this._settings.hideSpinner()
    }, (error) => {
      console.error('Error fetching daily sales:', error);
      this._settings.hideSpinner()
    });
  }

  getMonthlySalesOfLastSixMonths(username: string) {
    this._settings.showSpinner()
    this._dashboardService.getMonthlySalesOfLastSixMonths(username)
    .then((chartData) => {
      this.initMonthlySalesOfLastSixMonthsChart(chartData[0])
      this.initMonthlyCountSalesOfLastSixMonthsChart(chartData[1])
      this._settings.hideSpinner()
    }, (error) => {
      console.error('Error fetching last six months sales:', error);
      this._settings.hideSpinner()
    });
  }

  initDailyCountSalesChart(chartData: ChartData) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.dailyCountSales.data = {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.title,
          data: chartData.data,
          backgroundColor: ['rgba(0, 168, 0, 0.2)'],
          borderColor: ['rgba(0, 168, 0, 1)'],
          borderWidth: 1,
        },
      ],
    };

    this.dailyCountSales.options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
              color: textColorSecondary,
          },
          grid: {
              color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  initDailySalesChart(chartData: ChartData) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.dailySales.data = {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.title,
          data: chartData.data,
          backgroundColor: ['rgba(71, 173, 255, 0.2)'],
          borderColor: ['rgba(71, 173, 255, 1)'],
          borderWidth: 1,
        },
      ],
    };

    this.dailySales.options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
              color: textColorSecondary,
          },
          grid: {
              color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  initMonthlyCountSalesOfLastSixMonthsChart(chartData: ChartData) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.monthlyCountSales.data = {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.title,
          data: chartData.data,
          backgroundColor: ['rgba(0, 168, 0, 0.2)'],
          borderColor: ['rgba(0, 168, 0, 1)'],
          borderWidth: 1,
        },
      ],
    };

    this.monthlyCountSales.options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
              color: textColorSecondary,
          },
          grid: {
              color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  initMonthlySalesOfLastSixMonthsChart(chartData: ChartData) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.monthlySales.data = {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.title,
          data: chartData.data,
          backgroundColor: ['rgba(71, 173, 255, 0.2)'],
          borderColor: ['rgba(71, 173, 255, 1)'],
          borderWidth: 1,
        },
      ],
    };

    this.monthlySales.options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
              color: textColorSecondary,
          },
          grid: {
              color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
