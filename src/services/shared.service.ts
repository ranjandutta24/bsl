import { Injectable } from '@angular/core';
import { SadelService } from '../services/sadel.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CentralHandlerService {
  // ------------------------
  // SHARED STATE VARIABLES
  // ------------------------
  popupX = 0;
  popupY = 0;
  popupVisible = false;
  selectedSaddle: any = null;

  infoOfSaddle: any = null;

  private saddleInfoSubject = new BehaviorSubject<boolean>(false);
  saddleInfo$ = this.saddleInfoSubject.asObservable();

  private coilInfoSubject = new BehaviorSubject<any>(null);
  coilInfo$ = this.coilInfoSubject.asObservable();

  constructor(private sadelService: SadelService) {}

  // ------------------------
  // ✅ RIGHT CLICK HANDLER
  // ------------------------
  handleRightClick(event: MouseEvent, saddle: any) {
    event.preventDefault();
    this.selectedSaddle = saddle;
    this.popupX = event.clientX;
    this.popupY = event.clientY;
    this.popupVisible = true;
  }

  hidePopup() {
    this.popupVisible = false;
  }

  // ------------------------
  // ✅ DOUBLE CLICK HANDLER
  // ------------------------
  handleDoubleClick(item: any) {
    this.infoOfSaddle = item;

    if (!item?.COILID) {
      this.saddleInfoSubject.next(false);
      return;
    }

    this.sadelService.coildetail({ COILID: item.COILID }).subscribe({
      next: (response) => {
        this.coilInfoSubject.next(response);
        this.saddleInfoSubject.next(true);
      },
      error: () => {
        this.saddleInfoSubject.next(false);
      },
    });
  }

  // ------------------------
  // ✅ OPTIONAL RESET
  // ------------------------
  resetAll() {
    this.popupVisible = false;
    this.selectedSaddle = null;
    this.saddleInfoSubject.next(false);
    this.coilInfoSubject.next(null);
  }
}
