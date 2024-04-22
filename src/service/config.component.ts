import { Component,OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config.interface';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public config: Config[] = [];

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getConfig()
      .subscribe(data => this.config = data);
  }
}
