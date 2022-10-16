import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  perso = new FormGroup({
    rut : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[a-z0-9-]/)]),
    correo: new FormControl ('',[Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@['duocuc'-'profesor.duoc'-'duoc']+(\.cl)$/), Validators.email]),]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('',[Validators.required])
  });

  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  verificar_password: string;
  today: any;
  personas: any[] = [];
  KEY_PERSONAS = 'personas';

  constructor(private usuarioService: UsuarioService, private router: Router, private alertController: AlertController, private storage: StorageService, private validaciones: ValidacionesService) {}

 async ngOnInit() {
  await this.cargarPersonas();
    this.getDate();
  }

  async cargarPersonas(){
    this.personas = await this.storage.getDatos(this.KEY_PERSONAS);
  }


  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); console.log(this.today); }

  //método del formulario
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
       await this.cargarPersonas();
       this.alertaRegistrado();
     }
    }

 async eliminar(rut){
  await this.alertaEliminar(rut);
  await this.cargarPersonas();
  }

 async buscar(rut){
    this.perso = await this.storage.getDato(this.KEY_PERSONAS, rut);
  }

 async modificar(){
    await this.storage.actualizar(this.KEY_PERSONAS, this.perso);
    await this.cargarPersonas();
    this.limpiar();
  }

  limpiar(){
    this.perso.reset();
    this.verificar_password = '';
  }

  //alert
  async alertaContra() {
    const alert = await this.alertController.create({
      header: 'ERROR...!',
      subHeader: 'Contraseñas No Coinciden!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertaExiste() {
    const alert = await this.alertController.create({
      header: 'Importante!',
      subHeader: 'Usuario Ya existe!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertaRegistrado() {
    const alert = await this.alertController.create({
      header: 'Felicidades!',
      subHeader: 'Usuario Registrado',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertaEliminar(rut) {
    const alert = await this.alertController.create({
      header: 'Atención!',
      subHeader: 'Estas Seguro de eliminar este usuario?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
        

         this.storage.eliminar(this.KEY_PERSONAS, rut);

          },
        },
      ],
    });

    await alert.present();
  }

   
}



