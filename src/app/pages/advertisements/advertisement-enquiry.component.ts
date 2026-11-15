import {Component,ViewChild,ElementRef,Input,inject,DestroyRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subscription,timeout} from 'rxjs';
import {AD_TIERS} from '../../content/ad-tiers';
import {AdPricing,normalizeAdPricing} from '../../content/ad-pricing';
import {HomepageService} from '../../services/homepage.service';
@Component({standalone:true,selector:'app-advertisement-enquiry',templateUrl:'./advertisement-enquiry.component.html',styleUrls:['./advertisement-enquiry.component.scss']})
export class AdvertisementEnquiryComponent {
 readonly tiers=AD_TIERS;readonly email='udupidarshan88@gmail.com';@ViewChild('growDialog') growDialog?:ElementRef<HTMLDialogElement>;
 @Input() pricing?:AdPricing;@Input() usePublishedPricing=true;
 private home=inject(HomepageService);private destroy=inject(DestroyRef);private request?:Subscription;
 private publishedPricing=normalizeAdPricing();loading=false;error='';
 get prices(){return normalizeAdPricing(this.pricing??this.publishedPricing);}
 open(){this.growDialog?.nativeElement.showModal();if(!this.usePublishedPricing)return;this.cancelRequest();this.loading=true;this.error='';this.publishedPricing=normalizeAdPricing();
  this.request=this.home.pricing().pipe(timeout(10000),takeUntilDestroyed(this.destroy)).subscribe({next:prices=>{this.publishedPricing=prices;this.loading=false;},error:()=>{this.loading=false;this.error='Pricing is temporarily unavailable. Contact us for current prices.';}});
 }
 cancelRequest(){this.request?.unsubscribe();this.loading=false;}
 close(){this.growDialog?.nativeElement.close();this.cancelRequest();}
}
