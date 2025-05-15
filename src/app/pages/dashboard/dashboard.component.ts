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
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.userInfo =this._settings.getUserInfo()
    this.getSalesStats()
    this.getDailySalesOfCurrentMonth()
    this.getMonthlySalesOfLastSixMonths()

    /*this.initPastelChart()
    this.initChart()
    this.initMultiChart()*/
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs([]);
  }

  getSalesStats() {
    this._settings.showSpinner()
    this._dashboardService.getSalesStats()
    .then((stats) => {
      this.saleStats = stats;
      this._settings.hideSpinner()
    }, (error) => {
      console.error('Error fetching sales stats:', error);
      this._settings.hideSpinner()
    });
  }

  getDailySalesOfCurrentMonth() {
    this._settings.showSpinner()
    this._dashboardService.getDailySalesOfCurrentMonth()
    .then((chartData) => {
      this.initDailySalesChart(chartData[0])
      this.initDailyCountSalesChart(chartData[1])
      this._settings.hideSpinner()
    }, (error) => {
      console.error('Error fetching daily sales:', error);
      this._settings.hideSpinner()
    });
  }

  getMonthlySalesOfLastSixMonths() {
    this._settings.showSpinner()
    this._dashboardService.getMonthlySalesOfLastSixMonths()
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

  initPastelChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.pastelData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
        }
      ]
    };

    this.pastelOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: 'My Second dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86, 27, 90]
          }
        ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  initMultiChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.multiData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'bar',
          label: 'Dataset 1',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: [50, 25, 12, 48, 90, 76, 42]
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: [21, 84, 24, 75, 37, 65, 34]
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
          data: [41, 52, 24, 74, 23, 21, 32]
        }
      ]
    };

    this.multiOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
