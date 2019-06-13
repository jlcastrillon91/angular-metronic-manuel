import { mergeMap, tap } from 'rxjs/operators';
// RxJS
import {
  delay,
  distinctUntilChanged,
  skip,
  filter,
  take,
  map
} from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../../core/_base/crud';
// State

import { LinksFeatureState } from '../reducers';
import * as fromSelectors from '../selectors/link.selectors';

export class LinksDataSource extends BaseDataSource {
  constructor(private store: Store<LinksFeatureState>) {
    super();

    this.loading$ = this.store.pipe(
      select(fromSelectors.selectLinksPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(fromSelectors.selectLinksShowInitWaitingMessage)
    );

    this.store
      .pipe(select(fromSelectors.selectLinksInStore))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
}
