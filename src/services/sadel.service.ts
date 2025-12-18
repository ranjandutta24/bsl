import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class SadelService {
  //private apiUrl = 'http://localhost:4062/api';//Local API
  private apiUrl = 'http://192.168.10.210:4033/api/';

  private authorization = 'Bearer c2lzeFVQVkF1dGg6YjVQVTJPcFYyNCMxc24=';
  //For Sign up Link

  private appUrlSms = 'https%3A%2F%2Fweb.educampuz.com%2F%23%2F';
  public otype = 'Company';

  private jsonUrl = 'assets/jsons';
  private high = 1;
  pickupCoil: any = {};

  constructor(
    // @Inject(SESSION_STORAGE) private storage: StorageService,
    public http: HttpClient,
    private config: ConfigService
  ) {}

  getHigh() {
    return this.high;
  }
  saveHigh(n: number) {
    this.high = n;
  }
  getPickup() {
    return this.pickupCoil;
  }
  savePickup(coil: any) {
    this.pickupCoil = coil;
  }

  private getHeaders() {
    return new HttpHeaders({
      Authorization: this.authorization,
      'Content-Type': 'application/json',
    });
  }

  /**
   * ***********************************************************************************
   * API URL Functions
   * ***********************************************************************************
   */
  getBaseUrl(): string {
    return this.apiUrl;
  }

  getAuthorization() {
    return this.authorization;
  }

  // getAppUrl(): string {
  //   return this.appUrl;
  // }

  getAppUrlSms(): string {
    return this.appUrlSms;
  }

  search(saddle: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'sadel/search', saddle, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  update(saddle: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'sadel/update1', saddle, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  coildetail(coilid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'sadel/coildetail', coilid, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  statuscount() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'sadel/statuscount', {}, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  totalStock() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.config.apiUrl + 'reports/totalstock', httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  movementCoil() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.config.apiUrl + 'reports/todayHistory', httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  notinyard() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.config.apiUrl + 'reports/notinyard', httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  coilvalid(coilid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'sadel/coilvalid', coilid, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  cratehistory(coilid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'saddelhistory/create', coilid, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  updatehistory(coilid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return this.http
      .post(this.config.apiUrl + 'saddelhistory/update', coilid, httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let message = error.error;
    console.log(message);
    return throwError(
      message ||
        'Remote server unreachable. Please check your Internet connection.'
    );
  }

  /**
   * ***********************************************************************************
   * Local Functions
   * ***********************************************************************************
   */

  findItem(array: any, key: string, value: string) {
    for (let index = 0; index < array.length; index++) {
      if (array[index][key] == value) {
        return index;
      }
    }
    return -1;
  }

  // http://192.168.10.210:4033/api/sadel/search
}
