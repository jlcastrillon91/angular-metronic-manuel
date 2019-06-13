// Angular
import { Component, Input, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';

export interface Widget1Data {
  title: string;
  desc: string;
  value: string;
  valueClass?: string;
}

@Component({
  selector: 'kt-widget1',
  templateUrl: './widget1.component.html',
  styleUrls: ['./widget1.component.scss']
})
export class Widget1Component implements OnInit {
  // Public properties
  @Input() data: Widget1Data[];

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    if (!this.data) {
      this.data = [
        {
          title: 'Total Hits',
          desc: 'Weekly Customer Orders',
          value: '370K',
          valueClass: 'kt-font-brand'
        },
        {
          title: 'Unique Visitors',
          desc: 'Awerage Weekly Profit',
          value: '167K',
          valueClass: 'kt-font-danger'
        },
        {
          title: 'Active Links',
          desc: 'System bugs and issues',
          value: '392',
          valueClass: 'kt-font-success'
        }
      ];
    }
  }
}
