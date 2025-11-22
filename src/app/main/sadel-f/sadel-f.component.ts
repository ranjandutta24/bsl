import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { SadelCommService } from '../../../services/sadel-commn.service';

@Component({
  selector: 'app-sadel-f',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-f.component.html',
  styleUrl: './sadel-f.component.scss',
})
export class SadelFComponent {
  hoveredItem: any = null;
  selectedhigh = '1st';
  gridItems: any;
  sadelF: any;
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
  newCoilId = 'BSL00';
  searchCoil = 'BSL00';
  searchCoilResult: any = '';

  // dynamic items (could come from API, service, etc.)
  items: string[] = ['Pickup', 'Delete', 'Details'];
  constructor(
    private sadelService: SadelService,
    private cdr: ChangeDetectorRef,
    private comm: SadelCommService
  ) {}

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'F' }).subscribe(
      (response) => {
        this.sadelF = response;
        this.sadelF = this.sadelF.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });
        this.gridItems1st = this.sadelF.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelF.filter((item: any) => {
          return item.FLR == 1;
        });
        this.gridItems = this.gridItems1st;
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );

    console.log(11);

    this.gridItems = this.gridItems1st;
    window.addEventListener('highlight-coil', this.highlightHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('highlight-coil', this.highlightHandler);
  }

  highlightHandler = (e: any) => {
    console.log(e);

    this.searchCoilResult = e.detail.coilId;
    this.cdr.detectChanges();
  };

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

        if (row === 'F') {
          // ✅ SAME COMPONENT → highlight here only
          this.searchCoilResult = coilId;

          // force change detection
          this.cdr.detectChanges();
          return;
        }

        // 🔥 DIFFERENT COMPONENT → Tell HOME to switch saddle
        this.comm.switchSadel$.next({ row, coilId });
      });
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
        this.saddeleInfo = true;
      },
      (respError) => {
        this.saddeleInfo = false;
      }
    );
  }
  onChangeHigh(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    console.log('Selected high:', inputElement.value);

    if (inputElement.value == '2nd') {
      this.gridItems = this.gridItems2nd;
    } else {
      this.gridItems = this.gridItems1st;
    }

    // You can also use this.selectedhigh directly if needed
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

    // this.updatehistory(inhand.SADDLENAME, inhand.COILID);

    // // console.log(this.selectedSaddle.SADDLENAME, inhand.COILID);

    // // // 1 history create
    // this.createhistort(this.selectedSaddle.SADDLENAME, inhand.COILID);
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
      .subscribe(() => {
        const index = this.gridItems.findIndex(
          (item: any) => item.SADDLENAME === this.selectedSaddle.SADDLENAME
        );

        if (index !== -1) {
          this.gridItems[index] = {
            ...this.gridItems[index],
            COILID: this.newCoilId,
          };

          // force change detection refresh
          this.gridItems = [...this.gridItems];
          this.cdr.detectChanges(); //
        }

        this.showAddCoilModal = false;
        this.newCoilId = 'BSL00';
      });
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
