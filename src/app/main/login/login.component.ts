import { Component } from '@angular/core';

import { SadelService } from '../../../services/sadel.service';
// import { CommonModule } from '../../common/common.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { SadelCommService } from '../../../services/sadel-commn.service';
import { CentralHandlerService } from '../../../services/shared.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
 userid: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.userid || !this.password) {
      this.error = 'Enter user id & password';
      return;
    }

    this.userService.login({ USER_ID: this.userid, PASSWORD: this.password })
      .subscribe(
        (resp: any) => {
          if (resp && resp['STATUS'] === 1) {
            // Save the logged-in user
            this.auth.login(resp.USER_ID );

            // Navigate to operation
            this.router.navigate(['/operation']);
          } else {
            this.error = 'Invalid credentials';
          }
        },
        () => {
          this.error = 'Login failed';
        }
      );
  }
}
