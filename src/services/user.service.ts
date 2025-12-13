import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authorization = 'Bearer c2lzeFVQVkF1dGg6YjVQVTJPcFYyNCMxc24=';
  private apiUrl = 'http://192.168.10.210:4033/api/';
  // private apiUrl = 'localhost:4033/api/'; // build server
  constructor(
    // @Inject(SESSION_STORAGE) private storage: StorageService,
    public http: HttpClient,
    private config: ConfigService
  ) {}

  login(saddle: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      }),
    };
    return (
      this.http
        .post(this.config.apiUrl + 'user/signin', saddle, httpOptions)
        // .post(this.config.apiUrl + 'user/signin', saddle, httpOptions)
        .pipe(retry(1), catchError(this.errorHandler))
    );
  }

  errorHandler(error: any) {
    let message = error.error;

    return throwError(
      message ||
        'Remote server unreachable. Please check your Internet connection.'
    );
  }
}
