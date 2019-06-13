import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromLinks from './link.reducers';

export interface LinksFeatureState {
  links: fromLinks.LinksState;
}

export const reducers: ActionReducerMap<LinksFeatureState> = {
  links: fromLinks.reducer
};

export const getLinksFeatureState = createFeatureSelector<LinksFeatureState>(
  'linksFeatureState'
);
