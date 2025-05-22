import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActorService } from '../../../service/actor.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  loginError: string | null = null;
  showErrorAlert = false;

  constructor(
    private fb: FormBuilder,
    private actorService: ActorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(0)]]
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.login();
  }

  login(): void {
    const login = this.loginForm.value;
    this.isSubmitting = true;

    this.actorService.login(login).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = 'Usuario o contraseña inválido';
        this.showErrorAlert = true;
        this.isSubmitting = false;
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
          this.dismissError();
        }, 5000);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  dismissError(): void {
    this.showErrorAlert = false;
    setTimeout(() => {
      this.loginError = null;
    }, 300); // Small delay to let animation complete
  }

  navigateToRegister(): void {
    this.router.navigate(['/registro']);
  }
}