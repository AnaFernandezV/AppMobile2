import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  asignatura = new FormGroup({
    id: new FormControl(''),
    cod_asignatura: new FormControl('',[Validators.required]),
    nombre_asigna: new FormControl('',[Validators.required]),
    sigla: new FormControl('',[Validators.required]),
    escuela: new FormControl('',[Validators.required]),
    rut_docente: new FormControl('',[Validators.required]),

  });

  KEY_ASIGNATURA = 'asignatura';
  asignaturas: any[] = [];
  personas: any[] = [];
  usuarioLogin: any;

  usuarios: any[] = [];

  constructor(private storage: StorageService,
    private alertController: AlertController,
    private router: Router,
    private validaciones: ValidacionesService,
    private loadingCtrl: LoadingController,
    private fireService: FirebaseService) { }

   ngOnInit() {
    //this.usuarioLogin =this.router.getCurrentNavigation().extras.state.usuarioLogin;
    /* await this.cargarAsignatura();
    await this.cargarPersonas() */;
    this.listarAsignatura();
    this.listarUsuarios();
     

  }

  ////registrar asignatura 

  async registrarAsignatura() {
    var respuesta: boolean = await this.storage.agregarAsignatura(this.KEY_ASIGNATURA, this.asignatura.value);
    console.log(this.asignatura)
    if (respuesta) {
      this.alertaRegistrado();
      await this.cargarAsignatura();
    }

  }

  ///cargando datos asignatura y personas 

  async cargarAsignatura() {
    this.asignaturas = await this.storage.getDatosAsig(this.KEY_ASIGNATURA);
  }
  async cargarPersonas() {
    this.personas = await this.storage.getDatos('personas');
    this.personas = this.personas.filter(p => p.tipo_usuario == 'docente');
  }

  ////metodos de eliminar, limpiar , buscar , modificar 
  async eliminar(cod_asignatura) {
    await this.storage.eliminarAsignatura(this.KEY_ASIGNATURA, cod_asignatura);
    await this.cargarAsignatura();
  }

  async buscar(buscarcod) {
    var asignaturaEncontrada = await this.storage.getDatoAsignatura(this.KEY_ASIGNATURA, buscarcod);
    this.asignatura.setValue(asignaturaEncontrada);

  }

  async modificarAsignatura() {
    await this.storage.actualizar(this.KEY_ASIGNATURA, this.asignatura.value);
    await this.cargando('Actualizando...');
    this.limpiarAsignatura();
    await this.cargarAsignatura();
    }


  limpiarAsignatura() {
    this.asignatura.reset();
  }

  async alertaEliminar(cod_asignatura) {
    const alert = await this.alertController.create({
      header: 'Atención!',
      subHeader: '¿Estas Seguro de eliminar esta Asignatura?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'SI',
          role: 'confirm',
          handler: async () => {
            await this.eliminar(cod_asignatura);
          },
        },
      ],
    });

    await alert.present();

   
  }

  async cargando(mensaje) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: 1000
    });
    loading.present();
  }

  async alertaRegistrado() {
    const alert = await this.alertController.create({
      subHeader: 'Asignatura Registrada',
      buttons: ['OK'],
    });

    await alert.present();
  }
/////------------------------METODOS FIREBASE---------------------------------------

agregarFire(){
  this.fireService.agregar('asignaturas', this.asignatura.value);
  
}

listarUsuarios(){
  this.fireService.getDatos('usuarios').subscribe(
    (data:any) => {      
      this.usuarios = [];      
      for(let u of data){
        let usuarioJson = u.payload.doc.data();
        usuarioJson['id'] = u.payload.doc.id;   
        if(usuarioJson.tipo_usuario == 'docente'){
          this.usuarios.push(usuarioJson);        

        }     
      }
      console.log(this.usuarios)
    }
    
  );

}
listarAsignatura(){
  this.fireService.getDatos('asignaturas').subscribe(
    (data:any) => {
      this.asignaturas = [];
      for(let u of data){
        let asignaturaJson = u.payload.doc.data();
        asignaturaJson['id'] = u.payload.doc.id;
        this.asignaturas.push(asignaturaJson);
      }
    }
  );

}

eliminarFire(id){
  this.fireService.eliminar('asignaturas', id);
}


buscarFire(id){
  let asignaturaEncontrada = this.fireService.getDato('asignaturas', id);
  asignaturaEncontrada.subscribe(
    (response: any) => {
      let asigna = response.data();
      asigna['id'] = response.id;
      this.asignatura.setValue( asigna );
    }
  );
}

modificarFire(){
  let id = this.asignatura.controls.id.value;
  let asignaturaModi = {
    cod_asignatura: this.asignatura.controls.cod_asignatura.value,
    nombre_asigna: this.asignatura.controls.nombre_asigna.value,
    sigla: this.asignatura.controls.sigla.value,
    escuela: this.asignatura.controls.escuela.value,
    rut_docente: this.asignatura.controls.rut_docente.value,
      
  }
  this.fireService.modificar('asignaturas', id, asignaturaModi);
  this.asignatura.reset();

}


}
