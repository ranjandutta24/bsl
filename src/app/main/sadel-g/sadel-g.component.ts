import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { SadelCommService } from '../../../services/sadel-commn.service';
import { CentralHandlerService } from '../../../services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TotalStatusComponent } from '../total-status/total-status.component';

@Component({
  selector: 'app-sadel-g',
  imports: [CommonModule, FormsModule, TotalStatusComponent],
  templateUrl: './sadel-g.component.html',
  styleUrl: './sadel-g.component.scss',
})
export class SadelGComponent {
  no_result = 0;
  hoveredItem: any = null;
  selectedhigh = '';
  gridItems: any;
  sadelG: any;
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

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'G' }).subscribe(
      (response) => {
        this.sadelG = response;
        this.sadelG.sort((a: any, b: any) => a.SADDLESEQ - b.SADDLESEQ);

        this.gridItems1st = this.sadelG.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelG.filter((item: any) => {
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

        if (row === 'G') {
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

  onRightClick(event: MouseEvent, saddle: any) {
    this.selectedSaddle = saddle; // store clicked asset
    // console.log(this.selectedSaddle.FIT);
    this.cdr.detectChanges(); //
    event.preventDefault();
    this.popupX = event.clientX;
    this.popupY = event.clientY;

    this.popupVisible = true;
    // this.pickupFlag = false;
  }

  selectItem(item: string) {
    // console.log('Selected:', item);

    if (item === 'Pickup') {
      this.pickupFlag = true;
      this.pickupcoil = this.selectedSaddle;
      this.sadelService.savePickup(this.pickupcoil);
    } else if (item === 'Add Coil') {
      this.showAddCoilModal = true;
      console.log(this.selectedSaddle);
    } else if (item === 'Unfit') {
      console.log('unfit');
      this.updateSaddle(item);
    } else if (item === 'Fit') {
      console.log('fit');
      this.updateSaddle(item);
    } else if (item === 'Drop Coil') {
      console.log('drop');
      this.dropcoil();
    } else if (item === 'Remove') {
      console.log('remove');
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
    this.createhistort(this.selectedSaddle.SADDLENAME, inhand.COILID);
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
    this.sadelService.coilvalid({ COILID: this.newCoilId }).subscribe(
      (response: any) => {
        if (response.valid == 0) {
          this.snackBar.open(
            `Coil ID ${this.newCoilId} data not present. Please check again.`,
            'Close',
            {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['error-snackbar'],
            }
          );
          // this.showAddCoilModal = true;
          return;
        }

        this.sadelService
          .update({
            SADDLENAME: this.selectedSaddle.SADDLENAME,
            COILID: this.newCoilId,
          })
          .subscribe({
            next: () => {
              // ✅ Update UI only if API succeeds
              const index = this.gridItems.findIndex(
                (item: any) =>
                  item.SADDLENAME === this.selectedSaddle.SADDLENAME
              );

              if (index !== -1) {
                this.gridItems[index] = {
                  ...this.gridItems[index],
                  COILID: this.newCoilId,
                };

                // Force change detection
                this.gridItems = [...this.gridItems];
                this.cdr.detectChanges();
              }

              this.createhistort(
                this.selectedSaddle.SADDLENAME,
                this.newCoilId
              );
              this.showAddCoilModal = false;
              this.newCoilId = this.prefix;
              this.comm.triggerStatusRefresh();
            },

            error: (err) => {
              this.snackBar.open(err, 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: ['error-snackbar'],
              });
              this.showAddCoilModal = true;
            },
          });
      },
      (respError) => {
        let msg = `Error`;
        alert(msg);
      }
    );
  }

  createhistort(sn: any, ci: any) {
    this.sadelService
      .cratehistory({
        SADDLENAME: sn,
        COILID: ci,
        ADDTIME: new Date(),
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
        this.cdr.detectChanges();
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
