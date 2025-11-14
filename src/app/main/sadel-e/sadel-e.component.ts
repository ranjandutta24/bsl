import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  constructor(private sadelService: SadelService) {}

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
