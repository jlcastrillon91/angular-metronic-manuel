import { forkJoin } from 'rxjs';
// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, delay } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../../core/_base/crud';
// State
import { AppState } from '../../../core/reducers';
// Actions
import {
  LinkActionTypes,
  LinksPageRequested,
  LinksPageLoaded,
  ManyLinksDeleted,
  OneLinkDeleted,
  LinkActionToggleLoading,
  LinksPageToggleLoading,
  LinkUpdated,
  LinkCreated,
  LinkOnServerCreated
} from '../actions/link.actions';

import { of } from 'rxjs';
import { LinksService } from '../../services/links.service.fake';

@Injectable()
export class LinkEffects {
  showPageLoadingDistpatcher = new LinksPageToggleLoading({ isLoading: true });
  showActionLoadingDistpatcher = new LinkActionToggleLoading({
    isLoading: true
  });
  hideActionLoadingDistpatcher = new LinkActionToggleLoading({
    isLoading: false
  });

  constructor(
    private actions$: Actions,
    private linksService: LinksService,
    private store: Store<AppState>
  ) {}

  @Effect()
  loadLinksPage$ = this.actions$.pipe(
    ofType<LinksPageRequested>(LinkActionTypes.LinksPageRequested),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.linksService.findLinks(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const pageLoadedDispatch = new LinksPageLoaded({
        links: result.items,
        totalCount: result.totalCount,
        page: lastQuery
      });
      return pageLoadedDispatch;
    })
  );

  @Effect()
  deleteLink$ = this.actions$.pipe(
    ofType<OneLinkDeleted>(LinkActionTypes.OneLinkDeleted),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showActionLoadingDistpatcher);
      return this.linksService.deleteLink(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteLinks$ = this.actions$.pipe(
    ofType<ManyLinksDeleted>(LinkActionTypes.ManyLinksDeleted),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showActionLoadingDistpatcher);
      return this.linksService.deleteLinks(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateLink$ = this.actions$.pipe(
    ofType<LinkUpdated>(LinkActionTypes.LinkUpdated),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showActionLoadingDistpatcher);
      return this.linksService.updateLink(payload.link);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  createLink$ = this.actions$.pipe(
    ofType<LinkOnServerCreated>(LinkActionTypes.LinkOnServerCreated),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showActionLoadingDistpatcher);
      return this.linksService.createLink(payload.link).pipe(
        tap(res => {
          this.store.dispatch(new LinkCreated({ link: res }));
        })
      );
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );
}
