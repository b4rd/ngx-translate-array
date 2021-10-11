import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fruitKeys = ['APPLE', 'BANANA', 'ORANGE', 'PINEAPPLE'];

  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('es');
  }
}
