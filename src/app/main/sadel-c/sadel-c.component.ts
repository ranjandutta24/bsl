import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SadelService } from '../../../services/sadel.service';

@Component({
  selector: 'app-sadel-c',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-c.component.html',
  styleUrl: './sadel-c.component.scss',
})
export class SadelCComponent {
  constructor(private sadelService: SadelService) {}

  hoveredItem: any = null;
  selectedhigh = '1st';
  gridItems: any;
  sadelC: any;
  gridItems1st: any;
  gridItems2nd: any;

  popupVisible = false;
  popupX = 0;
  popupY = 0;
  selectedAsset: any = '';
  pickupFlag = false;

  // dynamic items (could come from API, service, etc.)
  items: string[] = ['Pickup', 'Delete', 'Details'];

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'C' }).subscribe(
      (response) => {
        this.sadelC = response;
        this.sadelC = this.sadelC.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems1st = this.sadelC.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelC.filter((item: any) => {
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
