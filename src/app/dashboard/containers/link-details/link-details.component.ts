import { CustomDropdownConfig } from './../../../partials/content/widgets/custom-dropdown/dropdown-config.model';
import { Link } from 'ngx-linkifyjs';
import { LayoutConfigService } from './../../../core/_base/layout/services/layout-config.service';
import { selectLinkById } from './../../store/selectors/link.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as fromStore from '../../store';
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from 'rxjs';
import { Link as LinkModel } from '../../models';
import { map, switchMap } from 'rxjs/operators';
import { LinksService } from '../../services/links.service.fake';
import { MatLinkPreviewService, LinkPreview } from '@angular-material-extensions/link-preview';

@Component({
  selector: 'kt-link-details',
  templateUrl: './link-details.component.html',
  styleUrls: ['./link-details.component.scss']
})
export class LinkDetailsComponent implements OnInit {

  // Subscriptions
  private subscriptions: Subscription[] = [];

  activityHistory = [
    {
      date: '25/05/19 - 10:19',
      color: 'success',
      userName: 'user1',
      description: 'created the short url'
    },
    {
      date: '26/05/19 - 13:46',
      color: 'primary',
      userName: 'charles',
      description: 'modified the destination url'
    },
    {
      date: '29/05/19 - 08:40',
      color: 'warning',
      userName: 'user1',
      description: 'has desactivated the short url'
    },
    {
      date: '03/05/19 - 11:01',
      color: 'danger',
      userName: 'user1',
      description: 'has deleted the short url'
    }
  ]

  url: LinkModel;
  urlPreview : LinkPreview;

 user = {
  "id":"5b1c078b-f348-431e-8f35-a41f78241ae1",
  "firstName":"Jose Luis",
  "lastName":"Castrillon",
  "email":"jlcastrillon@protonmail.com",
  "role":"admin",
  "accounts":[

  ],
  "state":"active",
  "createdAt":"2019-10-04T20:40:52.619Z",
  "updatedAt":"2019-10-04T20:40:52.619Z",
  "deletedAt":null
}

barchartOptions;
barchartData;
createdDropdownCfg: CustomDropdownConfig = {
  title: 'Today',
  items: [
    {
      label: this.linkService.getDateString(),
      value: this.linkService.getDateString()
    },
    {
      label: 'Value 1',
      value: 'Value 1'
    },
    {
      label: 'Value 2',
      value: 'Value 2'
    }
  ]
};

  constructor(
    private store: Store<fromStore.LinksFeatureState>,
    private layoutConfigService: LayoutConfigService,
    private route : ActivatedRoute,
    private linkService: LinksService,
    private matLinkPreviewService: MatLinkPreviewService) { }

  ngOnInit() {
    //hide sub header
    // this.layoutConfigService.setConfig({display: false}, true)


    const link$: Observable<LinkModel> = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => {
          return this.store.pipe(
            select(selectLinkById(id))
          )
        })
      )

      const sub = link$.subscribe((link) => {
        this.url = link;
        const sub1 = this.matLinkPreviewService.fetchLink(this.url.targetUrl)
        .subscribe(rest =>{
          this.urlPreview = rest
        });

        this.subscriptions.push(sub1)
      })

      this.subscriptions.push(sub)

    this.barchartData = {
      labels: [
        'Day 1',
        'Day 2',
        'Day 3',
        'Day 4',
        'Day 5',
        'Day 6',
        'Day 7',
        'Day 8',
        'Day 9',
        'Day 10',
        'Day 11',
        'Day 12',
        'Day 13',
        'Day 14',
        'Day 15',
        'Day 16'
      ],
      datasets: [
        {
          // label: 'dataset 1',
          backgroundColor: this.layoutConfigService.getConfig(
            'colors.state.success'
          ),
          data: [15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20]
        }

      ]
    };

    this.barchartOptions = {
      type: 'bar',
      data: this.barchartData,
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
        barRadius: 10,
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {sub.unsubscribe()})
  }

  detailsLink(){}

    /** UI */
  /**
   * Retursn CSS Class Name by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: 'active' | 'inactive'): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
    }
    return '';
  }



}
