import { Component } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config.interface';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  config: Config | undefined;

  constructor(private configService: ConfigService) {}

  showConfig() {
    this.configService.getConfig()
      .subscribe(data => this.config = data);
  }
}
