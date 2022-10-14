import { Component, OnInit } from '@angular/core';
import { v4 } from 'uuid';
@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})

export class QrPage implements OnInit {
elementType = 'canvas';
value = '';
  constructor() { }

  ngOnInit() {
  }
 //método para generar un código unico para el codigo QR:
 generarCodigo(){
  if (this.value == '') {
    this.value = v4();
  }
}
}
