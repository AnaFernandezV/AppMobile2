import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  clases: any[] = [];
  codclase: any;
  datos: any[] = [];
  capturaQR= '';
  estaHabilitado: boolean = false;
  KEY_ASISTENCIA = 'asistencia';
  asistencia: any;
  entregarQR : any;
  usuarioLogin : any;
  
  personas: any[] =[]; 
  

  constructor(private storage: StorageService) { }

  ngOnInit() {
  }


  async crearAsistencia(){
    this.asistencia.value.cod_asistencia = this.capturaQR;
    this.asistencia.value.cod_clase = this.codclase;
    var respuesta: boolean = await this.storage.agregarAsistencia(this.KEY_ASISTENCIA, this.asistencia.value);
    if (!respuesta){
      //colocar alerta clase ya existe 
      return 
    }
    if(respuesta){
      //alerta aki de clase registrada con exito 
  
    }
  }
  async alumnoQR(){
    this.datos.push(this.usuarioLogin.rut);
    this.datos.push(this.entregarQR);
    var presente = await this.storage.estoyPresente(this.KEY_ASISTENCIA, this.datos);
  
    }

}
