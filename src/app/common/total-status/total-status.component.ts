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
  f_total: any;
  f_weight: any = '000';
  s_total: any;
  s_weight: any = '000';

  ngOnInit(): void {
    this.sadelService.statuscount().subscribe((response: any) => {
      // this.total_coil = response.reduce(
      //   (sum: any, item: any) => sum + item.LOADED,
      //   0
      // );

      console.log(response.report);
      let report = response.report;

      this.total_coil = report.TOTCOIL;
      this.total_weight = report.WEIGHT;
      this.f_total = report.f_total;
      this.f_weight = report.f_weight;
      this.s_total = report.s_total;
      this.s_weight = report.s_weight;

      console.log(this.total_coil);
      // this.cdr.detectChanges();
    });
  }
}
