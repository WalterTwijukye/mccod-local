// dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service.service'; // Assuming you have a data service to fetch data
import 'node_modules/bootstrap/';
import { FacilityService } from '../facility.service';
import { IndexeddbService } from '../indexeddb.service';
import { HttpClient } from '@angular/common/http';
import { FacilityData } from '../facility.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalDeceased!: number;
  causesOfDeath!: any[]; // Assuming an array of objects with cause and count properties
  trendData!: any[]; // Assuming an array of objects with date and count properties for trend analysis
  demographicData!: any[]; // Assuming an array of objects with demographic information
  geographicData!: any[]; // Assuming an array of objects with geographic information

  filterOptions: string[] = ['All Diseases', 'Gender', 'Deaths for Mortality'];
  selectedFilter: string = 'All Diseases';
  // graphType: string = 'bar';
  graphData!: any[];

  data!: any[];
  graphType: 'bar' | 'pie' = 'bar'; // Default graph type is bar
  chart: any; // Chart object

  facilities: { id: string, name: string }[] = [];

  dbForm = {
    facility: '',
  }

  constructor(
    private dataService: DataService,
    private indexeddbService: IndexeddbService,
    private facilityService: FacilityService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    // this.fetchGraphData();
    this.fetchData('All Diseases');

    this.facilityService.getFacilities().then((facilityData: FacilityData) => {
      this.facilities = facilityData.organisationUnits;
    });
  }

  // fetchData(): void {
  //   this.dataService.getTotalDeceased().subscribe(total => this.totalDeceased = total);
  //   this.dataService.getCausesOfDeath().subscribe(causes => this.causesOfDeath = causes);
  //   this.dataService.getTrendData().subscribe(trend => this.trendData = trend);
  //   this.dataService.getDemographicData().subscribe(demographic => this.demographicData = demographic);
  //   this.dataService.getGeographicData().subscribe(geographic => this.geographicData = geographic);
  // }

  // fetchGraphData(): void {
  //   this.dataService.getTopCausesOfDeath(this.selectedFilter).subscribe(data => {
  //     this.graphData = data;
  //   });
  // }

  fetchData(filter: string): void {
    this.dataService.getTopCausesOfDeath(filter).subscribe(data => {
      this.data = data;
      this.renderChart();
    });
  }

  switchGraphType(): void {
    this.graphType = this.graphType === 'bar' ? 'pie' : 'bar';
    this.renderChart();
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart instance if it exists
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const labels = this.data.map(item => item.cause);
    const dataValues = this.data.map(item => item.deaths);

    if (this.graphType === 'bar') {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Deaths',
            data: dataValues,
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Bar color
            borderColor: 'rgba(54, 162, 235, 1)', // Border color
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else if (this.graphType === 'pie') {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Deaths',
            data: dataValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            hoverOffset: 4
          }]
        }
      });
    }
  }
  
}
