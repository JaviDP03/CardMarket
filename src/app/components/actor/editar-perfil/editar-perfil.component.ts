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
  imagenB64: string | null = null;
  showAvatarModal: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  fileError: string | null = null;
  isConvertingToBase64: boolean = false;

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
      imagenB64: [''],
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
      email: this.currentUser.email,
      imagenB64: this.currentUser.imagenB64 || ''
    });

    // Set avatar URL if it exists
    this.imagenB64 = this.currentUser.imagenB64 || null;

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

    // Avatar URL is now part of the form, no need for separate logic
    // Remove the manual avatar addition since it's now in the form
    
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
    this.selectedFile = null;
    this.previewImage = null;
    this.fileError = null;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.selectedFile = null;
    this.previewImage = null;
    this.fileError = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      this.selectedFile = null;
      this.previewImage = null;
      this.fileError = null;
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.fileError = 'Por favor selecciona un archivo de imagen válido.';
      this.selectedFile = null;
      this.previewImage = null;
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.fileError = 'El archivo es demasiado grande. El tamaño máximo es 5MB.';
      this.selectedFile = null;
      this.previewImage = null;
      return;
    }

    this.selectedFile = file;
    this.fileError = null;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveAvatar(): void {
    if (this.selectedFile && !this.fileError) {
      this.isConvertingToBase64 = true;
      
      this.convertFileToBase64(this.selectedFile).then((base64) => {
        this.imagenB64 = base64;
        // Update the form control value with base64
        this.profileForm.patchValue({
          imagenB64: base64
        });
        this.isConvertingToBase64 = false;
        this.closeAvatarModal();
      }).catch((error) => {
        console.error('Error converting file to base64:', error);
        this.fileError = 'Error al procesar la imagen. Por favor intenta de nuevo.';
        this.isConvertingToBase64 = false;
      });
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result as string;
          // Remove the data URL prefix (data:image/jpeg;base64,)
          const base64String = result.split(',')[1];
          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }
}
