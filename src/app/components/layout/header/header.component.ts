import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  isLoggedIn = false;
  token: string | null = sessionStorage.getItem("token");
  username!: any;
  userInitials!: string;
  cartItemCount = 0;

  constructor(
    private router: Router,
  ) {
     if (this.token !== null && this.token) {
      this.isLoggedIn = true;
      this.username = jwtDecode(this.token).sub;
      this.userInitials = this.getUserInitials(this.username);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileDropdown(): void {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  private getUserInitials(name: string): string {
    if (!name) return 'U';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
