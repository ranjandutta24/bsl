import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './report/service.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'operation', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report', component: ServiceComponent },
  { path: 'settings', component: SettingsComponent },

  // { path: '**', component: NotFoundComponent },     // wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
