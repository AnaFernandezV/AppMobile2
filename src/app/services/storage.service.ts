import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //variables a utilizar:
  datos: any[] = [];
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

    //MÉTODO CUSTOMER:
    async validarCorreoPass(correo, clave){
      this.datos = await this.storage.get('personas') || [];
      
      var usuarioLogin: any;
      usuarioLogin = this.datos.find(u => u.correo == correo && u.clave == clave);
      if (usuarioLogin != undefined) {
        //Para Cambiar el valor a un BehaviorSubject se utiliza el metodo .next(valor);
        this.isAuthenticated.next(true);
        return usuarioLogin;
      }
    }


}