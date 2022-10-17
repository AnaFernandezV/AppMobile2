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

  asignaturas: any[] = [];
  asignatura: any;

  asistencias: any[] = [];
  asistencia: any;
  

  constructor(private storage: Storage, private router: Router) {
    storage.create();
  }
  

  isAuthenticated = new BehaviorSubject(false);
 

  //----------------------------------------STORAGE USUARIOS-------------------------------------------
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


//-------------------------------------STORAGE ASIGNATURA-------------------------------------------------------------------

async agregarAsignatura(key, asignatura) {
  this.asignaturas = await this.storage.get(key) || [];
  this.asignatura = await this.getDatoAsignatura(key, asignatura.cod_asignatura);
  if (this.asignatura == undefined) {
    this.asignaturas.push(asignatura);
    await this.storage.set(key, this.asignaturas);
    return true;
  }
  return false;
}

async getDatoAsignatura(key, identificador) {
  this.asignaturas = await this.storage.get(key) || [];
  this.asignatura = this.asignaturas.find(asignatura => asignatura.cod_asignatura == identificador);
  return this.asignatura;
}

async getDatosAsig(key): Promise<any[]> {
  this.asignaturas = await this.storage.get(key);
  return this.asignaturas;
}

async eliminarAsignatura(key, dato) {
  this.asignaturas = await this.storage.get(key) || [];
  this.asignaturas.forEach((value, index) => {
    if (value.cod_asignatura == dato) {
      this.asignaturas.splice(index, 1);
    }
  });
  await this.storage.set(key, this.asignaturas);
}

async actualizarAsignatura(key, dato) {
  this.asignaturas = await this.storage.get(key) || [];
  var index = this.asignaturas.findIndex(asignatura => asignatura.cod_asignatura == dato.cod_asignatura);
  this.asignaturas[index] = dato;
  await this.storage.set(key, this.asignaturas);
}


//------------------------STORAGE ASISTENCIA-------------------------------------------------------------------

async agregarAsistencia(key, dato) {
  this.datos = await this.storage.get(key) || [];

  this.dato = await this.getDatoAsistencia(key, dato.cod_asistencia);
  if (this.dato == undefined) {
    this.datos.push(dato);
    await this.storage.set(key, this.datos);
    return true;
  }
  return false;
}


async getDatoAsistencia(key, identificador) {
  this.datos = await this.storage.get(key) || [];
  this.dato = this.datos.find(dato => dato.cod_asistencia == identificador);
  return this.asistencia;
}

async getDatosAsis(key): Promise<any[]> {
  this.asistencias = await this.storage.get(key);
  return this.asistencias;
}

async estoyPresente(key, dato) {
  this.datos = await this.storage.get(key) || [];  
  var index = this.datos.findIndex(asistencia => asistencia.cod_asistencia == dato[1]);

   this.datos[index].alumnos.push(dato[0]); 
  
   await this.storage.set(key, this.datos); 
}


async eliminarAsistencia(key, dato) {
  this.asistencias = await this.storage.get(key) || [];
  this.asistencias.forEach((value, index) => {
    if (value.cod_asistencia == dato) {
      this.asistencias.splice(index, 1);
    }
  });
  await this.storage.set(key, this.asistencias);
}

async actualizarAsistencia(key, dato) {
  this.asistencias = await this.storage.get(key) || [];
  var index = this.asistencias.findIndex(asistencia => asistencia.cod_asistencia == dato.cod_asistencia);
  this.asistencias[index] = dato;
  await this.storage.set(key, this.asistencias);
}

}