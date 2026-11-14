import {Component,ViewChild,ElementRef} from '@angular/core';
import {AD_TIERS} from '../../content/ad-tiers';
@Component({standalone:true,selector:'app-advertisement-enquiry',templateUrl:'./advertisement-enquiry.component.html',styleUrls:['./advertisement-enquiry.component.scss']})
export class AdvertisementEnquiryComponent {
 readonly tiers=AD_TIERS;readonly email='Udupidarshan@gmail.com';@ViewChild('growDialog') growDialog?:ElementRef<HTMLDialogElement>;
 open(){this.growDialog?.nativeElement.showModal();}close(){this.growDialog?.nativeElement.close();}
}
