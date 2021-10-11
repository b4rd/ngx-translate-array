# ngx-translate-array

[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license-url]

A modification of ngx-translate's TranslatePipe that can provide multiple translations at one.

## Installation

To install this library, run:

```bash
$ npm install ngx-translate-array --save
```

## Usage

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot(),
    TranslateArrayModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

### Initializing

To initialize *ngx-translate* you usually do

```typescript
  import { Component } from '@angular/core';
  import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app',
  template: `
            <div>{{ ['banana', 'orange'] | translateArray }}</div>
        `
})
export class AppComponent {

  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}
```

## License

MIT © [b4rd](mailto:jakk87@gmail.com)

[npm-url]: https://www.npmjs.com/package/ngx-translate-array

[npm-version-image]: https://badge.fury.io/js/ngx-translate-array.svg

[license-image]: https://img.shields.io/npm/l/express.svg?style=flat

[license-url]: LICENSE

[ngx-translate-url]: https://github.com/ngx-translate/core
