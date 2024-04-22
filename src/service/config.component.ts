import { Component } from '@angular/core';
import { ConfigService, Data, Glossary, GlossDiv, GlossList, GlossEntry } from './config.service';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  error: any;
  config: Data | null = null;
  headers: string[] = [];
  configData: { label: string, value: string }[] = [];

  constructor(private configService: ConfigService) {}

  clear() {
    this.config = null;
    this.error = undefined;
    this.configData = [];
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Data) => {
        console.log(data); // Check the structure and value of the data received
        this.config = data;

        // Prepare the data for vertical display
        this.configData = [
          { label: 'Glossary Title', value: this.config.glossary.title },
          { label: 'Gloss Div Title', value: this.config.glossary.GlossDiv.title },
          { label: 'Gloss Entry ID', value: this.config.glossary.GlossDiv.GlossList.GlossEntry.ID },
          { label: 'Gloss Term', value: this.config.glossary.GlossDiv.GlossList.GlossEntry.GlossTerm },
          { label: 'Gloss Abbrev', value: this.config.glossary.GlossDiv.GlossList.GlossEntry.Abbrev },
          { label: 'Gloss Def Para', value: this.config.glossary.GlossDiv.GlossList.GlossEntry.GlossDef.para },
          // Add more fields as needed
        ];
      });
  }


  getType(val: any): string {
    return val instanceof Date ? 'date' : Array.isArray(val) ? 'array' : typeof val;
  }
}
