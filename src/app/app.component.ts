import { Component, OnInit } from '@angular/core';
import { DataService } from './data-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MedicalCertificateOfCauseOfDeath';
  
  constructor(private dataService: DataService) {}

  ngOnInit() {
    // this.dataService.checkAndUpdateData();
    // this.dataService.checkAndUpdateFacilityData(localStorage.getItem('selectedFacilityId'));
  }
}

