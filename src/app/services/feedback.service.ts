import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Feedback } from './../shared/feedback';

@Injectable()
export class FeedbackService {

  constructor(
    private restangular: Restangular,
  ) { }

  submitFeedback(data: object): Observable<Feedback> {
    return this.restangular.all('feedback').post(data);
  }

}
