import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
// import { CommonModule } from '../../common/common.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sadel-i',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-i.component.html',
  styleUrl: './sadel-i.component.scss',
})
export class SadelIComponent {
  constructor(private sadelService: SadelService) {}

  hoveredItem: any = null;
  selectedhigh = '1st';
  sadelI: any;
  gridItems1st: any;
  gridItems2nd: any;
  gridItems: any;

  ngOnInit(): void {
    this.sadelService.search({ ROWNAME: 'I' }).subscribe(
      (response) => {
        console.log(response);
        this.sadelI = response;

        this.sadelI = this.sadelI.sort((a: any, b: any) => {
          const numA = Number(a.SADDLENAME.slice(1));
          const numB = Number(b.SADDLENAME.slice(1));
          return numA - numB;
        });

        this.gridItems1st = this.sadelI.filter((item: any) => {
          return item.FLR == 0;
        });
        this.gridItems2nd = this.sadelI.filter((item: any) => {
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
