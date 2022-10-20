import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage implements OnInit {

  asistencia = new FormGroup({
    cod_asistencia: new FormControl(''),
    id_clase: new FormControl(''),
    fecha: new FormControl(''),
    alumnos:new FormControl([])
  });

 
  KEY_ASIGNATURA = 'asignatura';
  asignaturas: any[] = [];
  asignatura : any;

  KEY_ASISTENCIA = 'asistencia';
  datos: any[] = [];
  dato : any;

  rut:string;
  usuario: any;
  usuarioLogin: any;
  asistencias: any;
  cod_asistencia:any;

constructor(private storage:StorageService, private router: Router,private activateRoute: ActivatedRoute) { }

async ngOnInit(){
  this.rut = this.activateRoute.snapshot.paramMap.get('rut');
  this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
  this.cargarAsistencia();
  }

async cargarAsignatura(){
  this.asignaturas = await this.storage.getDatosAsig(this.KEY_ASIGNATURA);
  console.log(this.asignaturas)
}

async cargarAsistencia(){
  this.asistencia = await this.storage.getDatoAsistencia(this.KEY_ASISTENCIA, this.rut);

}

async presente(){
  this.datos.push(this.usuarioLogin.rut);
  this.datos.push(this.cod_asistencia);
  console.log(this.datos);
  var asd = await this.storage.estoyPresente(this.KEY_ASISTENCIA,this.datos);
  console.log(asd);
  
}
}

