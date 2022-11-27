import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StateDevTools } from './state-dev-tools';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class StateDevToolsModule {
  constructor(private devTools: StateDevTools) {
    this.devTools.init();
  }
}
