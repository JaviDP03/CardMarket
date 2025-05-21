import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actor } from '../../model/Actor';
import { Admin } from '../../model/Admin';
import { Usuario } from '../../model/Usuario';
import { jwtDecode } from 'jwt-decode';
import { ActorService } from '../../service/actor.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  token: string | null = sessionStorage.getItem('token');
  username: string | undefined;
  currentUser: Actor | null = null;
  adminUser: Admin | null = null;
  regularUser: Usuario | null = null;
  isAdmin: boolean = false;
  isLoading: boolean = true;

  constructor(
    private actorService: ActorService,
  ) {
    this.username = jwtDecode(this.token!).sub;
  }

  ngOnInit(): void {
    if (this.token && this.token.length > 0) {
      this.showProfile();
    }
  }

  showProfile() {
    this.actorService.findbyUsername(this.username!).subscribe({
      next: (response) => {
        this.currentUser = response;

        // Determine if user is admin and cast to appropriate type
        if (response.constructor.name === 'Admin' || response.hasOwnProperty('fechaCreacion')) {
          this.isAdmin = true;
          this.adminUser = response as Admin;
        } else {
          this.isAdmin = false;
          this.regularUser = response as Usuario;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener la info del actor:', error);
        this.isLoading = false;
      }
    });
  }
}
