import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';

// script component
import { ScriptComponent } from './script/script/script.component'; // Assure-toi que le chemin est correct
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    SharedModule, 
    BrowserAnimationsModule, 
    HttpClientModule,
    ScriptComponent // Ici, tu importes ScriptComponent au lieu de le déclarer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
