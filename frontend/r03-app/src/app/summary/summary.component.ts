import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chartData: any = null;
  loading = true;
  error = '';
  private chart: any;

  constructor(
    private apiService: ApiService,
    private chartService: ChartService
  ) {}

  ngOnInit() {
    this.loadChartData();
  }

  ngAfterViewInit() {
    // Chart will be created after data loads
  }

  loadChartData() {
    this.loading = true;
    this.error = '';

    this.apiService.getSummaryChart().subscribe({
      next: (data) => {
        this.chartData = data;
        this.loading = false;
        setTimeout(() => this.createChart(), 100); // Small delay for view init
      },
      error: (err) => {
        this.error = 'Failed to load chart data. Please try again.';
        this.loading = false;
        console.error('Chart error:', err);
      }
    });
  }

  createChart() {
    if (!this.chartData || !this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = this.chartService.createBarChart(
      ctx,
      this.chartData.data,
      this.chartData.title
    );
  }

  downloadChart() {
    if (!this.chartCanvas) return;

    const link = document.createElement('a');
    link.download = 'catalyst-performance-chart.png';
    link.href = this.chartCanvas.nativeElement.toDataURL('image/png');
    link.click();
  }
}
