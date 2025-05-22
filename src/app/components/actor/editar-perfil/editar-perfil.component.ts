import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActorService } from '../../../service/actor.service';
import { AdminService } from '../../../service/admin.service';
import { UsuarioService } from '../../../service/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css'
})
export class EditarPerfilComponent {
  currentUser: any;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  profileForm!: FormGroup;
  
  // Avatar related properties
  avatarUrl: string | null = null;
  showAvatarModal: boolean = false;
  newAvatarUrl: string = '';
  isPreviewError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private actorService: ActorService,
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.actorService.userLogin().subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
          this.isAdmin = user.rol === 'ADMIN';
          
          // Load additional user data if needed
          if (this.isAdmin) {
            this.adminService.getAdminById(user.id).subscribe({
              next: (adminData) => {
                // Merge admin data with current user if needed
                this.populateForm();
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error getting admin data:', error);
                this.isLoading = false;
              }
            });
          } else {
            this.usuarioService.getUsuarioById(user.id).subscribe({
              next: (userData) => {
                // Merge regular user data with current user if needed
                if (userData) {
                  this.currentUser = { ...this.currentUser, ...userData };
                }
                this.populateForm();
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error getting user data:', error);
                this.isLoading = false;
              }
            });
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error getting current user:', error);
        this.isLoading = false;
      }
    });
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      fechaNacimiento: [''],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      direcciones: this.fb.array([])
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si ambos campos están vacíos, no necesitamos validar
    if ((!password?.value || password.value === '') && 
        (!confirmPassword?.value || confirmPassword.value === '')) {
      return null;
    }
    
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true }
      : null;
  }

  private populateForm(): void {
    if (!this.currentUser) {
      this.isLoading = false;
      return;
    }

    this.profileForm.patchValue({
      nombreUsuario: this.currentUser.nombreUsuario,
      nombre: this.currentUser.nombre,
      apellido: this.currentUser.apellido,
      email: this.currentUser.email
    });

    // Set avatar URL if it exists
    this.avatarUrl = this.currentUser.avatarUrl || null;

    if (!this.isAdmin) {
      this.profileForm.patchValue({
        telefono: this.currentUser.telefono || '',
        fechaNacimiento: this.currentUser.fechaNacimiento ? 
          new Date(this.currentUser.fechaNacimiento).toISOString().split('T')[0] : ''
      });

      // Cargar direcciones
      if (this.currentUser.direcciones && this.currentUser.direcciones.length > 0) {
        // Clear existing array items first
        while (this.direcciones.length) {
          this.direcciones.removeAt(0);
        }
        
        this.currentUser.direcciones.forEach((dir: any) => {
          this.direcciones.push(this.createDireccionFormGroup(dir));
        });
      }
    }
    
    // Ensure loading state is cleared when form is populated
    this.isLoading = false;
  }

  get direcciones(): FormArray {
    return this.profileForm.get('direcciones') as FormArray;
  }

  createDireccionFormGroup(direccion: any = {}): FormGroup {
    return this.fb.group({
      direccion: [direccion.direccion || '', Validators.required],
      codigoPostal: [direccion.codigoPostal || '', Validators.required],
      ciudad: [direccion.ciudad || '', Validators.required],
      provincia: [direccion.provincia || '', Validators.required],
      pais: [direccion.pais || '', Validators.required]
    });
  }

  addNewAddress(): void {
    this.direcciones.push(this.createDireccionFormGroup());
  }

  removeAddress(index: number): void {
    this.direcciones.removeAt(index);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    
    this.isSubmitting = true;
    const formData = { ...this.profileForm.value };
    
    // Si no se está cambiando la contraseña, eliminar los campos relacionados
    if (!formData.password) {
      delete formData.password;
      delete formData.confirmPassword;
    } else {
      delete formData.confirmPassword; // No enviar la confirmación
    }

    // Add avatar URL to form data if exists
    if (this.avatarUrl) {
      formData.avatarUrl = this.avatarUrl;
    }
    
    const updateMethod = this.isAdmin ? 
      this.adminService.updateAdmin(formData) : 
      this.usuarioService.updateUsuario(formData)

    updateMethod.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/perfil'], { queryParams: { updated: true }});
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isSubmitting = false;
        // Aquí podrías agregar un mensaje de error para mostrar al usuario
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/perfil']);
  }

  // Avatar modal methods
  openAvatarModal(): void {
    this.showAvatarModal = true;
    this.newAvatarUrl = this.avatarUrl || '';
    this.isPreviewError = false;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.newAvatarUrl = '';
  }

  saveAvatar(): void {
    if (this.newAvatarUrl && !this.isPreviewError) {
      this.avatarUrl = this.newAvatarUrl;
      this.closeAvatarModal();
    }
  }

  // Method to check if image URL is valid
  checkImageUrl(url: string): void {
    if (!url) {
      this.isPreviewError = false;
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.isPreviewError = false;
    };
    img.onerror = () => {
      this.isPreviewError = true;
    };
    img.src = url;
  }

  // Watch for changes in the avatar URL input
  ngDoCheck(): void {
    if (this.showAvatarModal && this.newAvatarUrl) {
      this.checkImageUrl(this.newAvatarUrl);
    }
  }
}
