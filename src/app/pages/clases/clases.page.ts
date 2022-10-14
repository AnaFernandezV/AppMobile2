import { Component, OnInit, ViewChild } from '@angular/core';


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
  
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (this.value == '') {
      this.value = v4();
    }
    
  }  

  constructor() { }

  ngOnInit() {
  }

  generarCodigo(){
    if (this.value == '') {
      this.value = v4();
    }
  }

}
