import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from RxJS

@Injectable({
  providedIn: 'root'
})
export class JsonParserService {
  private apiUrl = 'https://jsonparser.onrender.com/handle-api/send-data/'; 
  // private apiUrl = 'http://localhost:3000/handle-api/send-data/'; 
  // private apiUrl = 'http://localhost:3000/api/data/parseJSON';

  constructor(private http: HttpClient) { }

  sendData(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'Basic ' + btoa('admin:Nomisr123$$') // Replace with your username and password
      
    });
    
    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}
