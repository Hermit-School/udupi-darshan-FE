import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, inject, DestroyRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, timeout } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';
const PATHS={nature:'/nature/deleteNature/',culture:'/culture/deleteCulture/',food:'/food/deleteFood/',story:'/blogs/deleteBlogs/'};
@Component({selector:'app-delete-record',standalone:true,templateUrl:'./delete-record.component.html',styleUrls:['./delete-record.component.scss']})
export class DeleteRecordComponent {
 @Input() kind: string = '';
 @Input() id=0;
 @Input() name='this record';
 @Input() disabled=false;
 @Output() deleted=new EventEmitter<void>();
 @ViewChild('confirmation') confirmation!:ElementRef<HTMLDialogElement>;
 private http=inject(HttpClient);
 private destroy=inject(DestroyRef);
 busy=false; error='';
 open(){if(this.disabled||this.busy||!Object.hasOwn(PATHS,this.kind)||!Number.isSafeInteger(this.id)||this.id<=0)return;this.error='';this.confirmation.nativeElement.showModal();}
 cancel(){if(!this.busy)this.confirmation.nativeElement.close();}
 remove(){
  if(this.busy||this.disabled||!Object.hasOwn(PATHS,this.kind))return;
  this.busy=true;this.error='';
  this.http.delete(API_BASE_URL+'/v1'+PATHS[this.kind as keyof typeof PATHS]+this.id)
   .pipe(timeout(20000),takeUntilDestroyed(this.destroy),finalize(()=>this.busy=false))
   .subscribe({next:()=>this.finish(),error:(error:unknown)=>{
    if(error instanceof HttpErrorResponse&&error.status===404){this.finish();return;}
    this.error='Deletion could not be confirmed. Retry or close this dialog and reload the records.';
   }});
 }
 private finish(){this.confirmation.nativeElement.close();this.deleted.emit();}
}
