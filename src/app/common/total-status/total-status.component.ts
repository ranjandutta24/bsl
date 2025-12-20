import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SadelCommService } from '../../../services/sadel-commn.service';

@Component({
  selector: 'app-total-status',
  imports: [CommonModule],
  templateUrl: './total-status.component.html',
  styleUrl: './total-status.component.scss',
})
export class TotalStatusComponent {
  constructor(
    private sadelService: SadelService,
    private SadelCommservice: SadelCommService
  ) {}

  private refreshSub!: Subscription;

  // total_coil: any;
  // total_weight: any = '000';
  // f_total: any;
  // f_weight: any = '000';
  // s_total: any;
  // s_weight: any = '000';

  total_coil: number = 0;
  total_weight: number = 0;
  tot_empty: number = 0;
  tot_unfit: number = 0;

  f_total: number = 0;
  f_weight: number = 0;
  f_empty: number = 0;
  f_unfit: number = 0;

  s_total: number = 0;
  s_weight: number = 0;
  s_empty: number = 0;
  s_unfit: number = 0;

  // ngOnInit(): void {
  //   this.sadelService.statuscount().subscribe((response: any) => {
  //     // this.total_coil = response.reduce(
  //     //   (sum: any, item: any) => sum + item.LOADED,
  //     //   0
  //     // );

  //     console.log(response.report);
  //     let report = response.report;

  //     this.total_coil = report.TOTCOIL;
  //     this.total_weight = report.WEIGHT;
  //     this.f_total = report.f_total;
  //     this.f_weight = report.f_weight;
  //     this.s_total = report.s_total;
  //     this.s_weight = report.s_weight;

  //     console.log(this.total_coil);
  //     // this.cdr.detectChanges();
  //   });
  // }

  //   ngOnInit(): void {
  //   this.sadelService.statuscount().subscribe({
  //     next: (response: any) => {
  //       const report = response?.report || {};

  //       /* ===== TOTAL ===== */
  //       this.total_coil   = report.TOTALCOIL   ?? 0;
  //       this.total_weight = report.TOTALWEIGHT    ?? 0;
  //       this.tot_empty    = report.TOTALEMPTY ?? 0;
  //       this.tot_unfit    = report.TOTALUNFIT ?? 0;

  //       /* ===== 1st HIGH ===== */
  //       this.f_total  = report.F_TOTAL  ?? 0;
  //       this.f_weight = report.F_WEIGHT ?? 0;
  //       this.f_empty  = report.F_EMPTY  ?? 0;
  //       this.f_unfit  = report.F_UNFIT  ?? 0;

  //       /* ===== 2nd HIGH ===== */
  //       this.s_total  = report.S_TOTAL  ?? 0;
  //       this.s_weight = report.S_WEIGHT ?? 0;
  //       this.s_empty  = report.S_EMPTY  ?? 0;
  //       this.s_unfit  = report.S_UNFIT  ?? 0;

  //       console.log('Yard Report:', report);
  //     },
  //     error: (err) => {
  //       console.error('Status Count API Error', err);
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.loadStats(); // initial load
    this.refreshSub = this.SadelCommservice.refresh$.subscribe(() => {
      this.loadStats(); // reload on refresh trigger
    });
  }

  loadStats() {
    this.sadelService.statuscount().subscribe({
      next: (response: any) => {
        const report = response?.report || {};

        /* ===== TOTAL ===== */
        this.total_coil = report.TOTALCOIL ?? 0;
        this.total_weight = report.TOTALWEIGHT ?? 0;
        this.tot_empty = report.TOTALEMPTY ?? 0;
        this.tot_unfit = report.TOTALUNFIT ?? 0;

        /* ===== 1st HIGH ===== */
        this.f_total = report.F_TOTAL ?? 0;
        this.f_weight = report.F_WEIGHT ?? 0;
        this.f_empty = report.F_EMPTY ?? 0;
        this.f_unfit = report.F_UNFIT ?? 0;

        /* ===== 2nd HIGH ===== */
        this.s_total = report.S_TOTAL ?? 0;
        this.s_weight = report.S_WEIGHT ?? 0;
        this.s_empty = report.S_EMPTY ?? 0;
        this.s_unfit = report.S_UNFIT ?? 0;
      },
      error: (err) => {
        console.error('Status Count API Error', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
