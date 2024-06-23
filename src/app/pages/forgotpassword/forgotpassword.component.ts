import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  isOtpSent = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  sendOtp(): void {
    this.isOtpSent = true;
  } 

  validateOtp(): void { 
    this.isOtpSent = false;
    this.router.navigate(['/admindashboard']);
  } 

}
