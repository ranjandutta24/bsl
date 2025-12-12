import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    const storedValue = localStorage.getItem('USER_ID');

    if (!storedValue) {
      return 'Guest';
    }

    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.error('Invalid USER_ID JSON in localStorage', e);
      return 'Guest';
    }
  }

  // logout() {
  //   // clear user session data from local storage or any other storage mechanism
  //   localStorage.removeItem('USER_ID');
  //   localStorage.removeItem('USER_NAME');
  //   // navigate to login page
  //   this.router.navigate(['/login']);
  // }

  logout() {
    console.log('df');
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',

      // ✅ Change colors here
      confirmButtonColor: '#e74c3c', // Red background
      cancelButtonColor: '#6c757d', // Gray background
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('USER_ID');
        localStorage.removeItem('USER_NAME');
        this.router.navigate(['/login']);
      }
    });
  }

  logout1() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('USER_ID');
        localStorage.removeItem('USER_NAME');
        this.router.navigate(['/login']);
      }
    });
  }
}
