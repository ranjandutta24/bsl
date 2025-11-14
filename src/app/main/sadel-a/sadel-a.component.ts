import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SadelService } from '../../../services/sadel.service';

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
  selectedAsset: any = '';

  // dynamic items (could come from API, service, etc.)
  items: string[] = ['Edit', 'Delete', 'Details'];

  constructor(private sadelService: SadelService) {}
  // constructor(private sadelService: SadelService) {
  //   // dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  // }

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'A' }).subscribe(
      (response) => {
        this.sadelA = response;

        this.sadelA = this.sadelA.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });
        this.gridItems1st = this.sadelA.filter((item: any) => {
          return item.FLR == 0;
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

  // gridItems1st = [
  //   { label: 'A-1', disabled: false },
  //   { label: 'A-2', disabled: true },
  //   { label: 'A-3', disabled: false },
  //   { label: 'A-4', disabled: false },
  //   { label: 'A-5', disabled: true },
  //   { label: 'A-6', disabled: false },
  //   { label: 'A-7', disabled: false },
  //   { label: 'A-8', disabled: false },
  //   { label: 'A-9', disabled: false },
  //   { label: 'A-10', disabled: false },
  //   { label: 'A-11', disabled: false },
  //   { label: 'A-12', disabled: false },
  //   { label: 'A-13', disabled: false },
  //   { label: 'A-14', disabled: false },
  //   { label: 'A-15', disabled: false },
  //   { label: 'A-16', disabled: false },
  //   { label: 'A-17', disabled: false },
  //   { label: 'A-18', disabled: false },
  //   { label: 'A-19', disabled: false },
  //   { label: 'A-20', disabled: false },
  //   { label: 'A-21', disabled: false },
  //   { label: 'A-22', disabled: true },
  //   { label: 'A-23', disabled: false },
  //   { label: 'A-24', disabled: false },
  //   { label: 'A-25', disabled: false },
  //   { label: 'A-26', disabled: true },
  //   { label: 'A-27', disabled: false },
  //   { label: 'A-28', disabled: false },
  //   { label: 'A-29', disabled: false },
  //   { label: 'A-30', disabled: false },
  //   { label: 'A-31', disabled: false },
  //   { label: 'A-32', disabled: false },
  //   { label: 'A-33', disabled: false },
  //   { label: 'A-34', disabled: false },
  //   { label: 'A-35', disabled: false },
  //   { label: 'A-36', disabled: false },
  //   { label: 'A-37', disabled: false },
  //   { label: 'A-38', disabled: false },
  //   { label: 'A-39', disabled: false },
  //   { label: 'A-40', disabled: false },
  //   { label: 'A-41', disabled: false },
  //   { label: 'A-42', disabled: false },
  //   { label: 'A-43', disabled: false },
  //   { label: 'A-44', disabled: false },
  //   { label: 'A-45', disabled: false },
  //   { label: 'A-46', disabled: false },
  //   { label: 'A-47', disabled: false },
  //   { label: 'A-48', disabled: false },
  //   { label: 'A-49', disabled: false },
  //   { label: 'A-50', disabled: false },
  //   { label: 'A-51', disabled: false },
  //   { label: 'A-52', disabled: false },
  //   { label: 'A-53', disabled: false },
  //   { label: 'A-54', disabled: false },
  //   { label: 'A-55', disabled: false },
  //   { label: 'A-56', disabled: false },
  //   { label: 'A-57', disabled: false },
  //   { label: 'A-58', disabled: false },
  //   { label: 'A-59', disabled: false },
  //   { label: 'A-60', disabled: false },
  //   { label: 'A-61', disabled: false },
  //   { label: 'A-62', disabled: false },
  //   { label: 'A-63', disabled: false },
  //   { label: 'A-64', disabled: false },
  //   { label: 'A-65', disabled: false },
  //   { label: 'A-66', disabled: false },
  //   { label: 'A-67', disabled: false },
  //   { label: 'A-68', disabled: false },
  //   { label: 'A-69', disabled: false },
  //   // { label: 'A-70', disabled: false },
  //   // { label: 'A-71', disabled: false },
  //   // { label: 'A-72', disabled: false },
  // ];
  // gridItems2nd = [
  //   { label: 'A-1-2', disabled: true },
  //   { label: 'A-3-4', disabled: true },
  //   { label: 'A-5-6', disabled: false },
  //   { label: 'A-7-8', disabled: true },
  //   { label: 'A-9-10', disabled: false },
  //   { label: 'A-11-12', disabled: true },
  //   { label: 'A-13-14', disabled: true },
  //   { label: 'A-15-16', disabled: true },
  //   { label: 'A-17-18', disabled: false },
  //   { label: 'A-19-20', disabled: false },
  //   { label: 'A-21-22', disabled: true },
  //   { label: 'A-23-24', disabled: true },
  //   { label: 'A-25-26', disabled: true },
  //   { label: 'A-27-28', disabled: true },
  //   { label: 'A-29-30', disabled: true },
  // ];
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
  }

  selectItem(item: string) {
    console.log('Selected:', item);
    this.popupVisible = false; // close popup after selection
  }
}

// http://192.168.10.210:4033/api/sadel/search
