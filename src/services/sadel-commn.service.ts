// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class SadelCommService {
//   switchSadel$ = new Subject<{ row: string; coilId: string; flr: number }>();
// }


import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SadelCommService {

  private statusRefreshSource = new Subject<void>();
  statusRefresh$ = this.statusRefreshSource.asObservable();

  triggerStatusRefresh() {
    this.statusRefreshSource.next();
  }

  // Already existing event (switch saddle)
  switchSadel$ = new Subject<{ row: string; coilId: string; flr: number }>();
  switchSadel(data: { row: string; coilId: string; flr: number }) {
    this.switchSadel$.next(data);
  }
}

