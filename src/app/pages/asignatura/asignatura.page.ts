import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  asignatura = new FormGroup({
    cod_asignatura: new FormControl(''),
    nombre_asigna: new FormControl(''),
    sigla: new FormControl(''),
    escuela: new FormControl(''),
    rut_docente: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),

  });
  
  KEY_ASIGNATURA = 'asignatura';
  asignaturas: any[] = [];
  personas: any[] =[];
  usuarioLogin: any;

  constructor(private storage :StorageService, 
    private alertController: AlertController, 
    private router :Router,
    private validaciones : ValidacionesService,
    private loadingCtrl:LoadingController) { }

  async ngOnInit() {
    //this.usuarioLogin =this.router.getCurrentNavigation().extras.state.usuarioLogin;
    await this.cargarAsignatura();
    await this.cargarPersonas(); 

  }
  
  ////registrar asignatura 

async registrarAsignatura(){
  var respuesta: boolean = await this.storage.agregarAsignatura(this.KEY_ASIGNATURA, this.asignatura.value);
  console.log(this.asignatura)
  if (respuesta) {
    alert('Asignatura Registrada');
    await this.cargarAsignatura();
  }    
     
}

///cargando datos asignatura y personas 

async cargarAsignatura(){
  this.asignaturas = await this.storage.getDatosAsig(this.KEY_ASIGNATURA);
}
async cargarPersonas(){
  this.personas = await this.storage.getDatos('personas');
}

////metodos de eliminar, limpiar , buscar , modificar 
async eliminar(cod_asignatura){ 
  await this.alertaEliminar(cod_asignatura);
  await this.storage.eliminarAsignatura(this.KEY_ASIGNATURA,cod_asignatura);  
  await this.cargarAsignatura();
} 

async buscar(buscarcod){
  var asignaturaEncontrada = await this.storage.getDatoAsignatura(this.KEY_ASIGNATURA, buscarcod);
  this.asignatura.setValue(asignaturaEncontrada);

}

async modificarAsignatura(){
  await this.storage.actualizar(this.KEY_ASIGNATURA, this.asignatura.value);
  await this.cargando('Actualizando...');
  await this.limpiarAsignatura();
  await this.cargarAsignatura();  
}


async limpiarAsignatura(){
  await this.asignatura.reset();
  
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
      handler: () => {
      
        },
      },
    ],
});
  
await alert.present();

const { role } = await alert.onDidDismiss();

if (role == 'cancel'){
  return
}
else if (role == 'confirm'){
  this.eliminar(cod_asignatura);
  
  
  }
} 

async cargando(mensaje){
  const loading = await this.loadingCtrl.create({
    message: mensaje,
    duration: 1000
  });
  loading.present();
}


}
