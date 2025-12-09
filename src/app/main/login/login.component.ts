import { Component, ViewEncapsulation } from '@angular/core';

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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  //encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  userid: string = '';
  password: string = '';
  error: string = '';

  safetyMessages = [
    'Safety first, always.',
    'Stay alert, stay safe.',
    'Think before you act.',
    'Use protective gear at all times.',
    'Report unsafe conditions immediately.',
    'Keep your work area clean and organized.',
    'Never take shortcuts on safety.',
    'Follow safety rules strictly.',
    'Your safety is your responsibility.',
    'Stop and think before starting work.',

    'Wear helmets and safety shoes.',
    'Avoid distractions while working.',
    'Check tools before use.',
    'Keep emergency exits clear.',
    'Know your safety procedures.',
    'Safety is a habit, not an act.',
    'Lift with care to avoid injury.',
    'Turn off power before maintenance.',
    'Stay focused on the task.',
    'Secure loose clothing and hair.',

    'Machine guards save lives.',
    'Don’t bypass safety devices.',
    'Work safely or not at all.',
    'Be aware of your surroundings.',
    'Use the right tool for the job.',
    'Take breaks to avoid fatigue.',
    'No safety, no work.',
    'Safety starts with awareness.',
    'Inspect equipment regularly.',
    'Communicate hazards clearly.',

    'Keep hands clear of moving parts.',
    'Don’t overload equipment.',
    'Maintain proper posture.',
    'Avoid horseplay in the workplace.',
    'Follow lockout-tagout procedures.',
    'Drink water and stay hydrated.',
    'Plan your work safely.',
    'Stay calm in emergencies.',
    'Know first aid basics.',
    'Use handrails on stairs.',

    'Don’t run in work areas.',
    'Store materials safely.',
    'Label hazardous substances.',
    'Use fire extinguishers correctly.',
    'Report near-miss incidents.',
    'Sharp tools need careful handling.',
    'Electrical safety saves lives.',
    'Avoid wet floors.',
    'Wear gloves when required.',
    'Protect your eyes from hazards.',

    'Check weather conditions before outdoor work.',
    'Work with a safety buddy when needed.',
    'Fix unsafe acts immediately.',
    'Follow traffic rules on site.',
    'Keep aisles and walkways clear.',
    'Don’t work under suspended loads.',
    'Safety training saves lives.',
    'Stay within your limits.',
    'Be prepared for emergencies.',
    'Safety begins with you.',

    'Use seatbelts in vehicles.',
    'Don’t use damaged equipment.',
    'Keep fire exits accessible.',
    'Watch out for slip and trip hazards.',
    'Avoid toxic fumes and gases.',
    'Use masks when needed.',
    'Don’t smoke in restricted areas.',
    'Stay safe, go home safe.',
    'Safety is teamwork.',
    'Take responsibility for your safety.',

    'Always follow standard operating procedures.',
    'Check alarms and warning signs.',
    'Respect safety signs.',
    'Practice emergency drills.',
    'Safety is a daily commitment.',
    'Don’t ignore safety warnings.',
    'Think safe, work safe.',
    'Protect your coworkers.',
    'Prevent accidents before they happen.',
    'A safe job is a well-done job.',
  ];
  safetyMessageIndex: number = 0;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // {{ safetyMessages[safetyMessageIndex] }}
    this.safetyMessageIndex = Math.floor(
      Math.random() * this.safetyMessages.length
    );

    setInterval(() => {
      this.safetyMessageIndex = Math.floor(
        Math.random() * this.safetyMessages.length
      );
    }, 5000);
  }

  login() {
    if (!this.userid || !this.password) {
      this.error = 'Enter user id & password';
      return;
    }

    this.userService
      .login({ USER_ID: this.userid, PASSWORD: this.password })
      .subscribe(
        (resp: any) => {
          if (resp && resp['STATUS'] === 1) {
            // Save the logged-in user
            this.auth.login(resp.USER_ID);

            // Navigate to operation
            this.router.navigate(['/operation']);
          } else {
            this.error = 'Invalid credentials';
          }
        },
        (err) => {
          this.snackBar.open(err.error, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
          });

          this.error = 'Login failed';
        }
      );
  }
}
