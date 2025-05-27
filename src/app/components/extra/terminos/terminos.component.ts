import { Component } from '@angular/core';

@Component({
  selector: 'app-terminos',
  imports: [],
  templateUrl: './terminos.component.html',
  styleUrl: './terminos.component.css'
})
export class TerminosComponent {

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
  }

  getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

}
