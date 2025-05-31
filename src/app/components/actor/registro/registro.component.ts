import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isAdmin: boolean = false;
  submitted = false;
  registroError: string | null = null;
  showErrorAlert = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Detectar si la ruta es para admin
    this.route.url.subscribe(url => {
      // Verificar si está en la ruta de admin
      this.isAdmin = this.route.snapshot.url.some(segment => segment.path === 'admin');
      this.initializeForm();
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() { return this.registroForm.controls; }

  initializeForm(): void {
    // Campos comunes para ambos tipos de usuarios
    const commonFields = {
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasenna: ['', [Validators.required, Validators.minLength(6)]],
      confirmContrasenna: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    };

    if (this.isAdmin) {
      // Formulario para administradores (solo campos comunes)
      this.registroForm = this.formBuilder.group({
        ...commonFields
      });
    } else {
      // Formulario para usuarios normales (campos comunes + específicos)
      this.registroForm = this.formBuilder.group({
        ...commonFields,
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        fechaNacimiento: ['', Validators.required]
      });
    }

    // Añadir validador personalizado para confirmar contraseña
    this.registroForm.controls['confirmContrasenna'].addValidators(
      this.mustMatch(this.registroForm.controls['contrasenna'])
    );
  }

  // Validador personalizado para verificar que las contraseñas coinciden
  mustMatch(passwordControl: any) {
    return (control: any) => {
      if (control.value !== passwordControl.value) {
        return { mustMatch: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.registroForm.invalid) {
      return;
    }

    if (this.isAdmin) {
      // Crear un objeto Admin (usando la estructura de Actor)
      const admin = this.registroForm.value;

      this.adminService.createAdmin(admin).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/login']);
          } else {
            this.registroError = 'Error al registrar administrador. El usuario ya existe o hay datos inválidos.';
            this.showErrorAlert = true;
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
              this.dismissError();
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al registrar admin:', error);
          this.registroError = 'Error al registrar administrador. Por favor, intente nuevamente.';
          this.showErrorAlert = true;
          
          // Auto dismiss after 5 seconds
          setTimeout(() => {
            this.dismissError();
          }, 5000);
        }
      });
    } else {
      // Crear un objeto Usuario usando el constructor 
      const usuario = this.registroForm.value;
      console.log(usuario);

      this.usuarioService.createUsuario(usuario).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/login']);
          } else {
            this.registroError = 'Error al registrar usuario. El usuario ya existe o hay datos inválidos.';
            this.showErrorAlert = true;
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
              this.dismissError();
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          this.registroError = 'Error al registrar usuario. Por favor, intente nuevamente.';
          this.showErrorAlert = true;
          
          // Auto dismiss after 5 seconds
          setTimeout(() => {
            this.dismissError();
          }, 5000);
        }
      });
    }
  }

  dismissError(): void {
    this.showErrorAlert = false;
    setTimeout(() => {
      this.registroError = null;
    }, 300); // Small delay to let animation complete
  }
}
