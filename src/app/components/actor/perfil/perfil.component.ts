import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Actor } from '../../../model/Actor';
import { Admin } from '../../../model/Admin';
import { Usuario } from '../../../model/Usuario';
import { ActorService } from '../../../service/actor.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { environment } from '../../../../environments/environment';

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

  // Backup modal properties
  showBackupModal: boolean = false;
  backupLoading: boolean = false;
  backupFile: Blob | null = null;
  backupError: string | null = null;

  // Dependency scanning properties
  scanningDependencies: boolean = false;

  constructor(
    private actorService: ActorService,
    private adminService: AdminService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.token && this.token.length > 0) {
      this.showProfile();
    }
  }

  showProfile() {
    this.actorService.userLogin().subscribe({
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

  editProfile() {
    this.router.navigate(['/perfil/editar']);
  }

  viewOrders() {
    this.router.navigate(['/mispedidos']);
  }

  gestionarProductos() {
    this.router.navigate(['/productosadmin']);
  }

  backupDatabase() {
    this.showBackupModal = true;
    this.backupLoading = true;
    this.backupFile = null;
    this.backupError = null;

    // Make direct HTTP call with Blob response type
    const token = sessionStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    this.http.get(`${environment.apiUrl}/admin/backupbd`, {
      headers: headers,
      responseType: 'blob'
    }).subscribe({
      next: (response: Blob) => {
        this.backupFile = response;
        this.backupLoading = false;
      },
      error: (error) => {
        console.error('Error al crear la copia de seguridad:', error);
        this.backupError = error.message || 'Error desconocido al crear la copia de seguridad';
        this.backupLoading = false;
      }
    });
  }

  downloadBackup() {
    if (this.backupFile && this.backupFile instanceof Blob) {
      try {
        const url = window.URL.createObjectURL(this.backupFile);
        const link = document.createElement('a');
        link.href = url;
        
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        link.download = `backup_database_${dateString}.sql`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.closeBackupModal();
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        this.backupError = 'Error al descargar el archivo';
      }
    } else {
      console.error('No hay archivo válido para descargar');
      this.backupError = 'No hay archivo válido para descargar';
    }
  }

  closeBackupModal() {
    this.showBackupModal = false;
    this.backupLoading = false;
    this.backupFile = null;
    this.backupError = null;
  }

  retryBackup() {
    this.backupDatabase();
  }

  scanDependencies() {
    this.scanningDependencies = true;

    this.adminService.generateDependencyReport().subscribe({
      next: (response: any) => {
        this.scanningDependencies = false;
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response);
          newWindow.document.close();
        } else {
          console.error('No se pudo abrir una nueva pestaña. Verifique que los pop-ups estén permitidos.');
          alert('No se pudo abrir una nueva pestaña. Verifique que los pop-ups estén permitidos.');
        }
      },
      error: (error) => {
        console.error('Error al generar el reporte de dependencias:', error);
        this.scanningDependencies = false;
        alert('Error al generar el reporte de dependencias. Intente nuevamente.');
      }
    });
  }
}
