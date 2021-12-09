import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators} from '@angular/forms'
import * as $ from "jquery";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  // recibe un array de form controls
  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required), // para que el campo sea requerida
    password: new FormControl('', Validators.required)
  })

  constructor() { }

  ngOnInit(): void {
    //-------------- test consumo api ------------------------
    const URLHost = "http://3.15.208.210:8086";

    $("#btn_login").on('click',function() {
      let username = $("#inp_usuario").val();
      let password = $("#inp_password").val();

      if (username == "" && password == "") {
          alert("datos vacios");
      } else if (username == "") {
          alert("usuario vacio");
      } else if (password == "") {
          alert("contraseña vacio");
      } else {
          login(username, password).then((correct) => {
              console.log(username)

              if (correct) {
                  location.href = "dashboard";
              } else {
                  alert("Usuario o contraña incorrectos ");
              }
          });

      }

  });
  /**
   * valida si el usuario y contraseña son correctos 
   * @param use 
   * @param pass 
   * @returns true si el usuario es correcto
   */

    function login(use: any, pass: any) {
      return new Promise((resolve, reject) => {
          fetch(URLHost + "/api/usuarios/listar",{
              method: 'GET',
          }).then(res => res.json())
              .then(data => {
                  let correct = false;
                  console.log(data)
                  console.log(data[0]._id + " id ")
                  for (var i in data) {
                      if (data[i].usuario == use && data[i].password == pass) {
                          correct = true;
                          let usuario  = {
                        
                            "id" : data[i]._id,
                            "name" : data[i].nombre_usuario 
    
                          }
    
                          localStorage.setItem("usuario" , JSON.stringify(usuario) )
                          break;
                      }
                      
                      
                  }
                  resolve(correct)
              });
      });
  }


  //------------------------------------------------------------------------
  }
  

 

}


