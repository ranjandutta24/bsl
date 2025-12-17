import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { SadelCommService } from '../../../services/sadel-commn.service';
import { CentralHandlerService } from '../../../services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TotalStatusComponent } from '../../common/total-status/total-status.component';
import { CoilInfoComponent } from '../../common/coil-info/coil-info.component';

@Component({
  selector: 'app-sadel-h',
  imports: [CommonModule, FormsModule, TotalStatusComponent, CoilInfoComponent],
  templateUrl: './sadel-h.component.html',
  styleUrl: './sadel-h.component.scss',
})
export class SadelHComponent {
  @ViewChild('coilInput') coilInput!: ElementRef<HTMLInputElement>;
  @ViewChild('popupRef') popupRef!: ElementRef;
  no_result = 0;
  hoveredItem: any = null;
  selectedhigh = '';
  gridItems: any;
  sadelH: any;
  gridItems1st: any;
  gridItems2nd: any;

  popupVisible = false;
  popupX = 0;
  popupY = 0;
  selectedAsset: any = '';
  pickupFlag = false;

  infoofsaddle: any;
  saddeleInfo = false;
  coilInfo: any = [];
  selectedSaddle: any = '';
  pickupcoil: any;
  showAddCoilModal = false;
  prefix: string = 'BSL00';
  newCoilId: string = this.prefix;
  searchCoil = 'BSL00';
  searchCoilResult: any = '';

