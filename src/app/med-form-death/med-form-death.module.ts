import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this line

import { MedFormDeathRoutingModule } from './med-form-death-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule, 
    MedFormDeathRoutingModule
  ],
  providers: []
})
export class MedFormDeathModule { }
