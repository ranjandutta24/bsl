import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sadel-g',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-g.component.html',
  styleUrl: './sadel-g.component.scss',
})
export class SadelGComponent {
  hoveredItem: any = null;
  selectedhigh = '1st';
  gridItems: any;
  sadelG: any;
  gridItems1st: any;
  gridItems2nd: any;
  constructor(private sadelService: SadelService) {}

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'G' }).subscribe(
      (response) => {
        this.sadelG = response;
        this.sadelG = this.sadelG.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems1st = this.sadelG.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelG.filter((item: any) => {
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
}
