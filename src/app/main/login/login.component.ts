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

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userid: string = '';
  password: string = '';

  constructor(private userService: UserService) {}

  login() {
    console.log(this.userid, this.password);

    this.userService
      .login({ USER_ID: this.userid, PASSWORD: this.password })
      .subscribe(
        (response: any) => {
          console.log(response);

          // change routes to operation
          if (response && response['STATUS'] === 1) {
            // add to local storage
            localStorage.setItem('USER_ID', response['USER_ID']);
            // localStorage.setItem('USER_NAME', response['DATA']['USER_NAME']);
            // this.router.navigate(['operation']);
            window.location.href = '/operation';
          }
        },
        (respError) => {
          // this.loading = false;
          // this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }
}
