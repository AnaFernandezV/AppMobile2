import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
usuario: any;
  constructor(private activateRoute: ActivatedRoute, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario =this.router.getCurrentNavigation().extras.state.usuario;

  }
  logout(){
    this.usuarioService.logout();

  }

}
