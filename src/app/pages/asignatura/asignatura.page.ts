import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

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
    nombre_docente: new FormControl(''),

  });
  
  KEY_ASIGNATURA = 'asignatura';
  asignaturas: any[] = [];
  personas: any[] =[];
  usuarioLogin: any;

  constructor(private storage :StorageService, private alertController: AlertController, private router :Router) { }

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
async eliminar(codasignatura){
  await this.storage.eliminarAsignatura(this.KEY_ASIGNATURA, codasignatura);
  await this.cargarAsignatura();
} 

async buscar(buscarcod){
  var asignaturaEncontrada = await this.storage.getDatoAsignatura(this.KEY_ASIGNATURA, buscarcod);
  this.asignatura.setValue(asignaturaEncontrada);

}

async modificarAsignatura(){
  await this.storage.actualizar(this.KEY_ASIGNATURA, this.asignatura.value);
  await this.cargarAsignatura();
  await this.limpiarAsignatura();
}


async limpiarAsignatura(){
  await this.asignatura.reset();
  
}


}
