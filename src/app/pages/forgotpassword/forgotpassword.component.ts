import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  isOtpSent = false;
  constructor() { }

  ngOnInit(): void {
  }

  sendOtp(): void {
    this.isOtpSent = true;
  } 

  validateOtp(): void { 
    this.isOtpSent = false;
  } 

}
