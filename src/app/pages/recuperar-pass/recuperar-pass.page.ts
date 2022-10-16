import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.page.html',
  styleUrls: ['./recuperar-pass.page.scss'],
})
export class RecuperarPassPage implements OnInit {

  //Variable Para recuperar contraseña
  correo: string;

  constructor(private router: Router, private usuarioService: UsuarioService , private alertController: AlertController) { }

  ngOnInit() {
  }

  //Recuperar Contraseña
  recuperar(){
    var usuarioRecu = this.usuarioService.validarRecuperarPass(this.correo);

    //validar 
    if (usuarioRecu != undefined) {
      this.alertaRecuperarValid();
    }else{
      this.alertaRecuperarNovalid();
    }
  }

  async alertaRecuperarValid() {
    const alert = await this.alertController.create({
      header: 'Check Your Email!',
      subHeader: 'Correo Enviado Exitosamente !',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertaRecuperarNovalid() {
    const alert = await this.alertController.create({
      header: 'Importante!!',
      subHeader: 'Debes Ingresar Un Correo Valido !',
      buttons: ['OK'],
    });

    await alert.present();
  }

}
