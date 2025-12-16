import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent {
  raw_report: any;

  constructor(
    private sadelService: SadelService // private cdr: ChangeDetectorRef, // private router: Router, // private comm: SadelCommService, // public central: CentralHandlerService,
  ) // private snackBar: MatSnackBar
  {}

  ngOnInit(): void {
    this.sadelService.totalStock().subscribe(
      (response) => {
        this.raw_report = response;
        this.raw_report.sort((a: any, b: any) => a.SADDLESEQ - b.SADDLESEQ);

        console.log(this.raw_report);
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }
}

// ACTIVE
// :
// 0
// COILID
// :
// "BSL001263732"
// DEST
// :
// "P3CR2K/DCR"
// FIT
// :
// 1
// FLR
// :
// 0
// GRADE
// :
// null
// HEATNO
// :
// null
// HSMPRODTIME
// :
// "2025-09-22T20:30:00.000Z"
// ROWID
// :
// "AAAdH+AAFAAAeTGAAA"
// ROWNAME
// :
// "A"
//
// :
// "A1"
// SADDLESEQ
// :
// 1
// THICK
// :
// 2.75
// UPDTIME
// :
// "2025-11-24T03:59:37.000Z"
// WEIGHT
// :
// 18.28
//
// :
// 930
