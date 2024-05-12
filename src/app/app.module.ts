import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MedFormDeathComponent } from './med-form-death/med-form-death.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { FormFooterComponent } from './form-footer/form-footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { FileImportComponent } from './file-import/file-import.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { AngularCryptoModule } from 'angular-crypto-js';

// import { SQLiteModule } from 'angular-sqlite/angular-sqlite'; 

@NgModule({
  declarations: [
    AppComponent,
    MedFormDeathComponent,
    FormHeaderComponent,
    FormFooterComponent,
    FileImportComponent,
    DashboardComponent,
    LoginPageComponent,
   


  ],
  imports: [
    BrowserModule,  
    HttpClientModule, 
    AppRoutingModule,
    FormsModule,
    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // AngularCryptoModule,
        
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
