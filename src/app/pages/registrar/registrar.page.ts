import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  perso = new FormGroup({
    id: new FormControl(''),
    rut : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nom: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[aA-zZ0-9-]+$/)]),
    ape: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[aA-zZ0-9-]+$/)]),
    correo: new FormControl ('',[Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ0-9-]+(\.[_a-z0-9-]+)*@['duocuc']+(\.cl)$/), Validators.email]),]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('alumno')
  });

  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  verificar_password: string;
  today: any;

  personas: any[] = [];
  KEY_PERSONAS = 'personas';
  usuarios: any[] = [];
  

  constructor(private router: Router, 
    private alertController: AlertController, 
    private validaciones : ValidacionesService, 
    private storage: StorageService,
    private fireService: FirebaseService) { }

 async ngOnInit() {
    await this.cargarPersonas();
    this.getDate();
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); console.log(this.today); }

  //método del formulario

  async cargarPersonas(){
    this.personas = await this.storage.getDatos(this.KEY_PERSONAS);
  }


 async registrar(){
   //validación de salida para buscar un rut válido.
   if (!this.validaciones.validarRut(this.perso.controls.rut.value)) {
    alert('Rut incorrecto!');
    return;
  }
  //validación de salida para verificar que persona tenga al menos 17 años.
  if (!this.validaciones.validarEdadMinima(17, this.perso.controls.fecha_nac.value)) {
    alert('Edad mínima 17 años!');
    return;
  }

    if (this.perso.controls.clave.value != this.verificar_password) {
      this.alertaContra();
      return;
    }
    var respuesta: boolean = await this.storage.agregar(this.KEY_PERSONAS, this.perso.value);
    if (respuesta) {
      this.alertaRegistrado();
      await this.cargarPersonas();
    }
   
   await this.router.navigate(['/login']);
  }


  async alertaRegistrado() {
    const alert = await this.alertController.create({
      header: 'Felicidades!',
      subHeader: 'Usuario Registrado',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertaContra() {
    const alert = await this.alertController.create({
      header: 'ERROR...!',
      subHeader: 'Contraseñas No Coinciden!',
      buttons: ['OK'],
    });

    await alert.present();
  }

////-----------------------METODO FIREBASE-----------------------------------------------

agregarFire(){
  this.fireService.agregar('usuarios', this.perso.value);
  
}

listarFire(){
  this.fireService.getDatos('usuarios').subscribe(
    (data:any) => {
      this.usuarios = [];
      for(let u of data){
        let usuarioJson = u.payload.doc.data();
        usuarioJson['id'] = u.payload.doc.id;
        this.usuarios.push(usuarioJson);
      }
    }
  );

}

eliminarFire(id){
  this.fireService.eliminar('usuarios', id);
}


buscarFire(id){
  let usuEncontrado = this.fireService.getDato('usuarios', id);
  usuEncontrado.subscribe(
    (response: any) => {
      let usu = response.data();
      usu['id'] = response.id;
      this.perso.setValue( usu );
    }
  );
}

modificarFire(){
  let id = this.perso.controls.id.value;
  let usuModificado = {
    rut: this.perso.controls.rut.value,
    nom: this.perso.controls.nom.value,
    ape: this.perso.controls.ape.value,
    correo: this.perso.controls.correo.value,
    fecha_nac: this.perso.controls.fecha_nac.value,
    semestre: this.perso.controls.semestre.value,
    clave: this.perso.controls.clave.value,
    tipo_usuario: this.perso.controls.tipo_usuario.value
  
  }

  this.fireService.modificar('usuarios', id, usuModificado);
  this.perso.reset();

}



}


