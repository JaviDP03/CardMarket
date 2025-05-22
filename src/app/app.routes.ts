import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './components/actor/login/login.component';
import { PerfilComponent } from './components/actor/perfil/perfil.component';
import { EditarPerfilComponent } from './components/actor/editar-perfil/editar-perfil.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro/admin', component: RegistroComponent },
    { path: 'perfil', component: PerfilComponent},
    { path: 'perfil/editar', component: EditarPerfilComponent },
];
