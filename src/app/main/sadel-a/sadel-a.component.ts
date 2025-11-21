import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SadelService } from '../../../services/sadel.service';

import { ChangeDetectorRef } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sadel-a',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-a.component.html',
  styleUrl: './sadel-a.component.scss',
})
export class SadelAComponent {
  hoveredItem: any = null;
  selectedhigh = '1st';
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

  // dynamic items (could come from API, service, etc.)
  items: string[] = [];
  emptyItems: string[] = [];

  constructor(
    private sadelService: SadelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'A' }).subscribe(
      (response) => {
        this.sadelA = response;

        this.gridItems1st = this.sadelA.filter((item: any) => {
          return item.FLR == 0;
        });

        this.gridItems1st = this.gridItems1st.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems2nd = this.sadelA.filter((item: any) => {
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
  onDoubleClick(item: any) {
    this.infoofsaddle = item;
    this.saddeleInfo = true;
    if (item.COILID == null || item.COILID == '') {
      return;
    }

    this.sadelService.coildetail({ COILID: item.COILID }).subscribe(
      (response) => {
        console.log(response);
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }

  onRightClick(event: MouseEvent, saddle: any) {
    this.selectedSaddle = saddle; // store clicked asset
    console.log(this.selectedSaddle.FIT);
    this.cdr.detectChanges(); //

    this.emptyItems = [
      'Add Coil',
      'Drop Coil',
      this.selectedSaddle.FIT == 1 ? 'Unfit' : 'Fit',
      'Cancel',
    ];
    this.items = [
      'Pickup',
      'Remove',
      'Cancel',
      this.selectedSaddle.FIT == 1 ? 'Unfit' : 'Fit',
    ];
    this.cdr.detectChanges(); //
    event.preventDefault();
    this.popupX = event.clientX;
    this.popupY = event.clientY;

    this.popupVisible = true;
    this.pickupFlag = false;
  }

  showAddCoilModal = false;
  newCoilId = 'BSL00';

  selectItem(item: string) {
    console.log('Selected:', item);

    if (item === 'Pickup') {
      this.pickupFlag = true;
    } else if (item === 'Add Coil') {
      this.showAddCoilModal = true;
      console.log(this.selectedSaddle);
    } else if (item === 'Unfit') {
      console.log('unfit');
      this.updateSaddle(item);
    } else if (item === 'Fit') {
      console.log('fit');
      this.updateSaddle(item);
    }

    this.popupVisible = false;
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
          // force change detection refresh
          this.gridItems = [...this.gridItems];
          this.cdr.detectChanges(); //
        }
        // this.showAddCoilModal = false;
        // this.newCoilId = 'BSL00';
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

// http://192.168.10.210:4033/api/sadel/search
// this.gridItems.forEach((element: any) => {
//   if (element.SADDLENAME == this.selectedSaddle.SADDLENAME) {
//     element.COILID = this.newCoilId;
//   }
// });
