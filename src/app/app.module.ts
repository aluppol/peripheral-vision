import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsToTimePipe } from './lib/pipes/timePipe';
import { PlayComponent } from './lib/svg/play/play.component';
import { StopComponent } from './lib/svg/stop/stop.component';
import { ZoomInComponent } from './lib/svg/zoom-in/zoom-in.component';
import { ZoomOutComponent } from './lib/svg/zoom-out/zoom-out.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    StopComponent,
    MsToTimePipe,
    ZoomInComponent,
    ZoomOutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
