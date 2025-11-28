import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SadelService } from '../../../services/sadel.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { SadelCommService } from '../../../services/sadel-commn.service';

@Component({
  selector: 'app-sadel-a',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-a.component.html',
  styleUrl: './sadel-a.component.scss',
})
export class SadelAComponent {
  single_search = 0;
  hoveredItem: any = null;
  selectedhigh = '';
  gridItems: any;
  sadelA: any;
  gridItems1st: any;
  gridItems2nd: any;
  popupVisible = false;
  popupX = 0;
  popupY = 0;
  selectedSaddle: any = '';
  infoofsaddle: any;
  pickupFlag = false;
  saddeleInfo = false;
  pickupcoil: any;
  showAddCoilModal = false;
  // newCoilId = 'BSL00';
  searchCoil = 'BSL00';

  prefix: string = 'BSL00';
  newCoilId: string = this.prefix;
  searchCoilResult: any = '';

  // dynamic items (could come from API, service, etc.)
  items: string[] = [];
  emptyItems: string[] = [];
  coilInfo: any = [];

  constructor(
    private sadelService: SadelService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private comm: SadelCommService
  ) {}

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'A' }).subscribe(
      (response) => {
        this.sadelA = response;
        this.sadelA.sort((a: any, b: any) => a.SADDLESEQ - b.SADDLESEQ);

        this.gridItems1st = this.sadelA.filter((item: any) => {
          return item.FLR == 0;
        });

        this.gridItems2nd = this.sadelA.filter((item: any) => {
          return item.FLR == 1;
        });

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

    // this.gridItems = this.gridItems1st;

    window.addEventListener('highlight-coil', this.highlightHandler);
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

  onDoubleClick(item: any) {
    this.infoofsaddle = item;

    if (item.COILID == null || item.COILID == '') {
      this.saddeleInfo = false;
      return;
    }

    this.sadelService.coildetail({ COILID: item.COILID }).subscribe(
      (response) => {
        this.coilInfo = JSON.parse(JSON.stringify(response));
        console.log(this.coilInfo);

        this.saddeleInfo = true;
      },
      (respError) => {
        this.saddeleInfo = false;
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }

  onRightClick(event: MouseEvent, saddle: any) {
    this.selectedSaddle = saddle; // store clicked asset
    // console.log(this.selectedSaddle.FIT);
    this.cdr.detectChanges(); //

    this.cdr.detectChanges(); //
    event.preventDefault();
    this.popupX = event.clientX;
    this.popupY = event.clientY;

    this.popupVisible = true;
    // this.pickupFlag = false;
  }

  onSearch() {
    this.sadelService
      .search({ COILID: this.searchCoil })
      .subscribe((response: any) => {
        if (!response?.length) {
          this.searchCoilResult = '';
          return;
        }

        const found = response[0];
        const row = found.ROWNAME.toUpperCase(); // A/B/C...
        const coilId = found.COILID;
        const flr = found.FLR;

        if (row === 'A') {
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

  selectItem(item: string) {
    // console.log('Selected:', item);

    if (item === 'Pickup') {
      this.pickupFlag = true;
      this.pickupcoil = this.selectedSaddle;
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

        this.cdr.detectChanges();
        console.log('Drop coil completed successfully!');
      },
      error: () => console.error('API update failed!'),
    });

    // 1 history update
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
          this.cdr.detectChanges(); //
        }
      });
  }

  closeAddCoilModal() {
    this.showAddCoilModal = false;
  }
  saveCoil() {
    this.sadelService
      .update({
        SADDLENAME: this.selectedSaddle.SADDLENAME,
        COILID: this.newCoilId,
      })
      .subscribe({
        next: () => {
          // ✅ Update UI only if API succeeds
          const index = this.gridItems.findIndex(
            (item: any) => item.SADDLENAME === this.selectedSaddle.SADDLENAME
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

          this.createhistort(this.selectedSaddle.SADDLENAME, this.newCoilId);
          this.showAddCoilModal = false;
          this.newCoilId = this.prefix;
        },

        error: (err) => {
          alert(err);
          this.showAddCoilModal = true;
        },
      });
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
      .subscribe((r) => {});
  }

  getIcon(item: any) {
    switch (item) {
      case 'Pickup':
        return 'fa fa-truck';
      case 'Remove':
        return 'fa fa-trash';
      case 'Cancel':
        return 'fa fa-times-circle';
      default:
        return 'fa fa-circle';
    }
  }
}

// http://192.168.10.210:4033/api/sadel/search
// this.gridItems.forEach((element: any) => {
//   if (element.SADDLENAME == this.selectedSaddle.SADDLENAME) {
//     element.COILID = this.newCoilId;
//   }
// });
