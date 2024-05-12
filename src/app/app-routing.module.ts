import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedFormDeathComponent } from './med-form-death/med-form-death.component';

// import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginPageComponent } from './login-page/login-page.component';


const routes: Routes = [
  {path: 'MCCOD-login', component:LoginPageComponent},
  // {path: 'dashboard', component: DashboardComponent},
  {path: 'MedicalCertificateOfCauseOfDeath', component: MedFormDeathComponent},  
  {path: '', redirectTo: '/MedicalCertificateOfCauseOfDeath', pathMatch: 'full'},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
