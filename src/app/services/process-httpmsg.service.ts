import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProcessHTTPMsgService {

  constructor() { }

  public extractData(res) {
    return res || { };
  }

  public handleError(error: HttpErrorResponse) {
    let errMsg: string;

    if(error.error instanceof Error) {
      // Client-side or network error occurred.
      errMsg = `${error.status} - ${error.statusText || ''} ${error.message}`;
    }
    else {
      // The backend returned an unsuccessful response code.
      errMsg = `Backend returned error code ${error.status}, message: ${error.message}`;
    }
    console.log(errMsg)
    return Observable.throw(errMsg);
    }

}
