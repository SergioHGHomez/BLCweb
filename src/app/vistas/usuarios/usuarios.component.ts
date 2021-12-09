import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const URLHost = "http://3.15.208.210:8086"
    let usersList: any;

    $("#mensajeNav").html('<i class="fas fa-wifi"></i></i>Conectado a <strong>Medellín</strong>')
    UpdateList()

    //----- ocultar las opciones de editar y eliminar
    $("#btn_eliminar").hide()
    $("#btn_editar").hide()

    
    //----------------- funciones --------------------
    
    $("#btn_crearU").on("click",() => {
      

      let document = $("#inp_documentNew").val();
      let name = $("#inp_nameNew").val();
      let email = $("#inp_emailNew").val();
      let user = $("#inp_userNew").val();
      let password = $("#inp_passwordNew").val();

      if(userExist(document)){
        ShowMessage("el usuario ya se encuentra registrado ","#message")
      }else{
        
        if(ValidTextField(document) 
        && ValidTextField(name)
        && ValidTextField(email)
        && ValidTextField(user) 
        && ValidTextField(password)){
          saveUsuer(document, name, email, user, password);
        }else{
          
          ShowMessage("<strong>Informacion Invalida!</strong>"+
          "Los campos son incorrectos o estan en blanco","#message")
        }
      }
      
      // compreba los valores

    })

    $("#btn_buscar").on("click",() => {
      
      let document = $("#inp_document").val();
      searchUser(document);
      
    })
    
    $("#btn_eliminar").on("click",() => {
      let document = $("#inp_document").val();
      if( document != '' ){
        deleteUser(document);
      }
    })

    $("#btn_editar").on("click",() => {
      let document = $("#inp_document").val();
      let name = $("#inp_name").val();
      let email = $("#inp_email").val();
      let user = $("#inp_user").val();
      let password = $("#inp_password").val();

      if(ValidTextField(document) 
      && ValidTextField(name) 
      && ValidTextField(email)
      && ValidTextField(user) 
      && ValidTextField(password)){
        updateUsuer(document, name, email,user, password)
      }else{
        ShowMessage("los campos son incorrectos o estan vacios ","#messageEdit")
      }

    })
    //----------- actualiza el listado de usuarios  -------
    function UpdateList(){
      getUsers().then((data) => {
        usersList = data
    } );
    }

    //---------- comporbar campos -------------------------

    /**
     * valida que el texto cumpla con unas caracteristicas 
     * @param text texto a validar
     * @param lengthMin cantidad minima de caracteres
     * @param lengthMax cantidad maxima de caracteres
     * @returns true si el texto esta correcto
     */

    function ValidTextField(text:any, lengthMin:number =3, lengthMax:number = 25) {
      if (text == "" || text == undefined || text.length < lengthMin || text.length > lengthMax) return false
      else return true;

    }
    // ---------- validar usuario -----------------------
    function userExist(document: any) {
      let exists = false
      for (var i = 0; i < usersList.length; i++) {
            if( document == usersList[i].cedula_usuario){
                exists = true
                break
            }
        }
        return exists
    }

    //---------- mensajes ----------------------
    /**
     * muestra una alerta en la pagina
     * @param text el texto que se va a mostrar en el mensaje
     * @param location el id de la etiqueta html en la que se va a mostrar el mensaje
     * @param alertType el estilo de alerta de bootstrap [alert-primary, alert-secondary, alert-success, 
     * alert-danger, alert-warning, alert-info, alert-light, alert-dark]
     */

    function ShowMessage(text:string, location:string, alertType:string="alert-warning") {
      let message = '<div class="alert '+alertType+' alert-dismissible fade show" role="alert">'+
        text+ // aqui esta el mensaje
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
      '</div>'
        $(location).html(message)
        setTimeout(() => {$(location).html('')},5000)
    }
    // -------- eliminar usuarios -----------------------------

    function deleteUser(document: any){
     return new Promise(() => {
      let idUser = -1
      let nameUser: any

      for(var i = 0; i < usersList.length; i++) {
          
        if(usersList[i].cedula_usuario == document) {
          nameUser = usersList[i].nombre_usuario
          idUser = usersList[i]._id
            break      
        }
      }

      fetch(URLHost + "/api/usuarios/eliminar/" + idUser, {
        method: 'DELETE',
      }).then(() => {
        $("#Form_user").html('')
        ShowMessage('<strong>Se ha eliminado!</strong>El usuario '+nameUser,'#messageEdit')
        $("#btn_eliminar").hide()
        $("#btn_editar").hide()
        UpdateList()

      })

     });
    }

    //------------------ buscar usuario -----------------------------
    
    function searchUser(document: any) {
      let finded = false;
        for(var i = 0; i < usersList.length; i++) {

          
          if(usersList[i].cedula_usuario == document) {
            finded = true;
              //---------- imprime la el formulario con los datos del usuario
              let result = '<label for="recipient-name" class="col-form-label">nombre</label>'+
              '<input id="inp_name" type="text" class="form-control" value="'+ usersList[i].nombre_usuario +'">'+
              '<label for="recipient-name" class="col-form-label">email</label>'+
              '<input id="inp_email" type="text" class="form-control" value="'+ usersList[i].email_usuario +'">'+
              '<label for="recipient-name" class="col-form-label">usuario</label>'+
              '<input id="inp_user" type="text" class="form-control" value="'+ usersList[i].usuario +'">'+
              '<label for="recipient-name" class="col-form-label">password</label>'+
              '<input id="inp_password" type="text" class="form-control" value="'+ usersList[i].password +'">'
              
              $("#Form_user").html(result)
              // muestra los botones de editar y eliminar
              $("#btn_eliminar").show()
              $("#btn_editar").show()
              break
              
          }
        }

        if(!finded){
          $("#Form_user").html('')
          $("#btn_eliminar").hide()
          $("#btn_editar").hide()
          
        }
        
    }

