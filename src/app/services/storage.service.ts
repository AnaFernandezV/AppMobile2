import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //variables a utilizar:
  datos: any[] = [
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
      semestre: 2,
      password: 'miguel123',
      tipo_usuario: 'alumno'
    },
    {
      rut: '12.231.341-4',
      nom_completo: 'Alan Gajardo',
      correo: 'alan@profesor.duoc.cl',
      fecha_nac: '1990-03-24',
      semestre: 3,
      password: 'alan123',
      tipo_usuario: 'docente'
    }
  ];
  dato: any;

  constructor(private storage: Storage, private router: Router) {
    storage.create();
  }
  isAuthenticated = new BehaviorSubject(false);

  //métodos del crud del storage:
  async agregar(key, dato) {
    this.datos = await this.storage.get(key) || [];

    this.dato = await this.getDato(key, dato.rut);
    if (this.dato == undefined) {
      this.datos.push(dato);
      await this.storage.set(key, this.datos);
      return true;
    }
    return false;
  }

  async getDato(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    this.dato = this.datos.find(persona => persona.rut == identificador);
    return this.dato;
  }

  async getDatos(key): Promise<any[]> {
    this.datos = await this.storage.get(key);
    return this.datos;
  }

  async eliminar(key, dato) {
    this.datos = await this.storage.get(key) || [];
    this.datos.forEach((value, index) => {
      if (value.rut == dato) {
        this.datos.splice(index, 1);
      }
    });
    await this.storage.set(key, this.datos);
  }
  
  async actualizar(key, dato) {
    this.datos = await this.storage.get(key) || [];
    
    var index = this.datos.findIndex(persona => persona.rut == dato.rut);
    this.datos[index] = dato;

    await this.storage.set(key, this.datos);
  }

  //Metodo para autentificacion
  validarCorreoPass(correo, password){
    var usuarioLogin: any;
    usuarioLogin = this.datos.find(u => u.correo == correo && u.password == password);
    if (usuarioLogin != undefined) {
      //Para Cambiar el valor a un BehaviorSubject se utiliza el metodo .next(valor);
      this.isAuthenticated.next(true);
      return usuarioLogin;
    }
  }

  //Metodo para ingresar 
  getAuth(){
    return this.isAuthenticated.value;
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

}