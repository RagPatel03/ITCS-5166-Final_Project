import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() {
    Chart.register(...registerables);
  }

  createBarChart(ctx: CanvasRenderingContext2D, data: any, title: string): Chart {
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.datasets[0].label,
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: data.datasets[0].label
            }
          },
          x: {
            title: {
              display: true,
              text: 'Catalyst Type'
            }
          }
        }
      }
    };

    return new Chart(ctx, config);
  }

  createLineChart(ctx: CanvasRenderingContext2D, data: any, title: string): Chart {
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.borderColor,
          fill: dataset.fill || false,
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'CO Yield (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          }
        }
      }
    };

    return new Chart(ctx, config);
  }
}
