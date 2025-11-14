import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SadelService } from '../../../services/sadel.service';

@Component({
  selector: 'app-sadel-b',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-b.component.html',
  styleUrl: './sadel-b.component.scss',
})
export class SadelBComponent {
  sadelB: any;
  gridItems1st: any;
  gridItems2nd: any;

  constructor(private sadelService: SadelService) {}
  hoveredItem: any = null;
  selectedhigh = '1st';
  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'B' }).subscribe(
      (response) => {
        console.log(response);
        this.sadelB = response;
        this.sadelB = this.sadelB.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems1st = this.sadelB.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelB.filter((item: any) => {
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

  gridItems: any;
  // gridItems1st = [
  //   { label: 'B-1', disabled: false },
  //   { label: 'B-2', disabled: false },
  //   { label: 'B-3', disabled: false },
  //   { label: 'B-4', disabled: false },
  //   { label: 'B-5', disabled: false },
  //   { label: 'B-6', disabled: false },
  //   { label: 'B-7', disabled: false },
  //   { label: 'B-8', disabled: true },
  //   { label: 'B-9', disabled: false },
  //   { label: 'B-10', disabled: false },
  //   { label: 'B-11', disabled: true },
  //   { label: 'B-12', disabled: false },
  //   { label: 'B-13', disabled: true },
  //   { label: 'B-14', disabled: false },
  //   { label: 'B-15', disabled: false },
  //   { label: 'B-16', disabled: false },
  //   { label: 'B-17', disabled: true },
  //   { label: 'B-18', disabled: false },
  //   { label: 'B-19', disabled: false },
  //   { label: 'B-20', disabled: false },
  //   { label: 'B-21', disabled: false },
  //   { label: 'B-22', disabled: false },
  //   { label: 'B-23', disabled: false },
  //   { label: 'B-24', disabled: false },
  //   { label: 'B-25', disabled: false },
  //   { label: 'B-26', disabled: false },
  //   { label: 'B-27', disabled: false },
  //   { label: 'B-28', disabled: false },
  //   { label: 'B-29', disabled: false },
  //   { label: 'B-30', disabled: false },
  //   { label: 'B-31', disabled: false },
  //   { label: 'B-32', disabled: false },
  //   { label: 'B-33', disabled: false },
  //   { label: 'B-34', disabled: false },
  //   { label: 'B-35', disabled: false },
  //   { label: 'B-36', disabled: false },
  //   { label: 'B-37', disabled: false },
  //   { label: 'B-38', disabled: false },
  //   { label: 'B-39', disabled: false },
  //   { label: 'B-40', disabled: false },
  //   { label: 'B-41', disabled: false },
  //   { label: 'B-42', disabled: false },
  //   { label: 'B-43', disabled: false },
  //   { label: 'B-44', disabled: false },
  //   { label: 'B-45', disabled: false },
  //   { label: 'B-46', disabled: false },
  //   { label: 'B-47', disabled: false },
  //   { label: 'B-48', disabled: false },
  //   { label: 'B-49', disabled: false },
  //   { label: 'B-50', disabled: false },
  //   { label: 'B-51', disabled: false },
  //   { label: 'B-52', disabled: false },
  //   { label: 'B-53', disabled: false },
  //   { label: 'B-54', disabled: false },
  //   { label: 'B-55', disabled: false },
  //   { label: 'B-56', disabled: false },
  //   { label: 'B-57', disabled: false },
  //   { label: 'B-58', disabled: false },
  //   { label: 'B-59', disabled: false },
  //   { label: 'B-60', disabled: false },
  //   { label: 'B-61', disabled: false },
  //   { label: 'B-62', disabled: false },
  //   { label: 'B-63', disabled: false },
  //   { label: 'B-64', disabled: false },
  //   { label: 'B-65', disabled: false },
  //   { label: 'B-66', disabled: false },
  //   // { label: 'B-67', disabled: false },
  //   // { label: 'B-68', disabled: false },
  //   // { label: 'B-69', disabled: false },
  //   // { label: 'B-70', disabled: false },
  //   // { label: 'B-71', disabled: false },
  //   // { label: 'B-72', disabled: false },
  // ];
  // gridItems2nd = [
  //   { label: 'B-1-2', disabled: false },
  //   { label: 'B-3-4', disabled: false },
  //   { label: 'B-5-6', disabled: false },
  //   { label: 'B-7-8', disabled: false },
  //   { label: 'B-9-10', disabled: false },
  //   { label: 'B-11-12', disabled: false },
  //   { label: 'B-13-14', disabled: false },
  //   { label: 'B-15-16', disabled: true },
  //   { label: 'B-17-18', disabled: false },
  //   { label: 'B-19-20', disabled: false },
  //   { label: 'B-21-22', disabled: true },
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
}
