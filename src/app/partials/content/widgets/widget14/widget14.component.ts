// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js';

@Component({
  selector: 'kt-widget14',
  templateUrl: './widget14.component.html',
  styleUrls: ['./widget14.component.scss']
})
export class Widget14Component implements OnInit {
  private defaultOptions: any;

  // Public properties
  @Input() title: string;
  @Input() desc: string;
  @Input() data: { labels: string[]; datasets: any[] };
  @ViewChild('chart') chart: ElementRef;
  @Input() options: any = this.defaultOptions;

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(private layoutConfigService: LayoutConfigService) {}

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.initDefaultOptions();

    if (!this.data) {
      this.data = {
        labels: [
          '35% France',
          '23% China',
          '13% India',
          '10% United States',
          '19% Others'
        ],
        datasets: [
          {
            // label: 'dataset 1',
            backgroundColor: [
              'rgb(113, 106, 202)',
              'rgb(52, 191, 163)',
              'rgb(255, 184, 34)',
              this.layoutConfigService.getConfig('colors.state.danger'),
              this.layoutConfigService.getConfig('colors.state.brand')
            ],
            data: [35, 23, 13, 10, 19]
          }
        ]
      };
    }

    this.initChartJS();
  }

  initDefaultOptions() {
    this.defaultOptions = {
      type: 'bar',
      data: this.data,
      options: {
        title: {
          display: false
        },
        tooltips: {
          intersect: false,
          mode: 'nearest',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        barRadius: 4,
        scales: {
          xAxes: [
            {
              display: false,
              gridLines: false,
              stacked: true
            }
          ],
          yAxes: [
            {
              display: false,
              stacked: true,
              gridLines: false
            }
          ]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    };
  }

  /** Init chart */
  initChartJS() {
    // For more information about the chartjs, visit this link
    // https://www.chartjs.org/docs/latest/getting-started/usage.html

    // const chart = new Chart(this.chart.nativeElement, {
    // 	type: 'bar',
    // 	data: this.data,
    // 	options: {
    // 		title: {
    // 			display: false,
    // 		},
    // 		tooltips: {
    // 			intersect: false,
    // 			mode: 'nearest',
    // 			xPadding: 10,
    // 			yPadding: 10,
    // 			caretPadding: 10
    // 		},
    // 		legend: {
    // 			display: false
    // 		},
    // 		responsive: true,
    // 		maintainAspectRatio: false,
    // 		barRadius: 4,
    // 		scales: {
    // 			xAxes: [{
    // 				display: false,
    // 				gridLines: false,
    // 				stacked: true
    // 			}],
    // 			yAxes: [{
    // 				display: false,
    // 				stacked: true,
    // 				gridLines: false
    // 			}]
    // 		},
    // 		layout: {
    // 			padding: {
    // 				left: 0,
    // 				right: 0,
    // 				top: 0,
    // 				bottom: 0
    // 			}
    // 		}
    // 	}
    // });
    console.log(this.options);
    if (this.options.type === 'doughnut') {
      const chart = new Chart(this.chart.nativeElement, {
        ...this.options,
        plugins: [
          {
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;
              ctx.restore();
              var fontSize = (height / 60).toFixed(2);
              ctx.font = fontSize + 'em sans-serif';
              ctx.textBaseline = 'middle';
              var text = '45',
                textX = Math.round(
                  (width - ctx.measureText(text).width) / 2 - 83
                ),
                textY = height / 2;
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
          }
        ]
      });
    } else {
      const chart = new Chart(this.chart.nativeElement, this.options);
    }
  }

  drawTotals(chart) {
    var width = chart.chart.width,
      height = chart.chart.height,
      ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + 'em sans-serif';
    ctx.textBaseline = 'middle';

    var text = chart.config.centerText.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
}
