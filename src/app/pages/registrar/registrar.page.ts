import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  ngOnInit() {
    //await this.cargarPersonas();
    this.getDate();
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); console.log(this.today); }

  //método del formulario

  async cargarPersonas(){
    this.personas = await this.storage.getDatos(this.KEY_PERSONAS);
  }


 /* async registrar(){
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
  } */


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

agregarRegistrar(){ 
     //validación de salida para buscar un rut válido.
  if (!this.validaciones.validarRut(this.perso.controls.rut.value)) {
      alert('Rut incorrecto!');
      return; ///EL UNICO QUE NO FUNCIONA 
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

  this.fireService.agregar('usuarios', this.perso.value);
  alert('Usuario Registrado!!');

}

}


