import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'USER_ID';

  login(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.userKey);
  }

  getUser() {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  
}
