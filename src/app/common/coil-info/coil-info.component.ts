import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coil-info',
  templateUrl: './coil-info.component.html',
  styleUrls: ['./coil-info.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CoilInfoComponent {
  @Input() coilInfo: any;
}
