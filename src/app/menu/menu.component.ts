import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private router: Router) {}  // Inyección de Router en MenuComponent

  isMenuVisible = true; // Controla si el menú está visible o no

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateToHome() {
    this.router.navigate(['/home']).then((success: any) => {
    });
  }

  navigateToProductos() {
     // Fuerza la recarga del componente navegando a una ruta "diferente" temporalmente
  this.router.navigateByUrl('/productos', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/productos']);
  });
  }

  navigateToClientes() {
    this.router.navigate(['/clientes']).then((success: any) => {
    });
  }

  navigateToVentas() {
    this.router.navigate(['/ventas']).then((success: any) => {
    });
  }

  navigateToUsuarios() {
    this.router.navigate(['/usuarios']).then((success: any) => {
    });
  }
}
