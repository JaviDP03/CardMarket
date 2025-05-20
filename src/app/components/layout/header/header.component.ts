import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  mobileMenuOpen = false;
  
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
