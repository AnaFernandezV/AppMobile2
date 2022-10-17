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
datos: any[] = [];
capturaQR= '';
estaHabilitado: boolean = false;
KEY_ASISTENCIA = 'asistencia';
entregarQR : any;
usuarioLogin : any;

personas: any[] =[];



KEY_ASIGNATURA = 'asignatura';
asignaturas: any[] = [];
asignatura : any;


  constructor(private storage : StorageService,private router:Router,private route:ActivatedRoute,) { }

async ngOnInit() {
    await this.cargarAsignatura();
    await this.cargarPersonas(); 
 
  }
 //método para generar un código unico para el codigo QR:
 
 setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
  if (this.value == '') {
    this.value = v4();
    this.capturaQR = this.value;
    this.estaHabilitado = true;
  }
  
}  
async cargarAsignatura(){
  this.asignaturas = await this.storage.getDatosAsig(this.KEY_ASIGNATURA);
}
async cargarPersonas(){
  this.personas = await this.storage.getDatos('personas');
}
  

}
