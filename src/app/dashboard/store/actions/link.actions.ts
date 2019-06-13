// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../core/_base/crud';
// Models
import { Link } from '../../models/link.model';

export enum LinkActionTypes {
  LinkOnServerCreated = '[Edit Link Dialog] Link On Server Created',
  LinkCreated = '[Edit Link Dialog] Link Created',
  LinkUpdated = '[Edit Link Dialog] Link Updated',
  OneLinkDeleted = '[Links List Page] One Link Deleted',
  ManyLinksDeleted = '[Links List Page] Many Link Deleted',
  LinksPageRequested = '[Links List Page] Links Page Requested',
  LinksPageLoaded = '[Links API] Links Page Loaded',
  LinksPageCancelled = '[Links API] Links Page Cancelled',
  LinksPageToggleLoading = '[Links] Links Page Toggle Loading',
  LinkActionToggleLoading = '[Links] Links Action Toggle Loading'
}

export class LinkOnServerCreated implements Action {
  readonly type = LinkActionTypes.LinkOnServerCreated;
  constructor(public payload: { link: Link }) {}
}

export class LinkCreated implements Action {
  readonly type = LinkActionTypes.LinkCreated;
  constructor(public payload: { link: Link }) {}
}

export class LinkUpdated implements Action {
  readonly type = LinkActionTypes.LinkUpdated;
  constructor(
    public payload: {
      partialLink: Update<Link>; // For State update
      link: Link; // For Server update (through service)
    }
  ) {}
}

export class OneLinkDeleted implements Action {
  readonly type = LinkActionTypes.OneLinkDeleted;
  constructor(public payload: { id: number }) {}
}

export class ManyLinksDeleted implements Action {
  readonly type = LinkActionTypes.ManyLinksDeleted;
  constructor(public payload: { ids: number[] }) {}
}

export class LinksPageRequested implements Action {
  readonly type = LinkActionTypes.LinksPageRequested;
  constructor(public payload: { page: QueryParamsModel }) {}
}

export class LinksPageLoaded implements Action {
  readonly type = LinkActionTypes.LinksPageLoaded;
  constructor(
    public payload: {
      links: Link[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) {}
}

export class LinksPageCancelled implements Action {
  readonly type = LinkActionTypes.LinksPageCancelled;
}

export class LinksPageToggleLoading implements Action {
  readonly type = LinkActionTypes.LinksPageToggleLoading;
  constructor(public payload: { isLoading: boolean }) {}
}

export class LinkActionToggleLoading implements Action {
  readonly type = LinkActionTypes.LinkActionToggleLoading;
  constructor(public payload: { isLoading: boolean }) {}
}

export type LinkActions =
  | LinkOnServerCreated
  | LinkCreated
  | LinkUpdated
  | OneLinkDeleted
  | ManyLinksDeleted
  | LinksPageRequested
  | LinksPageLoaded
  | LinksPageCancelled
  | LinksPageToggleLoading
  | LinkActionToggleLoading;
