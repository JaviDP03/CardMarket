import { Component } from '@angular/core';

@Component({
  selector: 'app-politica',
  imports: [],
  templateUrl: './politica.component.html',
  styleUrl: './politica.component.css'
})
export class PoliticaComponent {

    getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
  }

}
