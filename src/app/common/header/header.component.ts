import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
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
  getUserName(): string {
    // retrieve user name from local storage or any other storage mechanism
    const userName = localStorage.getItem('USER_ID');
    return userName ? userName : 'Guest';
  }
  logout() {
    // clear user session data from local storage or any other storage mechanism
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('USER_NAME');
    // navigate to login page
    this.router.navigate(['/login']);
  }
}
