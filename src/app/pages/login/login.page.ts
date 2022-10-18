import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Key } from 'protractor';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //vamos a crear las variables necesarias:

  usuario = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(duoc|duocuc|profesor.duoc).(cl)')]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)])
  });

  personas: any[] = [];
  KEY_PERSONAS = 'personas';
  

  constructor(private alertController: AlertController, private router: Router, private activateRoute: ActivatedRoute, private storage: StorageService, private usuarioService: UsuarioService) { }

  async ngOnInit() {
    var admin = {
      rut: '11.111.111-1',
      nom_completo: 'Jaime Gonzalez',
      correo: 'administrador@duoc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      clave: 'admin123',
      tipo_usuario: 'administrador'
    };
    await this.storage.agregar('personas', admin);
    var alumno = {
      rut: '11.111.111-2',
      nom_completo: 'Jose Miguel',
      correo: 'miguelito@duocuc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      clave: 'miguel123',
      tipo_usuario: 'alumno'
    };
    await this.storage.agregar('personas', alumno);
    var docente = {
      rut: '12.231.341-4',
      nom_completo: 'Alan Gajardo',
      correo: 'alan@profesor.duoc.cl',
      fecha_nac: '1990-03-24',
      semestre: 1,
      clave: 'alan123',
      tipo_usuario: 'docente'
    };
    await this.storage.agregar('personas', docente);

    
    
  

    await this.cargarPersonas();  

  }

  async cargarPersonas(){
    this.personas = await this.storage.getDatos(this.KEY_PERSONAS);
  }


  //método para ingresar a home:
 async login(){
  var correoValidar = this.usuario.controls.correo.value;
  var claveValidar = this.usuario.controls.clave.value;
    
  var usuarioLogin = await this.storage.validarCorreoPass(correoValidar, claveValidar);
    //validar que ingrese los distintos tipos de usuarios
    if (usuarioLogin != undefined) {
     
      //UNA VEZ QUE VALIDO QUE EXISTE, ENVIARE ESOS DATOS A LA SIGUIENTE PÁGINA:
      let navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioLogin
        }
      };

      //PARA ENVIAR EL DATO QUE ESTA LISTO, SE ANEXA AL ROUTER!
      
      this.router.navigate(['/tabs/perfil/'+usuarioLogin.rut], navigationExtras);

    } else {
      this.alertaNovalido();
    }
  }

    

  //Alertas
  async alertaNovalido() {
    const alert = await this.alertController.create({
      subHeader: 'Importante Usuario!',
      message: 'Correo o Contraseña Incorrectos',
      buttons: ['OK'],
    });

    await alert.present();
  }


}
