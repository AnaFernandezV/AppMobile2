import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  alumno = new FormGroup({
    rut : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[a-z0-9-]/)]),
    correo: new FormControl ('',[Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@['duocuc'-'profesor.duoc'-'duoc']+(\.cl)$/), Validators.email]),]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('',[Validators.required])
  });

  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  usuarios: any[] = [];
  verificar_password: string;
  today: any;

  constructor(private usuarioService: UsuarioService, private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.usuarios = this.usuarioService.obtenerUsuarios();
    this.getDate();
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); console.log(this.today); }

  //método del formulario
  registrar(){
    if (this.alumno.controls.password.value != this.verificar_password) {
      this.alertaContra;
      return;
    }
    
    var registrado: boolean = this.usuarioService.agregarUsuario(this.alumno.value);
    if (!registrado) {
      this.alertaExiste();
      return;
    }

    this.alertaRegistrado();
    this.alumno.reset();
    this.verificar_password = '';
  }

  eliminar(rutEliminar){
    
    this.alertaEliminar(rutEliminar);
    //this.usuarioService.eliminarUsuario(rutEliminar);
    
  }

  buscar(rutBuscar){
    var alumnoEncontrado = this.usuarioService.obtenerUsuario(rutBuscar);
    this.alumno.setValue(alumnoEncontrado);
    this.verificar_password = alumnoEncontrado.password;
  }

  modificar(){
    //console.log(this.alumno.value);
    this.usuarioService.modificarUsuario(this.alumno.value);
    this.limpiar();
  }

  limpiar(){
    this.alumno.reset();
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

  async alertaEliminar(rutEliminar) {
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

            this.usuarioService.eliminarUsuario(rutEliminar);

          },
        },
      ],
    });

    await alert.present();
  }
}



