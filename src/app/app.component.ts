import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from './common/common.module';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'senraleigh_service';
}
