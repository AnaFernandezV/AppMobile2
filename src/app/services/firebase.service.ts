import { Injectable } from '@angular/core';
import {AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  datos: any[] = [];
  constructor(private firebase: AngularFirestore) { }



  //metodos del Crud usuario
  agregar(coleccion, value){

    try {
      this.firebase.collection(coleccion).add(value);
    } catch (error) {
      console.log('ERROR', error)
      
    }
  }

  getDatos(coleccion){
    try {
      return this.firebase.collection(coleccion).snapshotChanges();
    } catch (error) {
      console.log('ERROR:', error)
      
    }
  }
    //-------------------------------------------
   /* getDatos2(colleccion){
    try {
      this.fire.collection(colleccion).snapshotChanges().subscribe(
        data => {
          this.datos = [];
          for(let d of data){
            this.datos.push(d.payload.doc.data());
          }
        }
      );
    } catch (error) {
      console.log('ERROR: ', error)
    }
  } */

  //--------------------------------------------

  getDato(coleccion, identificador){
    try {
     return this.firebase.collection(coleccion).doc(identificador).get();
    } catch (error) {
      console.log('ERROR: ', error)
      
    }
  }

  eliminar(coleccion, identificador){
    try {
      this.firebase.collection(coleccion).doc(identificador).delete();
    } catch (error) {
      console.log('ERROR', error)    
    }
  }



  modificar(coleccion, identificador, value){
    try {
      this.firebase.collection(coleccion).doc(identificador).set(value);
    } catch (error) {
      console.log('ERROR: ', error)
      
    }
  }

  /////---------------------Asistencia Firebase-------------------------------------------

  agregarAsistencia(coleccion, value){

    try {
      this.firebase.collection(coleccion).add(value);
      
    } catch (error) {
      console.log('ERROR', error)
      
    }
  }

  getDatoAsistenciaFire(identificador){
    try {
     return this.firebase.collection('asistencia').doc(identificador).get();
    } catch (error) {
      console.log('ERROR: ', error)
      
    }
  }

  buscandoCodigoAsis(){


  }




/* actualizar(coleccion,identificar,value){
try {

  
} catch (error) {
  
}

} */


}
