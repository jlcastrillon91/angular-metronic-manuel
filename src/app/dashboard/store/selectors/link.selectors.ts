// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import {
  QueryResultsModel,
  HttpExtenstionsModel
} from '../../../core/_base/crud';
// State
import { Link } from '../../models/link.model';

import * as fromFeature from '../reducers';

export const selectLinksState = createSelector(
  fromFeature.getLinksFeatureState,
  feature => feature.links
);

export const selectLinkById = (linkId: string) =>
  createSelector(
    selectLinksState,
    linksState => linksState.entities[linkId]
  );

export const selectLinksPageLoading = createSelector(
  selectLinksState,
  linksState => linksState.listLoading
);

export const selectLinksActionLoading = createSelector(
  selectLinksState,
  linksState => linksState.actionsloading
);

export const selectLastCreatedLinkId = createSelector(
  selectLinksState,
  linksState => linksState.lastCreatedLinkId
);

export const selectLinksShowInitWaitingMessage = createSelector(
  selectLinksState,
  linksState => linksState.showInitWaitingMessage
);

export const selectLinksInStore = createSelector(
  selectLinksState,
  linksState => {
    const items: Link[] = [];
    each(linksState.entities, element => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: Link[] = httpExtension.sortArray(
      items,
      linksState.lastQuery.sortField,
      linksState.lastQuery.sortOrder
    );
    return new QueryResultsModel(result, linksState.totalCount, '');
  }
);