//------------------- guardar usuario -------------------------------
    function saveUsuer(newDocument: any , newName: any, newEmail: any, newUser: any, newPassword: any){
      return new Promise<void>(() => {

        fetch(URLHost + "/api/usuarios/guardar/", {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "cedula_usuario":String(newDocument),
          "nombre_usuario": String(newName),
          "email_usuario":String(newEmail),
          "usuario":String(newUser),
          "password":String(newPassword)})
        }).then(() => {
          UpdateList()
          ShowMessage("Usuario creado","#message")
        })

      })
    }
    //------------------- actualizar usuario ------------------------
    /**
     * se encarga de actualizar a los usuarios registrados en la base de datos 
     * @param document 
     * @param newName 
     * @param newEmail 
     * @param newUser 
     * @param newPassword 
     * @returns 
     */
    function updateUsuer(document: any , newName: any, newEmail: any, newUser: any, newPassword: any){
      return new Promise<void>(() => {

        let idUser = -1

      for(var i = 0; i < usersList.length; i++) {
          
        if(usersList[i].cedula_usuario == document) {
          idUser = usersList[i]._id
            break      
        }
      }

        fetch(URLHost + "/api/usuarios/actualizar/" + idUser, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "nombre_usuario": String(newName),
          "email_usuario":String(newEmail),
          "usuario":String(newUser),
          "password":String(newPassword)})
        }).then(() => {
          UpdateList()
          ShowMessage("<strong>Se ha actualizado el Usuario</strong>","#Form_user")
        })

      })
    }
    //-------------------- traer el listado de usuarios --------------------
    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla 
     * @returns lista de usuarios 
     */
    function getUsers() {
      return new Promise((resolve, reject) => {

        fetch(URLHost + "/api/usuarios/listar", {
          method: 'GET',
        }).then(result => result.json().then(
          data => {
            JSON.stringify(data)
            resolve(data);
            let salida = '<div class="table-responsive"><table class="table">';
            salida = salida + '<tr> <thead class="table-dark"> <th scope="col">#</th>'+
            '<th scope="col">cedula</th>'+
            '<th scope="col">NOMBRE</th>'+
            '<th scope="col">CORREO</th>'+
            '<th scope="col">USUARIO</th>'+
            '<th scope="col">CONTRASEÑA</th>'+
            '</thead><tbody>';

            for (var iterator in data) {
              console.log(data[iterator].usuario)
              salida = salida + '<tr><th scope="row">'+iterator+'</th>';
              salida = salida + '<td>' + data[iterator].cedula_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].nombre_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].email_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].usuario + '</td>';
              salida = salida + '<td>' + data[iterator].password + '</td>';
              salida = salida + '</tr>';
              
            }
            salida = salida + "<tbody></table></div>";
				    $("#tbUsers").html(salida);
          }
        ));

      });
    }
  }


}
