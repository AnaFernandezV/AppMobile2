import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  rut: string;
  usuario: any;
  personas: any[] = [];
  KEY_PERSONAS = 'personas';
  

  constructor(private activateRoute: ActivatedRoute, private usuarioService: UsuarioService, private storage: StorageService, private router: Router) { }

 async ngOnInit() {
    this.rut = this.activateRoute.snapshot.paramMap.get('rut');
    this.usuario =this.router.getCurrentNavigation().extras.state.usuario;
    console.table(this.usuario);

  }

}
