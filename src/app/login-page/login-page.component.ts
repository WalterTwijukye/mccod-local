// login-page.component.ts
import { Component } from '@angular/core';
import { IndexeddbService } from '../indexeddb.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  facilities: string[] = ['Facility 1', 'Facility 2', 'Facility 3']; // Dummy facility options
  selectedFacility!: string;

  userData = {
    username: '',
    password: '',
  }
  constructor(private indexedDbService: IndexeddbService) { }

  onFacilityChange(event: any): void {
    this.selectedFacility = event.target.value;
  }

  registerUser(f: NgForm): void {
    // const userData = {
    //   username: username,
    //   password: password
    //   // facility: this.selectedFacility
    // };

    this.indexedDbService.addUser(this.userData)
      .then(response => console.log(response))
      .catch(error => console.error(error));
  }

  loginUser(username: string, password: string): void {
    // Check if user exists in the database
    this.indexedDbService.getUserByUsername(username)
      .then(user => {
        if (user && user.password === password) {
          // User exists and password matches, navigate to medical form page or perform any other action
          console.log('Login successful!');
        } else {
          // User does not exist or password is incorrect
          console.error('Wrong username or password');
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  }
}
