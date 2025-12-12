import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = 'http://192.168.10.210:4033/api/'; // default

  setApiUrlBasedOnIp(ip: string) {
    console.log(ip);

    if (ip.startsWith('192.168.10.75')) {
      this.apiUrl = 'http://192.168.10.75:5000/api/';
    } else if (ip.startsWith('192.168.4.')) {
      this.apiUrl = 'http://192.168.4.10:4062/api/';
    } else {
      this.apiUrl = 'http://192.168.10.210:4033/api/';
    }
  }
}
