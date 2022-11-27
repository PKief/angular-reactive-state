import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StateDevToolsModule } from 'angular-state/state-dev-tools.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, StateDevToolsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
