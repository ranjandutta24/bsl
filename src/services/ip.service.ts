import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IpService {
  constructor(private http: HttpClient) {}

  getIp() {
    return this.http.get('http://192.168.10.210:4033/api/');
  }
}
