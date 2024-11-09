import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from "./usuarios/usuarios.component"
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from "./menu/menu.component";
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, runGuardsAndResolvers:'always'},
  { path: 'productos', component: ProductosComponent, runGuardsAndResolvers:'always' },
  { path: 'clientes', component: ClientesComponent, runGuardsAndResolvers:'always' },
  { path: 'ventas', component: VentasComponent , runGuardsAndResolvers:'always'},
  { path: 'usuarios', component: UsuariosComponent , runGuardsAndResolvers:'always'},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige a /home si no hay ruta
  { path: '**', redirectTo: '/home' } // Redirige a /home si la ruta no coincide
];
