import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminserviceService } from 'src/app/services/adminservice.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  isOtpSent = false;
  constructor(private router:Router, private adminservice:AdminserviceService) { }

  ngOnInit(): void {
  }

  sendOtp(): void {
    this.isOtpSent = true;
  this.adminservice.sendOtp().subscribe((data:any) => {
      console.log(data);
    });
  } 

  validateOtp(): void { 
    this.isOtpSent = false;
    this.router.navigate(['/admindashboard']);
  } 

}
