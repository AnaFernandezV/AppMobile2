import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //vamos a crear las variables necesarias:
  correo: string;
  password: string;

  constructor(private alertController: AlertController, private router: Router, 
    private usuarioService: UsuarioService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    
  }

  //método para ingresar a home:
  login(){
    var usuarioLogin = this.usuarioService.validarCorreoPass(this.correo,this.password);

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