  // dynamic items (could come from API, service, etc.)
  items: string[] = ['Pickup', 'Delete', 'Details'];
  constructor(
    private sadelService: SadelService,
    private cdr: ChangeDetectorRef,
    private comm: SadelCommService,
    public central: CentralHandlerService,
    private snackBar: MatSnackBar
  ) {}
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.popupVisible) return;

    const clickedInside = this.popupRef?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.popupVisible = false;
    }
  }
  ngOnInit(): void {
    this.central.selectedSaddle$.subscribe((name) => {
      this.infoofsaddle = name;
    });
    this.sadelService.search({ ROWNAME: 'H' }).subscribe(
      (response) => {
        this.sadelH = response;

        this.sadelH.sort((a: any, b: any) => a.SADDLESEQ - b.SADDLESEQ);

        this.gridItems1st = this.sadelH.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelH.filter((item: any) => {
          return item.FLR == 1;
        });

        this.pickupcoil = this.sadelService.getPickup();
        if (this.pickupcoil.COILID) {
          this.pickupFlag = true;
        }

        let h = this.sadelService.getHigh();

        if (h == 1) {
          this.selectedhigh = '1st';
          this.gridItems = this.gridItems1st;
        } else {
          this.selectedhigh = '2nd';
          this.gridItems = this.gridItems2nd;
        }
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );

    window.addEventListener('highlight-coil', this.highlightHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('highlight-coil', this.highlightHandler);
  }

  highlightHandler = (e: any) => {
    let flr = e.detail.flr;
    if (flr == 0) {
      this.selectedhigh = '1st';
      this.gridItems = this.gridItems1st;
      this.sadelService.saveHigh(1);
    } else {
      this.selectedhigh = '2nd';
      this.gridItems = this.gridItems2nd;
      this.sadelService.saveHigh(2);
    }
    this.searchCoilResult = e.detail.coilId;
    this.cdr.detectChanges();
  };
  onSearch() {
    this.sadelService
      .search({ COILID: this.searchCoil })
      .subscribe((response: any) => {
        if (!response?.length) {
          this.searchCoilResult = '';
          this.no_result = 1;
          return;
        }
        this.no_result = 0;
        const found = response[0];
        const row = found.ROWNAME.toUpperCase(); // A/B/C...
        const coilId = found.COILID;
        const flr = found.FLR;

        if (row === 'H') {
          // ✅ SAME COMPONENT → highlight here only
          if (found.FLR == 1) {
            // 2nd high
            this.selectedhigh = '2nd';
            this.gridItems = this.gridItems2nd;
            this.sadelService.saveHigh(2);
          } else {
            // 1st high
            this.selectedhigh = '1st';
            this.gridItems = this.gridItems1st;
            this.sadelService.saveHigh(1);
          }
          this.searchCoilResult = coilId;

          // force change detection
          this.cdr.detectChanges();
          return;
        }

        // 🔥 DIFFERENT COMPONENT → Tell HOME to switch saddle
        this.comm.switchSadel$.next({ row, coilId, flr });
      });
  }

  createhistort(
    sn: any,
    ci: any,
    th: any,
    wd: any,
    wgt: any,
    dest: any,
    hno: any,
    grade: any
  ) {
    this.sadelService
      .cratehistory({
        SADDLENAME: sn,
        COILID: ci,
        ADDTIME: new Date(),
        THICK: th,
        WIDTH: wd,
        WEIGHT: wgt,
        DEST: dest,
        HEATNO: hno,
        GRADE: grade,
      })
      .subscribe((r) => {});
  }
  updatehistory(sn: any, ci: any) {
    this.sadelService
      .updatehistory({
        COILID: ci,
        SADDLENAME: sn,
        RMVTIME: new Date(),
      })
      .subscribe((r) => {
        this.comm.triggerStatusRefresh();
        this.comm.triggerRefresh();
        this.cdr.detectChanges();
      });
  }

  onDoubleClick(item: any) {
    this.central.handleDoubleClick(item);
  }
  onChangeHigh(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value == '2nd') {
      this.gridItems = this.gridItems2nd;
      this.sadelService.saveHigh(2);
    } else {
      this.gridItems = this.gridItems1st;
      this.sadelService.saveHigh(1);
    }
  }

  // onRightClick(event: MouseEvent, saddle: any) {
  //   this.selectedSaddle = saddle; // store clicked asset
  //   // console.log(this.selectedSaddle.FIT);
  //   this.cdr.detectChanges(); //
  //   event.preventDefault();
  //   this.popupX = event.clientX;
  //   this.popupY = event.clientY;

  //   this.popupVisible = true;
  //   // this.pickupFlag = false;
  // }

  onRightClick(event: MouseEvent, saddle: any, el: HTMLElement) {
    event.preventDefault();

    this.selectedSaddle = saddle;
    this.popupVisible = true;

    const rect = el.getBoundingClientRect();
    const GAP = 8;

    // Default → open below saddle
    let x = rect.left;
    let y = rect.bottom + GAP;

    setTimeout(() => {
      const popup = this.popupRef.nativeElement;
      const popupRect = popup.getBoundingClientRect();

      // 🔥 If bottom overflow → open ABOVE saddle
      if (y + popupRect.height > window.innerHeight) {
        y = rect.top - popupRect.height - GAP;
      }

      // 🔥 If right overflow → shift left
      if (x + popupRect.width > window.innerWidth) {
        x = window.innerWidth - popupRect.width - 10;
      }

      this.popupX = x;
      this.popupY = y;
    });
  }

  selectItem(item: string) {
    if (item === 'Pickup') {
      this.pickupFlag = true;
      this.pickupcoil = this.selectedSaddle;
      this.sadelService.savePickup(this.pickupcoil);
    } else if (item === 'Add Coil') {
      this.showAddCoilModal = true;
      setTimeout(() => {
        this.coilInput?.nativeElement.focus();
      }, 0);
    } else if (item === 'Unfit') {
      this.updateSaddle(item);
    } else if (item === 'Fit') {
      this.updateSaddle(item);
    } else if (item === 'Drop Coil') {
      this.dropcoil();
    } else if (item === 'Remove') {
      this.removecoil();
    } else if (item == 'Cancel') {
      this.pickupFlag = false;
      this.pickupcoil = null;
      this.sadelService.savePickup({});
    }
    this.popupVisible = false;
  }

  removecoil() {
    this.sadelService
      .update({
        SADDLENAME: this.selectedSaddle.SADDLENAME,
        COILID: null,
      })
      .subscribe(() => {
        this.updatehistory(
          this.selectedSaddle.SADDLENAME,
          this.selectedSaddle.COILID
        );
        const index = this.gridItems.findIndex(
          (item: any) => item.SADDLENAME === this.selectedSaddle.SADDLENAME
        );

        if (index !== -1) {
          this.gridItems[index] = {
            ...this.gridItems[index],
            COILID: null,
          };

          // force change detection refresh
          this.gridItems = [...this.gridItems];
          this.cdr.detectChanges(); //
        }
      });
  }
  private updateGridItem(saddleName: string, coilId: any) {
    const index = this.gridItems.findIndex(
      (item: any) => item.SADDLENAME === saddleName
    );
    if (index !== -1) {
      this.gridItems[index] = { ...this.gridItems[index], COILID: coilId };
    }
  }
  dropcoil() {
    if (!this.pickupcoil || !this.selectedSaddle) return;

    const inhand = this.pickupcoil;

    const update1 = this.sadelService.update({
      SADDLENAME: inhand.SADDLENAME,
      COILID: null,
    });

    const update2 = this.sadelService.update({
      SADDLENAME: this.selectedSaddle.SADDLENAME,
      COILID: inhand.COILID,
    });

    forkJoin([update1, update2]).subscribe({
      next: () => {
        this.updateGridItem(inhand.SADDLENAME, null);
        this.updateGridItem(this.selectedSaddle.SADDLENAME, inhand.COILID);

        this.pickupFlag = false;
        this.pickupcoil = null;
        this.sadelService.savePickup({});

        this.cdr.detectChanges();
        console.log('Drop coil completed successfully!');
      },
      error: () => console.error('API update failed!'),
    });

    this.updatehistory(inhand.SADDLENAME, inhand.COILID);

    // console.log(this.selectedSaddle.SADDLENAME, inhand.COILID);

    // // 1 history create
    this.createhistort(
      this.selectedSaddle.SADDLENAME,
      inhand.COILID,
      inhand.THICK,
      inhand.WIDTH,
      inhand.WEIGHT,
      inhand.DEST,
      inhand.HEATNO,
      inhand.GRADE
    );
  }

  updateSaddle(status: any) {
    let newStatus = status == 'Fit' ? 1 : 0;
    this.sadelService
      .update({
        SADDLENAME: this.selectedSaddle.SADDLENAME,
        FIT: newStatus,
      })
      .subscribe(() => {
        const index = this.gridItems.findIndex(
          (item: any) => item.SADDLENAME === this.selectedSaddle.SADDLENAME
        );
        if (index !== -1) {
          this.gridItems[index] = {
            ...this.gridItems[index],
            FIT: newStatus,
          };

          this.gridItems = [...this.gridItems];
          this.comm.triggerStatusRefresh();
          this.comm.triggerRefresh();
          this.cdr.detectChanges(); //
        }
      });
  }

  closeAddCoilModal() {
    this.showAddCoilModal = false;
  }

  getImage(item: any): string {
    // 1. Check unfit
    if (!item.FIT) {
      return 'assets/images/unfit.png';
    }

    // 2. Coil present
    if (item.COILID) {
      const diff = this.getMinuteDiff(item.HSMPRODTIME); // <-- your datetime field

      return diff > 4320 ? 'assets/images/coil.png' : 'assets/images/hot.png';
    }

    // 3. No coil → fit
    return 'assets/images/fit.png';
  }

  getMinuteDiff(dateString: string): number {
    const givenDate = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - givenDate.getTime(); // use getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return diffMinutes;
  }

  saveCoil() {
    this.sadelService
      .update({
        SADDLENAME: this.selectedSaddle.SADDLENAME,
        COILID: this.newCoilId,
      })
      .subscribe({
        // operation with response

        next: (response: any) => {
          // ✅ Update UI only if API succeeds

          if (response.status == 3) {
            this.snackBar.open(
              // `Coil ID ${this.newCoilId}, Coil Data Not Available !!!. Please check again.`,
              response.msg,
              'Close',
              {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: ['error-snackbar'],
              }
            );
            return;
          }
          const index = this.gridItems.findIndex(
            (item: any) => item.SADDLENAME === this.selectedSaddle.SADDLENAME
          );

          if (index !== -1) {
            this.gridItems[index] = {
              ...this.gridItems[index],
              COILID: this.newCoilId,
              HSMPRODTIME: response.HSMPRODTIME,
              THICK: response.THICK,
              WIDTH: response.WIDTH,
              DEST: response.DEST,
              GRADE: response.GRADE,
            };

            // Force change detection
            this.gridItems = [...this.gridItems];
            this.cdr.detectChanges();
          }

          this.createhistort(
            this.selectedSaddle.SADDLENAME,
            this.newCoilId,
            response.THICK,
            response.WIDTH,
            response.WEIGHT,
            response.DEST,
            response.HEATNO,
            response.GRADE
          );
          this.showAddCoilModal = false;
          this.newCoilId = this.prefix;

          this.comm.triggerStatusRefresh();
          this.comm.triggerRefresh();
        },

        error: (err) => {
          // alert(err);

          this.snackBar.open(err.error, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
          });
          this.showAddCoilModal = true;
        },
      });
  }

  getIcon(action: string) {
    return this.central.getIcon(action);
  }

  blockPrefixEdit(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;

    // Prevent deleting or modifying inside prefix
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      cursorPosition <= this.prefix.length
    ) {
      event.preventDefault();
    }

    // Prevent cursor going inside prefix using arrow/Home keys
    if (
      (event.key === 'ArrowLeft' || event.key === 'Home') &&
      cursorPosition <= this.prefix.length
    ) {
      event.preventDefault();
      setTimeout(() => {
        input.setSelectionRange(this.prefix.length, this.prefix.length);
      });
    }
  }

  restorePrefix() {
    if (!this.newCoilId.startsWith(this.prefix)) {
      this.newCoilId = this.prefix + this.newCoilId.slice(this.prefix.length);
    }

    // Keep cursor after prefix
    const input = document.getElementById('coilIdInput') as HTMLInputElement;
    if (input.selectionStart! < this.prefix.length) {
      input.setSelectionRange(this.prefix.length, this.prefix.length);
    }
  }
}
