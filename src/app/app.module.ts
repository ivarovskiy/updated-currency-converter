import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//primeNg components

import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { AppComponent } from './app.component';
import { InputComponent } from './components/input/input.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonComponent } from './components/button/button.component';
import { CurrencyInputComponent } from './components/currency-input/currency-input.component';
import { HeaderComponent } from './containers/header/header.component';
import { MainComponent } from './containers/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    DropdownComponent,
    ButtonComponent,
    CurrencyInputComponent,
    HeaderComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeyFilterModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    InputTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
