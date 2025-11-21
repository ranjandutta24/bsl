import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SadelCommService {
  switchSadel$ = new Subject<{ row: string, coilId: string }>();
}
