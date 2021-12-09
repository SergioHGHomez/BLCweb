import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //------------------- variables ----------------------------------------------------
    const URLHost = "http://3.15.208.210:8086"
    let clientsList: any;
    $("#btn_eliminar").hide()
    $("#btn_editar").hide()


    $("#mensajeNav").html('<i class="fas fa-wifi"></i></i>Conectado a <strong>Medellín</strong>')
    UpdateList()

    $("#btn_buscar").on("click", () => {

      let document = $("#inp_document").val();
      searchClient(document);

    })

    $("#btn_crearC").on("click", () => {


      let Cdocument = $("#inp_documentNew").val();
      let Cname = $("#inp_nameNew").val();
      let Caddress = $("#inp_addressNew").val();
      let Ctelephone = $("#inp_telephoneNew").val();
      let Cemail = $("#inp_emailNew").val();

      if (ClientExist(Cdocument)){
          ShowMessage("el usuario ya se encuentra registrado","#message")
      }else{
        if (
          // compreba los valores
          ValidTextField(Cdocument)
          && ValidTextField(Cname)
          && ValidTextField(Caddress)
          && ValidTextField(Ctelephone)
          && ValidTextField(Cemail)
        ) {
          saveClient(Cdocument, Cname, Caddress, Ctelephone, Cemail);
        } else {
  
          ShowMessage("<strong>Informacion Invalida!</strong>" +
            "Los campos son incorrectos o estan en blanco", "#message","alert-danger")
        }

      }
      
     
    })

    $("#btn_eliminar").on("click",() => {
      let document = $("#inp_document").val();
      if( document != '' ){
        deleteClient(document);
      }
    })

    $("#btn_editar").on("click",() => {
      let document = $("#inp_document").val();
      let name = $("#inp_name").val();
      let address = $("#inp_address").val();
      let telephone = $("#inp_telephone").val();
      let email = $("#inp_email").val();
    

      if(ValidTextField(document) 
      && ValidTextField(name) 
      && ValidTextField(address)
      && ValidTextField(telephone) 
      && ValidTextField(email)){
        updateUsuer(document, name, address ,telephone, email)
      }else{
        ShowMessage("los campos son incorrectos o estan vacios ","#messageEdit","alert-danger")
      }

    })

    // ------------- funciones ----------------------------------------------------

    //---------------- mensajes ----------------
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
    //---------- comporbar campos -------------------------

    function ValidTextField(text: any, lengthMin: number = 3, lengthMax: number = 25) {
      if (text == "" || text == undefined || text.length < lengthMin || text.length > lengthMax) return false
      else return true;

    }

    function ClientExist(document: any) {
      let exists = false
      for (var i = 0; i < clientsList.length; i++) {
            if( document == clientsList[i].cedula_clientes){
                exists = true
                break
            }
        }
        return exists
    }

    //------------- buscar --------------------------------
    function searchClient(document: any) {
      let finded = false;
      for (var i = 0; i < clientsList.length; i++) {


        if (clientsList[i].cedula_clientes == document) {
          finded = true;
          //---------- imprime la el formulario con los datos del usuario
          let result = '<label for="recipient-name" class="col-form-label">Nombre</label>' +
            '<input id="inp_name" type="text" class="form-control" value="' + clientsList[i].nombre_clientes + '">' +
            '<label for="recipient-name" class="col-form-label">Direccion</label>' +
            '<input id="inp_address" type="text" class="form-control" value="' + clientsList[i].direccion_clientes + '">' +
            '<label for="recipient-name" class="col-form-label">Telefono</label>' +
            '<input id="inp_telephone" type="text" class="form-control" value="' + clientsList[i].telefono_clientes + '">' +
            '<label for="recipient-name" class="col-form-label">Correo</label>' +
            '<input id="inp_email" type="text" class="form-control" value="' + clientsList[i].email_clientes + '">'


          $("#Form_client").html(result)
          // muestra los botones de editar y eliminar
          $("#btn_eliminar").show()
          $("#btn_editar").show()
          break

        }
      }
    }

    //----------- actulizar tabla de clientes ----------------------------
    function UpdateList() {
      getClients().then((data) => {
        clientsList = data
      });
    }
    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla 
     * @returns lista de usuarios 
     */
    function getClients() {
      return new Promise((resolve, reject) => {

        fetch(URLHost + "/api/clientes/listar", {
          method: 'GET',
        }).then(result => result.json().then(
          data => {
            JSON.stringify(data)
            resolve(data);
            let salida = '<div class="table-responsive"><table class="table">';
            salida = salida + '<tr> <thead class="table-dark"> <th scope="col">#</th>' +
              '<th scope="col">CEDULA</th>' +
              '<th scope="col">NOMBRE</th>' +
              '<th scope="col">DIRECCION</th>' +
              '<th scope="col">TELEFONO</th>' +
              '<th scope="col">CORREO</th>' +
              '</thead><tbody>';

            for (var iterator in data) {
              
              salida = salida + '<tr><th scope="row">' + iterator + '</th>';
              salida = salida + '<td>' + data[iterator].cedula_clientes + '</td>';
              salida = salida + '<td>' + data[iterator].nombre_clientes + '</td>';
              salida = salida + '<td>' + data[iterator].direccion_clientes + '</td>';
              salida = salida + '<td>' + data[iterator].telefono_clientes + '</td>';
              salida = salida + '<td>' + data[iterator].email_clientes + '</td>';
              salida = salida + '</tr>';

            }
            salida = salida + "</tbody></table></div>";
            $("#tbClient").html(salida);
          }
        ));

      });
    }

    //------------------- guardar cliente  -------------------------------
    function saveClient(newDocument: any, newName: any, newAddress: any, newTelephone: any, newEmail: any) {
      return new Promise<void>(() => {


        fetch(URLHost + "/api/clientes/guardar", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "cedula_clientes": String(newDocument),
            "nombre_clientes": String(newName),
            "direccion_clientes": String(newAddress),
            "telefono_clientes": String(newTelephone),
            "email_clientes": String(newEmail)
          })
        }).then(() => {
          UpdateList()
          ShowMessage("Usuario creado","#message","alert-success")
        })

      })
    }
     // -------- eliminar clientes -----------------------------

     function deleteClient(document: any){
      return new Promise(() => {
       let idUser = -1
       let nameClient: any
 
       for(var i = 0; i < clientsList.length; i++) {
           
         if(clientsList[i].cedula_clientes == document) {
           nameClient = clientsList[i].nombre_clientes
           idUser = clientsList[i]._id
             break      
         }
       }
 
       fetch(URLHost + "/api/clientes/eliminar/" + idUser, {
         method: 'DELETE',
       }).then(() => {
         $("#Form_client").html('')
         ShowMessage('<strong>Se ha eliminado! </strong>El cliente '+nameClient,'#messageEdit')
         $("#btn_eliminar").hide()
         $("#btn_editar").hide()
         UpdateList()
 
       })
 
      });
     }
     // --------------------- actualizar clientes --------------------
     function updateUsuer(document: any , newName: any, newAddress: any, newTelephone: any, newEmail: any){
      return new Promise<void>(() => {

        let idClient = -1

      for(var i = 0; i < clientsList.length; i++) {
          
        if(clientsList[i].cedula_clientes == document) {
          idClient = clientsList[i]._id
            break      
        }
      }

        fetch(URLHost + "/api/clientes/actualizar/" + idClient, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "nombre_clientes": String(newName),
          "direccion_clientes":String(newAddress),
          "telefono_clientes":String(newTelephone),
          "email_clientes":String(newEmail),})
        }).then(() => {
          UpdateList()
          $("#btn_eliminar").hide()
          $("#btn_editar").hide()
          ShowMessage('<strong>Se ha actualizado el Cliente</strong>',"#Form_client")

        })

      })
    }

  }

}
