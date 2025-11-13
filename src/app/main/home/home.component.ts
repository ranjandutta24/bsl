import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SadelBComponent } from '../sadel-b/sadel-b.component';
import { SadelAComponent } from '../sadel-a/sadel-a.component';
import { SadelCComponent } from '../sadel-c/sadel-c.component';
import { SadelDComponent } from '../sadel-d/sadel-d.component';
import { SadelEComponent } from '../sadel-e/sadel-e.component';
import { SadelFComponent } from '../sadel-f/sadel-f.component';
import { SadelGComponent } from '../sadel-g/sadel-g.component';
import { SadelHComponent } from '../sadel-h/sadel-h.component';
import { SadelIComponent } from '../sadel-i/sadel-i.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  selected: string = 'A'; // Default selection
  // selectedComponent: any;

  // Optional: Load the component for 'A' if needed
  ngOnInit() {
    this.loadComponentForSelected();
  }

  loadComponentForSelected() {
    // Logic to assign selectedComponent based on selected value
  }

  // selected: string = '';
  componentMap: { [key: string]: any } = {
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

  get selectedComponent() {
    return this.componentMap[this.selected] || null;
  }
}
