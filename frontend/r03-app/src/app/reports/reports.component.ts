import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chartData: any = null;
  loading = true;
  error = '';
  private chart: any;

  // Add Math to component for template access
  Math = Math;

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

    this.apiService.getReportsChart().subscribe({
      next: (data) => {
        this.chartData = data;
        this.loading = false;
        setTimeout(() => this.createChart(), 100);
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
    this.chart = this.chartService.createLineChart(
      ctx,
      this.chartData.data,
      this.chartData.title
    );
  }

  downloadChart() {
    if (!this.chartCanvas) return;

    const link = document.createElement('a');
    link.download = 'temperature-efficiency-chart.png';
    link.href = this.chartCanvas.nativeElement.toDataURL('image/png');
    link.click();
  }

  // Helper method to get max value from array
  getMaxValue(data: number[]): number {
    if (!data || data.length === 0) return 0;
    return Math.max(...data);
  }

  // Helper method to get index of max value
  getMaxIndex(data: number[]): number {
    if (!data || data.length === 0) return 0;
    const maxValue = this.getMaxValue(data);
    return data.indexOf(maxValue);
  }

  // Helper method to get temperature at max efficiency
  getTempAtMax(data: number[]): string {
    if (!this.chartData?.data?.labels) return '';
    const maxIndex = this.getMaxIndex(data);
    return this.chartData.data.labels[maxIndex] || '';
  }

  // Get max efficiency from all datasets
  getMaxEfficiency(): number {
    if (!this.chartData?.data?.datasets) return 0;

    let max = 0;
    for (const dataset of this.chartData.data.datasets) {
      const datasetMax = this.getMaxValue(dataset.data);
      if (datasetMax > max) max = datasetMax;
    }
    return max;
  }

  // Get optimal temperature for KIER catalyst
  getOptimalTemperature(): string {
    if (!this.chartData?.data?.datasets) return '';

    const kierDataset = this.chartData.data.datasets.find((d: any) =>
      d.label.includes('KIER')
    );

    if (!kierDataset) return '';
    return this.getTempAtMax(kierDataset.data);
  }

  // Toggle dataset visibility
  toggleDataset(index: number) {
    if (this.chart) {
      const meta = this.chart.getDatasetMeta(index);
      meta.hidden = meta.hidden === null ? !this.chart.data.datasets[index].hidden : null;
      this.chart.update();
    }
  }

  // Export data as JSON
  exportJSON() {
    if (!this.chartData) return;

    const dataStr = JSON.stringify(this.chartData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `temperature-efficiency-data-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Export data as CSV
  exportCSV() {
    if (!this.chartData) return;

    let csvContent = 'Temperature,' + this.chartData.data.datasets.map((d: any) => d.label).join(',') + '\n';

    for (let i = 0; i < this.chartData.data.labels.length; i++) {
      const row = [
        this.chartData.data.labels[i],
        ...this.chartData.data.datasets.map((d: any) => d.data[i])
      ];
      csvContent += row.join(',') + '\n';
    }

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `temperature-efficiency-data-${new Date().toISOString().split('T')[0]}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Get today's date for display
  get today(): Date {
    return new Date();
  }
}
