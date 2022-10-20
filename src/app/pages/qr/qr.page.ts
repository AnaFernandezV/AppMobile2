import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { v4 } from 'uuid';
@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})

export class QrPage implements OnInit {
elementType = 'canvas';
value = '';

clases: any[] = [];
codclase: any;
datos: any[] = [];
capturaQR= '';
estaHabilitado: boolean = false;
KEY_ASISTENCIA = 'asistencia';
entregarQR : any;
usuarioLogin : any;
  constructor(private storage : StorageService,private router:Router,private route:ActivatedRoute,) { }

  ngOnInit() {
  }
 //método para generar un código unico para el codigo QR:
 generarCodigo(){
  if (this.value == '') {
    this.value = v4();
    this.capturaQR = this.value;
    this.estaHabilitado = true;
  }
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
