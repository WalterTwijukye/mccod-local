import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { interval } from 'rxjs';


@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.css']
})
export class FormHeaderComponent implements OnInit {
  
  @Output() internetStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isOnline: boolean = false;
  circleClass: string = '';
  serviceStatus: string = '';

  checkInterntUrl = 'https://jsonparser.onrender.com/check-status/internet-status'
  // checkInterntUrl = 'http://localhost:3000/check-status/internet-status'

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkInternetStatus();
    this.checkServiceStatus(); 

    // Check internet status every 5 seconds
    interval(5000).subscribe(() => {
      this.checkInternetStatus();
      this.checkServiceStatus(); 
    });
  }

  checkInternetStatus(): void {
    const headers = new HttpHeaders().set('API-Version', 'v2');
  
    this.http.get<any>(this.checkInterntUrl).subscribe({
      next: () => {
        this.isOnline = true;
        this.circleClass = 'online';
        console.log('Online');
        this.internetStatusChange.emit(true); // Emit event when online
      },
      error: () => {
        this.isOnline = false;
        this.circleClass = 'offline';
        console.log('Offline');
        this.internetStatusChange.emit(false); // Emit event when offline
      }
    });
  }

  checkServiceStatus(): void {
    this.http.get<any>(`http://localhost:8382/ct`).subscribe({
      next: () => {
        this.serviceStatus = 'Running';
        console.log('Service is Running');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.serviceStatus = 'Running';
          console.log('Service is Running');
        } else {
          this.serviceStatus = 'Stopped';
          console.log('Service is Stopped');
        }
      }
    });
  }
  
}
