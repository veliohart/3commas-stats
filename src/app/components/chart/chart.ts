import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

@Component({
    selector: 'chart-wrapper',
    template: `
        <canvas #chart></canvas>
    `,
    styleUrls: ['./chart.scss']
})
export class ChartComponent implements AfterViewInit {
    constructor() {
        
    }

    ngAfterViewInit() {
        this.createChart();
    }

    @ViewChild('chart', { read: ElementRef, static: true }) chartRef: ElementRef | null = null;

    chart: Chart | null = null;

    createChart() {
        const container = this.chartRef?.nativeElement;
        const labels = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
        ];
        const data = {
            labels: labels,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        };
        this.chart = new Chart(container, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
            }
        });
    }
}