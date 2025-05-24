import { Routes } from '@angular/router';
import { RegistroComponent } from './components/actor/registro/registro.component';
import { LoginComponent } from './components/actor/login/login.component';
import { PerfilComponent } from './components/actor/perfil/perfil.component';
import { EditarPerfilComponent } from './components/actor/editar-perfil/editar-perfil.component';
import { ListarProductosComponent } from './components/producto/listar-productos/listar-productos.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro/admin', component: RegistroComponent },
    { path: 'perfil', component: PerfilComponent},
    { path: 'perfil/editar', component: EditarPerfilComponent },
    { path: 'cartas', component: ListarProductosComponent},
    { path: 'colecciones', component: ListarProductosComponent}  
];
