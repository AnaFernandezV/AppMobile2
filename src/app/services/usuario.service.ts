import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //variables necesarias para el trabajo del CRUD:
  usuarios: any[] = [
    {
      rut: '11.111.111-1',
      nom_completo: 'Jaime Gonzalez',
      correo: 'administrador@duoc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      password: 'admin123',
      tipo_usuario: 'administrador'
    },
    {
      rut: '11.111.111-2',
      nom_completo: 'Jose Miguel',
      correo: 'miguelito@duocuc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      password: 'miguel123',
      tipo_usuario: 'alumno'
    },
    {
      rut: '12.231.341-4',
      nom_completo: 'Alan Gajardo',
      correo: 'alan@profesor.duoc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      password: 'alan123',
      tipo_usuario: 'docente'
    }
  ];

  isAuthenticated = new BehaviorSubject(false);

  constructor(private router: Router) { }

  //métodos del CRUD:
  agregarUsuario(usuario): boolean{
    if ( this.obtenerUsuario(usuario.rut) == undefined && this.obtenerUsuario(usuario.correo) == undefined ) {
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }
  eliminarUsuario(rut){
    this.usuarios.forEach((usu, index) => {
      if (usu.rut == rut) {
        this.usuarios.splice(index, 1);
      }
    });
  }
  modificarUsuario(usuario){
    var index = this.usuarios.findIndex(usu => usu.rut == usuario.rut);
    this.usuarios[index] = usuario;
  }
  obtenerUsuario(rut){
    return this.usuarios.find(usuario => usuario.rut == rut);
  }
  obtenerUsuarios(){
    return this.usuarios;
  }

  //Metodo para evitar entrar de forma ilegal en las URL

  loginUsuario(correo, password) {
    var usuarioLogin: any;
    usuarioLogin = this.usuarios.find(u => u.correo == correo && u.password == password);
    if (usuarioLogin != undefined) {
      //PARA CAMBIAR EL VALOR A UN BehaviorSubject SE UTILIZA EL METODO .next(valor);
      this.isAuthenticated.next(true);
      return usuarioLogin;
    }
  }


  getAuth(){
    return this.isAuthenticated.value;
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
  

  //MÉTODO CUSTOMER:
  //validar rut y contraseña: método que recibe rut y password y me entrega un JSON de un usuario
  validarRutPassword(rut, pass){
    return this.usuarios.find(u => u.rut == rut && u.password == pass);
  }
  validarCorreoPass(correo, password){
    var usuarioLogin: any;
    usuarioLogin = this.usuarios.find(u => u.correo == correo && u.password == password);
    if (usuarioLogin != undefined) {
      //Para Cambiar el valor a un BehaviorSubject se utiliza el metodo .next(valor);
      this.isAuthenticated.next(true);
      return usuarioLogin;
    }
  }
  validarRecuperarPass(correo){
    return this.usuarios.find(u => u.correo == correo);
  }

}
