import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';

@Component({
  selector: 'app-total-status',
  imports: [],
  templateUrl: './total-status.component.html',
  styleUrl: './total-status.component.scss',
})
export class TotalStatusComponent {
  constructor(private sadelService: SadelService) {}

  total_coil: any;
  total_weight: any = '000';

  ngOnInit(): void {
    this.sadelService.statuscount().subscribe((response: any) => {
      console.log(response);

      // this.total_coil = response.reduce(
      //   (sum: any, item: any) => sum + item.LOADED,
      //   0
      // );
      this.total_coil = response[10].TOTCOIL;
      this.total_weight = response[10].WEIGHT;

      // this.cdr.detectChanges();
    });
  }
}
