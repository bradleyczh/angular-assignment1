import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Promotion } from './../shared/promotion';

@Injectable()
export class PromotionService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get(baseURL + 'promotions')
      .map(res => this.processHTTPMsgService.extractData(res))
      .catch(err => this.processHTTPMsgService.handleError(err));
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions/' + id)
      .map(res => this.processHTTPMsgService.extractData(res))
      .catch(err => this.processHTTPMsgService.handleError(err));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions?featured=true')
      .map(res => this.processHTTPMsgService.extractData(res)[0])
      .catch(err => this.processHTTPMsgService.handleError(err));
  }

}
