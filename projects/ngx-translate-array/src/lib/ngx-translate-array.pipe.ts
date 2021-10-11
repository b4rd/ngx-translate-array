import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isObservable, Subscription } from 'rxjs';
import { equals, isDefined } from './util';
import { LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

@Injectable()
@Pipe({
  name: 'translateArray',
  pure: false // required to update the value when the promise is resolved
})
export class TranslateArrayPipe implements PipeTransform, OnDestroy {
  private values: string[] = [];
  private lastKeys: string[] | null = null;
  private lastParams: any[] = [];
  private onTranslationChange?: Subscription;
  private onLangChange?: Subscription;
  private onDefaultLangChange?: Subscription;

  constructor(private translate: TranslateService, private changeDetectorRef: ChangeDetectorRef) {
  }

  updateValue(keys: string[], interpolateParams?: object, translations?: any): void {
    const onTranslation = (res: string[]) => {
      this.values = res !== undefined ? Object.values(res) : keys;
      this.lastKeys = keys;
      this.changeDetectorRef.markForCheck();
    };
    if (translations) {
      const res = this.translate.getParsedResult(translations, keys, interpolateParams);
      if (isObservable(res.subscribe)) {
        res.subscribe(onTranslation);
      } else {
        onTranslation(res);
      }
    }
    this.translate.get(keys, interpolateParams).subscribe(onTranslation);
  }

  transform(query: string[], ...args: any[]): string[] {
    if (!Array.isArray(query) || query.length === 0) {
      return query;
    }

    // if we ask another time for the same keys, return the last value
    if (equals(query, this.lastKeys) && equals(args, this.lastParams)) {
      return this.values;
    }

    let interpolateParams = {};
    if (isDefined(args[0]) && args.length) {
      if (typeof args[0] === 'string' && args[0].length) {
        // we accept objects written in the template such as {n:1}, {'n':1}, {n:'v'}
        // which is why we might need to change it to real JSON objects such as {"n":1} or {"n":"v"}
        const validArgs: string = args[0]
          .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
          .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          throw new SyntaxError(`Wrong parameter in TranslateArrayPipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
    }

    // store the query, in case it changes
    this.lastKeys = query;

    // store the params, in case they change
    this.lastParams = args;

    // set the value
    this.updateValue(query, interpolateParams);

    // if there is a subscription to onLangChange, clean it
    this._dispose();

    // subscribe to onTranslationChange event, in case the translations change
    if (!this.onTranslationChange) {
      this.onTranslationChange = this.translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
        if (this.lastKeys && event.lang === this.translate.currentLang) {
          this.lastKeys = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        if (this.lastKeys) {
          this.lastKeys = null; // we want to make sure it doesn't return the same values until it's been updated
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    // subscribe to onDefaultLangChange event, in case the default language changes
    if (!this.onDefaultLangChange) {
      this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
        if (this.lastKeys) {
          this.lastKeys = null; // we want to make sure it doesn't return the same values until it's been updated
          this.updateValue(query, interpolateParams);
        }
      });
    }

    return this.values;
  }

  /**
   * Clean any existing subscription to change events
   */
  private _dispose(): void {
    if (typeof this.onTranslationChange !== 'undefined') {
      this.onTranslationChange.unsubscribe();
      this.onTranslationChange = undefined;
    }
    if (typeof this.onLangChange !== 'undefined') {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
    if (typeof this.onDefaultLangChange !== 'undefined') {
      this.onDefaultLangChange.unsubscribe();
      this.onDefaultLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this._dispose();
  }
}
