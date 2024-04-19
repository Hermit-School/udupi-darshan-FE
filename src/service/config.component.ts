import { Component } from '@angular/core';
import { Config, ConfigService } from './config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
 
  error: any;
  config: Config | null = null;;
  headers: string[] = [];

  constructor(private configService: ConfigService) {}

  clear() {
    this.config = null;
    this.error = undefined;
    this.headers = [];
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe(data => {
          console.log(data); // Check the structure and value of the data received
          
          // Convert the date string to a Date object
          const date = data.date ? new Date(data.date) : null;
  
          this.config = {
              heroesUrl: data.heroesUrl,
              textfile: data.textfile,
              date: date,
          };
          console.log(this.config); 
      });
  }
  

  getType(val: any): string {
    return val instanceof Date ? 'date' : Array.isArray(val) ? 'array' : typeof val;
  }
}
