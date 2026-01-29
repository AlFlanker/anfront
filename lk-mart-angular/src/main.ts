import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu); // Регистрация локализации дат
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
