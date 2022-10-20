import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';


import { v4 } from 'uuid';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage implements OnInit {
  elementType = 'canvas';
  value = '';  
  isModalOpen = false;

asistencia = new FormGroup({
  cod_asistencia: new FormControl(''),
  cod_clase: new FormControl(''),
  alumnos :new FormControl ([])
  
  });
clases: any[] = [];
codclase: any;

capturaQR= '';
isDisabled : boolean = false;

entregarQR : any;
usuarioLogin : any;

personas: any[] =[];
persona: any;

KEY_ASIGNATURA = 'asignatura';
asignaturas: any[] = [];
asignatura : any;
rut:string;
usuario:any;

KEY_ASISTENCIA = 'asistencia';
constructor(private storage : StorageService,
  private router:Router,
  private route:ActivatedRoute,
  private activateRoute:ActivatedRoute) { }

async ngOnInit() {
  this.rut = this.activateRoute.snapshot.paramMap.get('rut');
  
  console.log(this.usuario);
  
    await this.cargarAsignatura();
    await this.cargarPersonas();
    await this.cargarAsistencia(); 
 
  }
 //método para generar un código unico para el codigo QR:
 async cargarAsistencia(){
  this.personas = await this.storage.getDatos('asistencia');
}

async cargarAsignatura(){
  this.asignaturas = await this.storage.getDatoAsignaturaProfe(this.KEY_ASIGNATURA, this.rut);
}
async cargarPersonas(){
  this.personas = await this.storage.getDatos('personas');
}

async setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
  if (!isOpen) {
    return
  }
  let variableLocalIndice = v4(); 
  this.isDisabled = true; 
  this.value = variableLocalIndice;

  this.asistencia.value.cod_asistencia = this.value;
  this.asistencia.value.cod_clase = this.codclase;
  
  var respuesta: boolean = await this.storage.agregarAsistencia(this.KEY_ASISTENCIA, this.asistencia.value);
  console.log(this.asistencia)
  if (respuesta) {
    alert('Asistencia Registrada');
    await this.cargarAsistencia();
  }

}
  
  
}
