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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  selected: string = 'A';

  constructor(
    private comm: SadelCommService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.comm.switchSadel$.subscribe((data) => {
      // Switch saddle
      this.selected = data.row;

      // Send highlight event
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('highlight-coil', {
            detail: { coilId: data.coilId },
          })
        );
      }, 300);

      this.cdr.detectChanges();
    });
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
