import { Injectable } from '@angular/core';
import { collection, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { CollectionReference, getDocs } from '@firebase/firestore';
import { startOfDay, startOfWeek, startOfMonth, subMonths, endOfMonth } from 'date-fns';
import { Sale } from '../../core/models/sale';
import { getArrayDaysOfMonth, getNameOfMonth } from '../../core/core-util';
import { ChartData } from '../../shared/models/chart-data';

const PATH = 'sales';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  private getStartOfToday(): Date {
    return startOfDay(new Date());
  }

  private getStartOfWeek(): Date {
    return startOfWeek(new Date(), { weekStartsOn: 1 }); // lunes
  }

  private getStartOfMonth(): Date {
    const now = new Date();
    return startOfMonth(now);
  }

  getSalesFrom(date: Date, username: string) {
    const dateTimestamp = Timestamp.fromDate(date);

    if (username === 'ALL') {
      return getDocs(query(this._collection, where('saleDate', '>=', dateTimestamp)));
    } else {
      const q = query(
        this._collection,
        where('saleDate', '>=', dateTimestamp),
        where('createdBy', '==', username)
      );

      return getDocs(q);
    }
  }

  async getSalesStats(username: string): Promise<{
    day: { count: number; total: number },
    week: { count: number; total: number },
    month: { count: number; total: number }
  }> {
    console.log('Get Stats');
    const [daySnap, weekSnap, monthSnap] = await Promise.all([
      this.getSalesFrom(this.getStartOfToday(), username),
      this.getSalesFrom(this.getStartOfWeek(), username),
      this.getSalesFrom(this.getStartOfMonth(), username),
    ]);

    const calcStats = (snap: any) => {
      let total = 0;
      snap.forEach((doc: any) => {
        const data = doc.data();
        total += data.total ?? 0;
      });
      return { count: snap.size, total };
    };

    return {
      day: calcStats(daySnap),
      week: calcStats(weekSnap),
      month: calcStats(monthSnap),
    };
  }

  async getDailySalesOfCurrentMonth(username: string): Promise<ChartData[]> {
    console.log('Get Daily Sales of Current Month');
    const date = this.getStartOfMonth()
    const snap = await this.getSalesFrom(date, username);

    const salesByDay = getArrayDaysOfMonth(date);
    const countSalesByDay = getArrayDaysOfMonth(date);


    snap.forEach(doc => {
      const data = doc.data() as Sale;
      const saleDate: Date = (data.saleDate as Timestamp).toDate();
      const total = data.total ?? 0;

      if (saleDate) {
        const day = saleDate.getDate().toString().padStart(2, '0'); // '01', '02', ...
        salesByDay[day] = (salesByDay[day] || 0) + total;
        countSalesByDay[day] = (countSalesByDay[day] || 0) + 1;
      }
    });

    const labels = Object.keys(salesByDay).sort((a, b) => +a - +b);
    const data = labels.map(day => salesByDay[day]);

    const countLabels = Object.keys(countSalesByDay).sort((a, b) => +a - +b);
    const countData = countLabels.map(day => countSalesByDay[day]);

    const nameMonth = getNameOfMonth(date);

    const chartDataSales: ChartData = {
      title: 'Importe de Ventas de ' + nameMonth + ' (S/)',
      labels,
      data
    };

    const chartDataCountSales: ChartData = {
      title: 'Cantidad de Ventas de ' + nameMonth,
      labels: countLabels,
      data: countData
    };

    return [chartDataSales, chartDataCountSales];
  }

  async getMonthlySalesOfLastSixMonths(username: string): Promise<ChartData[]> {
    const today = new Date();
    const chartLabels: string[] = [];
    const chartTotals: number[] = [];
    const chartCounts: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      var q;
      if (username === 'ALL') {
        q = query(
          this._collection,
          where('saleDate', '>=', Timestamp.fromDate(start)),
          where('saleDate', '<=', Timestamp.fromDate(end))
        );
      } else {
        q = query(
          this._collection,
          where('saleDate', '>=', Timestamp.fromDate(start)),
          where('saleDate', '<=', Timestamp.fromDate(end)),
          where('createdBy', '==', username)
        );
      }

      const snap = await getDocs(q);

      let total = 0;
      let count = 0;

      snap.forEach(doc => {
        const data = doc.data() as Sale;
        total += data.total ?? 0;
        count++;
      });

      chartLabels.push(getNameOfMonth(monthDate));
      chartTotals.push(total);
      chartCounts.push(count);
    }

    const chartDataSales: ChartData = {
      title: 'Importe de Ventas de los Últimos 6 Meses (S/)',
      labels: chartLabels,
      data: chartTotals
    };

    const chartDataCountSales: ChartData = {
      title: 'Cantidad de Ventas de los Últimos 6 Meses',
      labels: chartLabels,
      data: chartCounts
    };

    console.log('chartDataSales', chartDataSales);
    console.log('chartDataCountSales', chartDataCountSales);

    return [chartDataSales, chartDataCountSales];
  }
}

