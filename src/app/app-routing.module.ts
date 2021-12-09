import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// importando los componentes 
import {LoginComponent} from './vistas/login/login.component';
import { NuevoComponent } from './vistas/nuevo/nuevo.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';
import { EditarComponent } from './vistas/editar/editar.component';
import { UsuariosComponent } from './vistas/usuarios/usuarios.component';
import { ClientesComponent } from './vistas/clientes/clientes.component';
import { ProductosComponent } from './vistas/productos/productos.component';
import { ProveedoresComponent } from './vistas/proveedores/proveedores.component';
import { ReportesComponent } from './vistas/reportes/reportes.component';
import { VentasComponent } from './vistas/ventas/ventas.component';
import { ConsolidadoComponent } from './vistas/consolidado/consolidado.component'

//declarando las rutas las rutas 
const routes: Routes = [
  {path:'' , redirectTo: 'login' , pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path: 'nuevo', component: NuevoComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'editar', component: EditarComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'productos', component: ProductosComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: 'ventas', component: VentasComponent},
  {path: 'consolidado', component: ConsolidadoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//exportando las componentes 
export const routingComponents = [LoginComponent,DashboardComponent,NuevoComponent,
  EditarComponent,UsuariosComponent,ClientesComponent,ProductosComponent,ProveedoresComponent,
  ReportesComponent, VentasComponent, ConsolidadoComponent]
