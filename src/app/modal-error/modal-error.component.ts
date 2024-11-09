import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css'
})
export class ModalErrorComponent {
  @Input() errorMessage: string = '';  // Mensaje de error a mostrar
  isVisible: boolean = false;  // Controla si el modal está visible

  showError(message: string) {
    this.errorMessage = message;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
