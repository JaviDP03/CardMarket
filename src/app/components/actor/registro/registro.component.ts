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
    this.route.url.subscribe(url => {
      this.isAdmin = this.route.snapshot.url.some(segment => segment.path === 'admin');
      this.initializeForm();
    });
  }

  get f() { return this.registroForm.controls; }

  initializeForm(): void {
    const commonFields = {
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasenna: ['', [Validators.required, Validators.minLength(6)]],
      confirmContrasenna: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    };

    if (this.isAdmin) {
      this.registroForm = this.formBuilder.group({
        ...commonFields
      });
    } else {
      this.registroForm = this.formBuilder.group({
        ...commonFields,
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        fechaNacimiento: ['', Validators.required]
      });
    }

    this.registroForm.controls['confirmContrasenna'].addValidators(
      this.mustMatch(this.registroForm.controls['contrasenna'])
    );
  }

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

    if (this.registroForm.invalid) {
      return;
    }

    if (this.isAdmin) {
      const admin = this.registroForm.value;

      this.adminService.createAdmin(admin).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/login']);
          } else {
            this.registroError = 'Error al registrar administrador. El usuario ya existe o hay datos inválidos.';
            this.showErrorAlert = true;
            
            setTimeout(() => {
              this.dismissError();
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al registrar admin:', error);
          this.registroError = 'Error al registrar administrador. Por favor, intente nuevamente.';
          this.showErrorAlert = true;
          
          setTimeout(() => {
            this.dismissError();
          }, 5000);
        }
      });
    } else {
      const usuario = this.registroForm.value;
      console.log(usuario);

      this.usuarioService.createUsuario(usuario).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/login']);
          } else {
            this.registroError = 'Error al registrar usuario. El usuario ya existe o hay datos inválidos.';
            this.showErrorAlert = true;
            
            setTimeout(() => {
              this.dismissError();
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          this.registroError = 'Error al registrar usuario. Por favor, intente nuevamente.';
          this.showErrorAlert = true;
          
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
    }, 300);
  }
}
