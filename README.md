# ngx-translate-array

[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license-url]

A modification of ngx-translate's TranslatePipe that can provide multiple translations at once.

## Installation

To install this library, run:

```bash
$ npm install ngx-translate-array --save
```

## Usage

### Import `TranslateArrayModule`.

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

### Use `translateArray` pipe in a template to translate an array of strings.

```typescript
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
```

In app.component.html:
```html
{{ (fruitKeys | translateArray).join(' | ') }}
```

## License

MIT © [b4rd](mailto:jakk87@gmail.com)

[npm-url]: https://www.npmjs.com/package/ngx-translate-array

[npm-version-image]: https://badge.fury.io/js/ngx-translate-array.svg

[license-image]: https://img.shields.io/npm/l/express.svg?style=flat

[license-url]: LICENSE

[ngx-translate-url]: https://github.com/ngx-translate/core
