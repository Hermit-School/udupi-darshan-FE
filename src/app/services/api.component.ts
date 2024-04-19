import { Component } from '@angular/core';
import {Config,ApicallService} from './apicall.service';

@Component({
    selector:'app-api',
    templateUrl:'./api.component.html',
    styleUrls:['./api.component.css']

})

export class ApiCommponent{
    error:any;
    config:Config | null=null;
    headers:string[]=[];

    constructor(private apicallService: ApicallService ){}
    

    clear(){
        this.config=null;
        this.error=undefined;
        this.headers=[];
    }

    showConfig(){
        this.apicallService.getConfig()
        .subscribe(data=>{
            console.log(data);

            const date=data.date ?new Date(data.date):null;

            this.config={
                heroesUrl:data.heroesUrl,
                textfile:data.textfile,
                date:date,
            };
            console.log(this.config);
        });
    }

getType(val:any):string{
    return val instanceof Date ? 'data' :Array.isArray(val)? 'array':typeof val;
}
}
    
