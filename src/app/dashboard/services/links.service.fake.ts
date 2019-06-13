// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';
// Lodash
import { each } from 'lodash';
// CRUD
import {
  HttpUtilsService,
  QueryParamsModel,
  QueryResultsModel
} from '../../core/_base/crud';
// Models
import { Link } from '../models';

const API_LINK_URL = 'api/links';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  createLink(link: Link): Observable<Link> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<Link>(API_LINK_URL, link, { headers: httpHeaders });
  }

  // READ
  getAllLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(API_LINK_URL);
  }

  getLinkById(linkId: number): Observable<Link> {
    return this.http.get<Link>(API_LINK_URL + `/${linkId}`);
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  findLinks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    const url = API_LINK_URL;
    return this.http.get<Link[]>(API_LINK_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, [
          'status',
          'type'
        ]);
        return of(result);
      })
    );
  }

  // UPDATE => PUT: update the link on the server
  updateLink(link: Link): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_LINK_URL, link, { headers: httpHeader });
  }

  // DELETE => delete the link from the server
  deleteLink(linkId: number): Observable<any> {
    const url = `${API_LINK_URL}/${linkId}`;
    return this.http.delete<Link>(url);
  }

  deleteLinks(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    const length = ids.length;
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < length; i++) {
      tasks$.push(this.deleteLink(ids[i]));
    }
    return forkJoin(tasks$);
  }
}
