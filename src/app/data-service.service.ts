
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { IndexeddbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private apiUrl = 'https://ug.sk-engine.cloud/hmis/api/events.json?ou=FvewOonC8lS&fields=event&paging=false';
  private checkInterval = 10 * 60 * 1000; // 5 minutes

  constructor(
    private http: HttpClient,
    private indexeddbService: IndexeddbService,
    
  ) {
    this.checkAndUpdateData();
    setInterval(() => this.checkAndUpdateData(), this.checkInterval);
  }

  getTopCausesOfDeath(filter: string): Observable<any[]> {
    // Static dummy data for demonstration
    const dummyData = [
      { cause: 'Heart Disease', deaths: 500 },
      { cause: 'Stroke', deaths: 400 },
      { cause: 'Cancer', deaths: 300 },
      { cause: 'Accidents', deaths: 200 },
      { cause: 'Diabetes', deaths: 150 },
      { cause: 'Alzheimer\'s Disease', deaths: 100 },
      { cause: 'Influenza and Pneumonia', deaths: 80 },
      { cause: 'Kidney Disease', deaths: 70 },
      { cause: 'Suicide', deaths: 60 },
      { cause: 'Chronic Lower Respiratory Diseases', deaths: 50 },
      { cause: 'Liver Disease', deaths: 40 },
      { cause: 'Hypertension', deaths: 30 },
      { cause: 'Parkinson\'s Disease', deaths: 20 },
      { cause: 'Pneumonitis', deaths: 15 },
      { cause: 'HIV/AIDS', deaths: 10 },
      { cause: 'Septicemia', deaths: 5 },
      { cause: 'Homicide', deaths: 3 },
      { cause: 'Tuberculosis', deaths: 2 },
      { cause: 'Syphilis', deaths: 1 },
      { cause: 'Malaria', deaths: 1 }
    ];

    // Applying the filter (for demonstration purposes)
    // You can replace this with actual filtering logic based on the filter parameter
    let filteredData = dummyData;
    if (filter === 'Gender') {
      // Apply filter logic for gender
    } else if (filter === 'Deaths for mortality') {
      // Apply filter logic for deaths for mortality
    }

    // Sort data by deaths in descending order
    filteredData = filteredData.sort((a, b) => b.deaths - a.deaths);

    // Return the filtered and sorted data
    return of(filteredData.slice(0, 20)); // Return only top 20 causes
  }

  async checkAndUpdateFacilityData(selectedFacilityId: string) {

    // const selectedFacilityId = '' //this.medFormDeathComponent.selectedFacilityId;
    // private apiUrl = 'https://jsonparser.onrender.com/handle-api/generate-data'
    // const apiUrl = `http://localhost:3000/handle-api/generate-data/${selectedFacilityId}`
    const apiUrl = `https://jsonparser.onrender.com/handle-api/generate-data/${selectedFacilityId}`;
    try {
      const apiData = await this.http.get<any[]>(apiUrl).toPromise();

      if (apiData && apiData.length > 0) {
        // Iterate over each event from the API data
        for (const event of apiData) {
          // // Check if the event exists in IndexedDB
          // const existingEvent = await this.indexeddbService.getEventById(event.id);

          // // If the event doesn't exist, save it to IndexedDB
          // if (!existingEvent) {
          await this.indexeddbService.addEvent(event);
          // }
        }

        console.log('Events updated successfully.');
      } else {
        console.warn('API data is empty or undefined.');
      }
    } catch (error) {
      console.error('Error fetching or updating data:', error);
    }
  }

  private async checkAndUpdateData() {
    const selectedFacilityId = ''; // Replace with logic to get selectedFacilityId
    await this.checkAndUpdateFacilityData(selectedFacilityId);
  }

}


