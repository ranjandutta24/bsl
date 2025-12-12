import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = 'http://192.168.10.210:4033/api/'; // default

  // setApiUrlBasedOnIp(ip: string) {
  //   console.log(ip);

  //   if (ip.startsWith('192.168.10.75')) {
  //     this.apiUrl = 'http://192.168.10.75:5000/api/';
  //   } else if (ip.startsWith('192.168.4.')) {
  //     this.apiUrl = 'http://192.168.4.10:4062/api/';
  //   } else {
  //     this.apiUrl = 'http://192.168.10.210:4033/api/';
  //   }
  // }

  setApiUrlBasedOnIp() {
    const table: any = {};
    const host = window.location.hostname;

    table.host = host;

    if (host.startsWith('10.127')) {
      this.apiUrl = 'http://192.168.10.210:4033/api/';
    } else if (host.startsWith('10.128')) {
      this.apiUrl = 'http://192.168.4.10:4062/api/';
    } else {
      this.apiUrl = 'https://public-server.com/api/';
    }

    table.baseurl = this.apiUrl;

    console.log('Access from:', host);
    console.log('Base URL:', this.apiUrl);

    console.table(table); // ✅ Works
  }
}
