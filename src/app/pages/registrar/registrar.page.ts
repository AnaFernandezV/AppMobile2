import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  alumno = new FormGroup({
    rut : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[a-z0-9-]/)]),
    correo: new FormControl ('',[Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@['duocuc']+(\.cl)$/), Validators.email]),]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('alumno')
  });

  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  //usuarios: any[] = [];
  verificar_password: string;
  today: any;

  constructor(private usuarioService: UsuarioService, private router: Router, private alertController: AlertController, private validaciones : ValidacionesService) { }

  ngOnInit() {
    //this.usuarios = this.usuarioService.obtenerUsuarios();
    this.getDate();
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); console.log(this.today); }

  //método del formulario

  
  registrar(){
   //validación de salida para buscar un rut válido.
   if (!this.validaciones.validarRut(this.alumno.controls.rut.value)) {
    alert('Rut incorrecto!');
    return;
  }
  //validación de salida para verificar que persona tenga al menos 17 años.
  if (!this.validaciones.validarEdadMinima(17, this.alumno.controls.fecha_nac.value)) {
    alert('Edad mínima 17 años!');
    return;
  }

    if (this.alumno.controls.password.value != this.verificar_password) {
      this.alertaContra();
      return;
    }
    this.usuarioService.agregarUsuario(this.alumno.value);
    this.alertaRegistrado();
    this.router.navigate(['/login']);
    //this.alumno.reset();
    //this.verificar_password = '';
  }


  async alertaRegistrado() {
    const alert = await this.alertController.create({
      header: 'Felicidades!',
      subHeader: 'Alumno Registrado',
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


  

}


