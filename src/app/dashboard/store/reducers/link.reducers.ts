import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { LinkActions, LinkActionTypes } from '../actions/link.actions';
// Models
import { Link } from '../../models/link.model';
import { QueryParamsModel } from '../../../core/_base/crud';

export interface LinksState extends EntityState<Link> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedLinkId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Link> = createEntityAdapter<Link>();

export const initialState: LinksState = adapter.getInitialState({
  linkForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedLinkId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function reducer(state = initialState, action: LinkActions): LinksState {
  switch (action.type) {
    case LinkActionTypes.LinksPageToggleLoading: {
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedLinkId: undefined
      };
    }

    case LinkActionTypes.LinkActionToggleLoading: {
      return {
        ...state,
        actionsloading: action.payload.isLoading
      };
    }

    case LinkActionTypes.LinkOnServerCreated:
      return {
        ...state
      };

    case LinkActionTypes.LinkCreated:
      return adapter.addOne(action.payload.link, {
        ...state,
        lastCreatedLinkId: action.payload.link.id
      });

    case LinkActionTypes.LinkUpdated:
      return adapter.updateOne(action.payload.partialLink, state);

    case LinkActionTypes.OneLinkDeleted:
      return adapter.removeOne(action.payload.id, state);

    case LinkActionTypes.ManyLinksDeleted:
      return adapter.removeMany(action.payload.ids, state);

    case LinkActionTypes.LinksPageCancelled: {
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({})
      };
    }

    case LinkActionTypes.LinksPageLoaded: {
      return adapter.addMany(action.payload.links, {
        ...initialState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
