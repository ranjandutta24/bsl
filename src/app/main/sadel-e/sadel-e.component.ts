import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sadel-e',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-e.component.html',
  styleUrl: './sadel-e.component.scss',
})
export class SadelEComponent {
  hoveredItem: any = null;
  selectedhigh = '1st';
  gridItems: any;
  sadelE: any;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'E' }).subscribe(
      (response) => {
        console.log(response);
        this.sadelE = response;

        this.sadelE = this.sadelE.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems1st = this.sadelE.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelE.filter((item: any) => {
          return item.FLR == 1;
        });
        this.gridItems = this.gridItems1st;
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );

    this.gridItems = this.gridItems1st;
  }
  onSearch() {
    this.sadelService.search({ COILID: this.searchCoil }).subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          this.searchCoilResult = response[0].COILID;
          // console.log(this.searchCoilResult);
        } else {
          this.searchCoilResult = '';
        }
        this.cdr.detectChanges(); //
      },
      (respError) => {}
    );
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

  onRightClick(event: MouseEvent, asset: any) {
    event.preventDefault();
    this.popupX = event.clientX;
    this.popupY = event.clientY;
    this.selectedAsset = asset; // store clicked asset
    this.popupVisible = true;
    this.pickupFlag = false;
  }

  selectItem(item: string) {
    console.log('Selected:', item);

    if (item === 'Pickup') {
      this.pickupFlag = true;
    }
    this.popupVisible = false; // close popup after selection
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
