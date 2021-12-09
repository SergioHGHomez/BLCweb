import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './plantillas/header/header.component';
import { FooterComponent } from './plantillas/footer/footer.component';

// para el manejo de formularios 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { VentasComponent } from './vistas/ventas/ventas.component';
// import { ConsolidadoComponent } from './vistas/consolidado/consolidado.component';

// se declaron los componentes 
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    routingComponents,
    // VentasComponent,
    // ConsolidadoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
