import { Component } from '@angular/core';
import { SadelService } from '../../../services/sadel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent {
  raw_report: any;
  final_report: any;
  rolled_but_not_in_yard_report: any;
  summary_report: any;
  CoilId: any;
  Width: any;
  Thick: any;
  Dest: any;
  selected = 'Total Stock';
  isLoading = true;

  //summary_report
  //raw_movement

  raw_movement: any = [];
  raw_movement_addtime: any = [];
  raw_movement_with_removetime: any = [];

  constructor(
    private sadelService: SadelService // private cdr: ChangeDetectorRef, // private router: Router, // private comm: SadelCommService, // public central: CentralHandlerService, // private snackBar: MatSnackBar
  ) {}

  createSummary(data: any) {
    // Create a Map to group data by the combination of THICK, WIDTH, and DEST
    const summaryMap = new Map();

    data.forEach((item: any) => {
      // Create a unique key from THICK, WIDTH, and DEST
      const key = `${item.THICK}-${item.WIDTH}-${item.DEST}`;

      if (!summaryMap.has(key)) {
        // Initialize new group
        summaryMap.set(key, {
          THICK: item.THICK,
          WIDTH: item.WIDTH,
          DEST: item.DEST,
          COILS: 1, // Row count
          Wt: item.WEIGHT || 0, // Sum of weights
          // Optional: Keep track of coil IDs if needed
          coilIds: [item.COILID],
        });
      } else {
        // Update existing group
        const group = summaryMap.get(key);
        group['COILS'] += 1;
        group['Wt'] += item.WEIGHT || 0;
        group.coilIds.push(item.COILID);
      }
    });

    // Convert Map to array of objects
    const summaryArray = Array.from(summaryMap.values());

    // Format the Wt to 2 decimal places
    summaryArray.forEach((item) => {
      item['Wt'] = parseFloat(item['Wt'].toFixed(2));
      // Remove coilIds if not needed in final output
      delete item.coilIds;
    });

    return summaryArray;
  }

  getTotalweight(arr: any[]): number {
    if (!Array.isArray(arr)) return 0;

    return arr.reduce((sum, item) => {
      const weight = Number(item?.WEIGHT) || 0;
      return sum + weight;
    }, 0);
  }

  getMinuteDiff(dateString: string): number {
    const givenDate = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - givenDate.getTime(); // use getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return diffMinutes;
  }
  ready() {
    this.final_report = this.raw_report.filter((item: any) => {
      return this.getMinuteDiff(item.HSMPRODTIME) > 4320;
    });
    this.summary_report = this.createSummary(this.final_report);
    this.selected = 'Ready Stock';
  }
  totalstock() {
    this.final_report = this.raw_report;
    this.selected = 'Total Stock';
    this.summary_report = this.createSummary(this.final_report);
  }
  rolled_bniy() {
    this.final_report = this.rolled_but_not_in_yard_report;
    this.summary_report = this.createSummary(this.final_report);
    this.selected = 'Rolled But Not In Yard Stock';
  }
  ngOnInit(): void {
    this.sadelService.totalStock().subscribe(
      (response) => {
        this.raw_report = response;
        this.raw_report.sort((a: any, b: any) => a.SADDLESEQ - b.SADDLESEQ);

        this.final_report = [...this.raw_report];

        this.summary_report = this.createSummary(this.final_report);

        this.sadelService.movementCoil().subscribe(
          (response) => {
            let result = JSON.parse(JSON.stringify(response));
            this.raw_movement = result;

            // DEBASHIS
            if (result && result.length > 0) {
              this.raw_movement_addtime = result.filter(
                (row: {
                  ADDTIME: null | undefined;
                  RMVTIME: null | undefined;
                }) =>
                  row.ADDTIME !== null &&
                  row.ADDTIME !== undefined &&
                  (row.RMVTIME === null || row.RMVTIME === undefined)
              );

              this.raw_movement_with_removetime = result.filter(
                (row: {
                  ADDTIME: null | undefined;
                  RMVTIME: null | undefined;
                }) =>
                  row.ADDTIME !== null &&
                  row.ADDTIME !== undefined &&
                  row.RMVTIME !== null &&
                  row.RMVTIME !== undefined // ✅ FIXED
              );
            }

            //  console.log(this.raw_movement_with_removetime);
            // DEBASHIS

            this.sadelService.notinyard().subscribe(
              (response) => {
                this.rolled_but_not_in_yard_report = JSON.parse(
                  JSON.stringify(response)
                );
                this.isLoading = false;
              },
              (respError) => {}
            );
          },
          (respError) => {
            // this.loading = false;
            // this.commonService.showSnakBarMessage(respError, "error", 2000);
          }
        );
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
    this.sadelService.movementCoil().subscribe(
      (response) => {
        let result = JSON.parse(JSON.stringify(response));
        this.raw_movement = result;
        //DEBASHIS
        if (result && result.length > 0) {
          this.raw_movement_addtime = result.filter(
            (row: { ADDTIME: null | undefined; RMVTIME: null | undefined }) =>
              row.ADDTIME !== null &&
              row.ADDTIME !== undefined &&
              (row.RMVTIME === null || row.RMVTIME === undefined)
          );

          this.raw_movement_with_removetime = result.filter(
            (row: { ADDTIME: null | undefined; RMVTIME: null | undefined }) =>
              row.ADDTIME !== null &&
              row.ADDTIME !== undefined &&
              row.RMVTIME !== null &&
              row.RMVTIME !== undefined // ✅ FIXED
          );
        }

        // console.log(this.raw_movement_with_removetime);
        //DEBASHIS
      },
      (respError) => {
        // this.loading = false;
        // this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }

  onSearch() {
    this.final_report = this.raw_report.filter((item: any) => {
      return (
        (this.CoilId ? item.COILID.startsWith(this.CoilId) : true) &&
        (this.Width ? item.WIDTH == this.Width : true) &&
        (this.Thick ? item.THICK == this.Thick : true) &&
        (this.Dest ? item.DEST.includes(this.Dest.toUpperCase()) : true)
      );
    });
    this.summary_report = this.createSummary(this.final_report);
  }

  // ================= IMAGE TO BASE64 =================
  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => reject(`Failed to load image: ${url}`);
      img.src = url;
    });
  }

  // ================= ENTRY POINT =================
  downloadPDF() {
    this.getBase64ImageFromURL('assets/images/sail.png')
      .then((logoBase64) => this.generatePDF(logoBase64))
      .catch((err) => {
        console.error(err);
        this.generatePDF(''); // fallback without logo
      });
  }

  // ================= PDF GENERATION =================
  generatePDF(logoBase64: string) {
    const body: any[] = [];

    // ===== TABLE HEADER =====
    body.push([
      { text: 'Sl', style: 'tableHeader' },
      { text: 'Coil Id', style: 'tableHeader' },
      { text: 'Saddle Id', style: 'tableHeader' },
      { text: 'Width', style: 'tableHeader' },
      { text: 'Thick', style: 'tableHeader' },
      { text: 'Cool Time (Hr)', style: 'tableHeader' },
      { text: 'Dest', style: 'tableHeader' },
      { text: 'Wt', style: 'tableHeader' },
      { text: 'Grade', style: 'tableHeader' },
      { text: 'Heat No', style: 'tableHeader' },
      { text: 'Entry Dt', style: 'tableHeader' },
    ]);

    // ===== TABLE DATA =====
    this.final_report.forEach((item: any, index: any) => {
      body.push([
        index + 1,
        item.COILID,
        item.SADDLENAME,
        item.WIDTH,
        item.THICK,
        ((item.HSMPRODTIME || 0) / 60).toFixed(0),
        item.DEST,
        item.WEIGHT,
        item.GRADE,
        item.HEATNO || 'N/A',
        item.UPDTIME,
      ]);
    });

    // ===== DOCUMENT DEFINITION =====
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 90, 40, 50],

      watermark: {
        text: 'SAIL',
        color: 'gray',
        opacity: 0.07,
        bold: true,
        fontSize: 120,
      },

      header: () => ({
        margin: [40, 20, 40, 0],
        columns: [
          logoBase64
            ? { image: logoBase64, width: 60, alignment: 'left' }
            : { text: '' },
          {
            stack: [
              {
                text: 'Steel Authority of India Limited',
                style: 'title',
                alignment: 'center',
              },
              {
                text: 'Coil Movement & Stock Report',
                style: 'subtitle',
                alignment: 'center',
              },
            ],
            width: '*',
          },
          {
            text: new Date().toLocaleDateString(),
            alignment: 'right',
            fontSize: 9,
          },
        ],
      }),

      footer: (currentPage: number, pageCount: number) => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: 'Generated by SAIL System', fontSize: 9 },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'right',
            fontSize: 9,
          },
        ],
      }),

      content: [
        {
          table: {
            headerRows: 1,
            widths: [
              'auto',
              '*',
              '*',
              'auto',
              'auto',
              'auto',
              '*',
              'auto',
              '*',
              '*',
              '*',
            ],
            body,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? '#eeeeee' : null,
            hLineColor: '#cccccc',
            vLineColor: '#cccccc',
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
        },
      ],

      styles: {
        title: {
          fontSize: 14,
          bold: true,
        },
        subtitle: {
          fontSize: 11,
          margin: [0, 4, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
        },
      },
    };

    (pdfMake as any).createPdf(docDefinition).download('SAIL_Coil_Report.pdf');
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
