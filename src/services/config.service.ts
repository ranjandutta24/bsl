import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = 'http://192.168.10.210:4033/api/'; // final

  main_apiUrl = 'http://192.168.10.210:4033/api/'; // default
  case1_apiUrl = 'http://10.70.14.3:4033/api/'; // 10.70

  setApiUrlBasedOnIp(ip: any) {
    const table: any = {};
    const host = window.location.hostname;

    table.host = host;

    if (host.startsWith('10.70')) {
      this.apiUrl = this.case1_apiUrl;
    } else {
      this.apiUrl = this.main_apiUrl;
    }

    table.baseurl = this.apiUrl;

    console.log('Access from:', ip);
    console.log('Base URL:', this.apiUrl);

    console.table(table); // ✅ Works
  }
}
