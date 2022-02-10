import { Component, Input, OnInit } from "@angular/core";
import { LegendPosition } from "@swimlane/ngx-charts";

@Component({
    selector: 'deals-spread',
    template: `
    <section class="deals-spread">
      <h3 class="deals-spread__title"> Spread by deals count </h3>
      <ngx-charts-pie-chart
          [view]="view"
          [results]="data"
          [gradient]="gradient"
          [legend]="showLegend"
          [legendPosition]="legendPosition"
          [labels]="showLabels"
          [doughnut]="isDoughnut"
          (select)="onSelect($event)"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
          >
      </ngx-charts-pie-chart>
    </section>
    `,
    styles: [':host { display: flex }']
})
export class ChartDealsSpread implements OnInit {
    constructor() {}

    ngOnInit(): void {
    }

    private _data: any = [];
    @Input() set data(data: any[]) {
        if (!data) return;

        const dealsByPair = data.reduce((acc, deal) => {
            const { pair } = deal;
            console.log('deal', deal);

            return {
                ...acc,
                [pair]: acc[pair] ? acc[pair] + 1 : 1
            };
        }, {});

        const result = Object.entries(dealsByPair)
          .map(([key, value]) => ({name: key, value}))
          .sort((a: any, b: any) => b.value - a.value);


        this._data = result;
    }
    get data() { return this._data; }

    // chart configs START
    view: any = [ 300, 300 ];
    gradient: boolean = true;
    showLegend: boolean = false;
    showLabels: boolean = false;
    isDoughnut: boolean = false;
    legendPosition: LegendPosition = LegendPosition.Right;
    scheme: any = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
    // chart configs END


    onSelect(data: any): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
    
    onActivate(data: any): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
    
    onDeactivate(data: any): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
}
