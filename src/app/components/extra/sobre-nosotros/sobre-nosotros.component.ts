import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sobre-nosotros',
  imports: [],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {

  constructor(
    private router: Router
  ) { }

  navigateToCartas() {
    this.router.navigate(['/cartas']);
  }

}
