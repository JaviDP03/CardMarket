import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro/admin', component: RegistroComponent },
    { path: 'perfil', component: PerfilComponent}
];
