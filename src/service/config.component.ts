import { Component } from '@angular/core';
import { ConfigService, Data, Glossary } from './config.service';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  error: any;
  config: Data | null = null;
  headers: string[] = [];

  constructor(private configService: ConfigService) {}

  clear() {
    this.config = null;
    this.error = undefined;
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Data) => {
        console.log(data); // Check the structure and value of the data received
        
        // Access 'title' property from 'Glossary'
        const title: string = data.glossary.title;
        console.log(title); // Check if title is retrieved correctly

        this.config = data;
      });
  }

  getType(val: any): string {
    return val instanceof Date ? 'date' : Array.isArray(val) ? 'array' : typeof val;
  }
}
