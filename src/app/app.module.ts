import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaygameComponent } from './playgame/playgame.component';

import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    PlaygameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,
    useClass : DataService,
    multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
