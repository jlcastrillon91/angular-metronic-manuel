import { BaseModel } from '../../core/_base/crud/models/_base.model';

export class Link extends BaseModel {
  id: number;
  url: string;
  destination: string;
  hits: number;
  status: 'active' | 'inactive';

  clear() {
    this.url = '';
    this.destination = '';
    this.hits = 0;
    this.status = 'active';
  }
}
