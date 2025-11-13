import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router) {}
  home = 'home';

  goToRoute(path: string) {
    console.log(path);

    this.router.navigate([path]);
  }
  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
