// facility.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacilityData } from './facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  url = 'assets/MasterFacility.json';

  constructor(private http: HttpClient) {}

  getFacilities(): Promise<FacilityData> {
    return this.http.get<FacilityData>(this.url)
      .toPromise()
      .then((data: FacilityData | undefined) => {
        if (data) {
          return data;
        } else {
          // Handle the case where data is undefined, such as throwing an error or returning a default value
          throw new Error('Failed to fetch facility data');
        }
      })
      .catch(error => {
        // Handle any errors that occur during the HTTP request
        console.error('Error fetching facility data:', error);
        throw error; // You can choose to handle the error differently if needed
      });
  }
}
