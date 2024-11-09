import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-modal-ok',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-ok.component.html',
  styleUrl: './modal-ok.component.css'
})
export class ModalOkComponent {
  @Input() okMessage: string = '';  // Mensaje de error a mostrar
  isVisible: boolean = false;  // Controla si el modal está visible

  showOk(message: string) {
    this.okMessage = message;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
