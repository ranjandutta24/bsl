import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SadelBComponent } from '../sadel-b/sadel-b.component';
import { SadelAComponent } from '../sadel-a/sadel-a.component';
import { SadelCComponent } from '../sadel-c/sadel-c.component';
import { SadelDComponent } from '../sadel-d/sadel-d.component';
import { SadelEComponent } from '../sadel-e/sadel-e.component';
import { SadelFComponent } from '../sadel-f/sadel-f.component';
import { SadelGComponent } from '../sadel-g/sadel-g.component';
import { SadelHComponent } from '../sadel-h/sadel-h.component';
import { SadelIComponent } from '../sadel-i/sadel-i.component';
import { SadelCommService } from '../../../services/sadel-commn.service';
import { SadelService } from '../../../services/sadel.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  selected: string = 'A';
  Astatuscount: any;
  Bstatuscount: any;
  Cstatuscount: any;
  Dstatuscount: any;
  Estatuscount: any;
  Fstatuscount: any;
  Gstatuscount: any;
  Hstatuscount: any;
  Istatuscount: any;

  constructor(
    private comm: SadelCommService,
    private cdr: ChangeDetectorRef,
    private sadelService: SadelService
  ) {}

  ngOnInit() {
    // statuscount
    // this.sadelService.statuscount().subscribe(
    //   (response: any) => {
    //     // console.log(response);
    //     this.Astatuscount = response.filter((item: any) => item.row === 'A')[0];
    //     this.Bstatuscount = response.filter((item: any) => item.row === 'B')[0];
    //     this.Cstatuscount = response.filter((item: any) => item.row === 'C')[0];
    //     this.Dstatuscount = response.filter((item: any) => item.row === 'D')[0];
    //     this.Estatuscount = response.filter((item: any) => item.row === 'E')[0];
    //     this.Fstatuscount = response.filter((item: any) => item.row === 'F')[0];
    //     this.Gstatuscount = response.filter((item: any) => item.row === 'G')[0];
    //     this.Hstatuscount = response.filter((item: any) => item.row === 'H')[0];
    //     this.Istatuscount = response.filter((item: any) => item.row === 'I')[0];
    //     // console.log(this.Astatuscount);
    //   },

    //   (respError) => {
    //     // this.loading = false;
    //     // this.commonService.showSnakBarMessage(respError, "error", 2000);
    //   }
    // );

    this.loadStatusCount();

    // Refresh when coil updated from any saddle component
 this.comm.statusRefresh$.subscribe(() => {
  console.log("REFRESH EVENT RECEIVED");   // 🔥 Add this to test
  this.loadStatusCount();
});

    this.comm.switchSadel$.subscribe((data) => {
      // Switch saddle
      this.selected = data.row;

      // Send highlight event
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('highlight-coil', {
            detail: { coilId: data.coilId, flr: data.flr },
          })
        );
      }, 300);

      this.cdr.detectChanges();
    });
  }

loadStatusCount() {
  this.sadelService.statuscount().subscribe(
    (response: any) => {
      const map = new Map(response.map((x: any) => [x.row, x]));

      this.Astatuscount = map.get('A');
      this.Bstatuscount = map.get('B');
      this.Cstatuscount = map.get('C');
      this.Dstatuscount = map.get('D');
      this.Estatuscount = map.get('E');
      this.Fstatuscount = map.get('F');
      this.Gstatuscount = map.get('G');
      this.Hstatuscount = map.get('H');
      this.Istatuscount = map.get('I');

      this.cdr.detectChanges();
    }
  );
}


  // Map letters to components
  componentMap: Record<string, any> = {
    A: SadelAComponent,
    B: SadelBComponent,
    C: SadelCComponent,
    D: SadelDComponent,
    E: SadelEComponent,
    F: SadelFComponent,
    G: SadelGComponent,
    H: SadelHComponent,
    I: SadelIComponent,
  };

  // Returning dynamic component
  get selectedComponent() {
    return this.componentMap[this.selected] || null;
  }

  changeSaddle(letter: string) {
    this.selected = letter;
  }
}
