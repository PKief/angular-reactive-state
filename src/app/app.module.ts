import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDevTools } from './shared/store/store.dev-tools';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [StoreDevTools],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private devtools: StoreDevTools) {
    this.devtools.init();
  }
}
