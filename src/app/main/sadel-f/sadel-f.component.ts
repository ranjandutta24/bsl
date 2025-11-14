import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  // dynamic items (could come from API, service, etc.)
  items: string[] = ['Pickup', 'Delete', 'Details'];
  constructor(private sadelService: SadelService) {}

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
}
