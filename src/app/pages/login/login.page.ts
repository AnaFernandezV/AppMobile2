import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';



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

  usuarios:any [] = [];

  clave: any;
  correo: any;

  constructor(private alertController: AlertController, 
    private router: Router, 
    private activateRoute: ActivatedRoute, 
    private storage: StorageService, 
    private usuarioService: UsuarioService,
    private fireService: FirebaseService,
    private fAuth :AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) { }

  async ngOnInit() {
    var admin = {
      rut: '19.220.838-6',
      nom: 'Jaime',
      ape:'Gonzalez',
      correo: 'administrador@duoc.cl',
      semestre: '',
      fecha_nac: '1990-03-24',
      clave: 'admin123',
      tipo_usuario: 'administrador'
    };
    await this.storage.agregar('personas', admin);
    
    await this.cargarPersonas();
    this.listarUsuarios();

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
///------------------------METODO FIREBASE-------------------------------------

/* loginFire(correo, clave): boolean{
  for(let u of this.usuarios){
    if(u.correo == correo && u.clave == clave){
      return true;
    }
  }
  return false;
}
 */
/* async loginPrueba() {
  try {
    var r = await this.fAuth.auth.signInWithEmailAndPassword(
      this.usuario.correo,
      this.usuario.clave
    );
    if (r) {
      console.log("Successfully logged in!");
      this.navCtrl.setRoot('HomePage');
    }

  } catch (err) {
    console.error(err);
  }
} */

listarUsuarios(){
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

}
