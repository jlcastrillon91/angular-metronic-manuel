import { BaseModel } from '../../core/_base/crud/models/_base.model';

export class Link extends BaseModel {
  id: string;
  hits: number;
  name: string;
  slug: string
  targetUrl: string
  shortUrl: string
  domainId: string
  accountId: string
  state:'active' | 'inactive';
  userId: string
  createdAt: string
  updatedAt: string
  metadata: string

  clear() {
    this.hits = 0;
    this.state = 'active';
    this.name = '';
    this.slug = '';
    this.targetUrl = '';
    this.shortUrl = '';
    this.domainId = '';
    this.accountId = '';
    this.userId = '';
    this.createdAt = '';
    this.updatedAt = '';
    this.metadata = '';
  }
}
