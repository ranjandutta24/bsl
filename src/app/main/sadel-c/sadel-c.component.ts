import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sadel-c',
  imports: [CommonModule, FormsModule],
  templateUrl: './sadel-c.component.html',
  styleUrl: './sadel-c.component.scss',
})
export class SadelCComponent {
  hoveredItem: any = null;

  selectedhigh = '1st';
  ngOnInit(): void {
    this.gridItems = this.gridItems1st;
  }

  gridItems: any;

  gridItems1st = [
    { label: 'C-1', disabled: false },
    { label: 'C-2', disabled: false },
    { label: 'C-3', disabled: false },
    { label: 'C-4', disabled: true },
    { label: 'C-5', disabled: true },
    { label: 'C-6', disabled: false },
    { label: 'C-7', disabled: false },
    { label: 'C-8', disabled: true },
    { label: 'C-9', disabled: true },
    { label: 'C-10', disabled: false },
    { label: 'C-11', disabled: true },
    { label: 'C-12', disabled: false },
    { label: 'C-13', disabled: false },
    { label: 'C-14', disabled: false },
    { label: 'C-15', disabled: true },
    { label: 'C-16', disabled: false },
    { label: 'C-17', disabled: false },
    { label: 'C-18', disabled: false },
    { label: 'C-19', disabled: false },
  ];

  gridItems2nd = [
    { label: 'C-1-2', disabled: false },
    { label: 'C-3-4', disabled: true },
    { label: 'C-5-6', disabled: false },
    { label: 'C-7-8', disabled: true },
    { label: 'C-9-10', disabled: false },
    { label: 'C-11-12', disabled: false },
    { label: 'C-13-14', disabled: false },
    { label: 'C-15-16', disabled: true },
    { label: 'C-17-18', disabled: false },
    { label: 'C-19-20', disabled: false },
    { label: 'C-21-22', disabled: true },
  ];

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
