import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const URLHost = "http://3.15.208.210:8087"
    let clientsList: any;
    
    
    
    $("#mensajeNav").html('<i class="fas fa-wifi"></i></i>Conectado a <strong>Cali</strong>')
    $("#btn_eliminar").hide()
    $("#btn_editar").hide()

    UpdateList()

    $("#btn_crearPv").on("click", () => {


      let pCode = $("#inp_newCode").val();
      let pName = $("#inp_newName").val();
      let pEmail = $("#inp_newEmail").val();
      let pNit = $("#inp_newNit").val();
      let ptelephone = $("#inp_newtelephone").val();

      if (ClientExist(pCode)){
          ShowMessage("<strong>el Proveedor</strong> ya se encuentra registrado","#message")
      }else{
        if (
          // compreba los valores
          ValidTextField(pCode,1)
          && ValidTextField(pName)
          && ValidTextField(pEmail)
          && ValidTextField(pNit)
          && ValidTextField(ptelephone)
        ) {
          saveClient(pCode, pName, pEmail, pNit, ptelephone);
        } else {
  
          ShowMessage("<strong>Informacion Invalida!</strong>" +
            "Los campos son incorrectos o estan en blanco", "#message","alert-danger")
        }

      }
      
     
    })

    $("#btn_buscar").on("click", () => {

      let code = $("#inp_code").val();
      searchClient(code);

    })

    $("#btn_editar").on("click",() => {
      let code = $("#inp_code").val();
      let name = $("#inp_name").val();
      let email = $("#inp_email").val();
      let nit = $("#inp_nit").val();
      let telephone = $("#inp_telephone").val();
    

      if(ValidTextField(code,1) 
      && ValidTextField(name) 
      && ValidTextField(email)
      && ValidTextField(nit) 
      && ValidTextField(telephone)){
        updateUsuer(code, name, email ,nit, telephone)
      }else{
        ShowMessage("los campos son incorrectos o estan vacios ","#messageEdit","alert-danger")
      }

    })

    $("#btn_eliminar").on("click",() => {
      let code = $("#inp_code").val();
      if( code != '' ){
        deleteClient(code);
      }
    })


    
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

        fetch(URLHost + "/api/proveedores/listar", {
          method: 'GET',
        }).then(result => result.json().then(
          data => {
            JSON.stringify(data)
            resolve(data);
            let salida = '<div class="table-responsive"><table class="table">';
            salida = salida + '<tr> <thead class="table-dark"> <th scope="col">#</th>' +
              '<th scope="col">CODIGO</th>' +
              '<th scope="col">NOMBRE</th>' +
              '<th scope="col">EMAIL</th>' +
              '<th scope="col">NIT</th>' +
              '<th scope="col">TELEFONO</th>' +
              '</thead><tbody>';

            for (var iterator in data) {
              
              salida = salida + '<tr><th scope="row">' + iterator + '</th>';
              salida = salida + '<td>' + data[iterator].codigo_proveedor + '</td>';
              salida = salida + '<td>' + data[iterator].nombre_proveedor + '</td>';
              salida = salida + '<td>' + data[iterator].email_proveedor + '</td>';
              salida = salida + '<td>' + data[iterator].nit_proveedor + '</td>';
              salida = salida + '<td>' + data[iterator].telefono_proveedor + '</td>';
              salida = salida + '</tr>';

            }
            salida = salida + "<tbody></table></div>";
            $("#tbSupplier").html(salida);
          }
        ));

      });
    }

    //------------------- guardar cliente  -------------------------------
    function saveClient(newCode: any, newName: any, newEmail: any, newNit: any, newTelephone: any) {
      return new Promise<void>(() => {


        fetch(URLHost + "/api/proveedores/guardar", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "codigo_proveedor": String(newCode),
            "nombre_proveedor": String(newName),
            "email_proveedor": String(newEmail),
            "nit_proveedor": String(newNit),
            "telefono_proveedor": String(newTelephone)
          })
        }).then(() => {
          UpdateList()
          ShowMessage("proveedor creado","#message","alert-success")
        })

      })
    }

    //------------- buscar --------------------------------
    function searchClient( code: any) {
      let finded = false;
      for (var i = 0; i < clientsList.length; i++) {


        if (clientsList[i].codigo_proveedor == code || clientsList[i].nit_proveedor == code) {
          finded = true;
          //---------- imprime la el formulario con los datos del usuario
          let result = '<label for="recipient-name" class="col-form-label">Nombre</label>' +
            '<input id="inp_name" type="text" class="form-control" value="' + clientsList[i].nombre_proveedor + '">' +
            '<label for="recipient-name" class="col-form-label">Correo</label>' +
            '<input id="inp_email" type="text" class="form-control" value="' + clientsList[i].email_proveedor + '">' +
            '<label for="recipient-name" class="col-form-label">Nit</label>' +
            '<input id="inp_nit" type="text" class="form-control" value="' + clientsList[i].nit_proveedor + '">' +
            '<label for="recipient-name" class="col-form-label">Telefono</label>' +
            '<input id="inp_telephone" type="text" class="form-control" value="' + clientsList[i].telefono_proveedor + '">'


          $("#Form_Supplier").html(result)
          // muestra los botones de editar y eliminar
          $("#btn_eliminar").show()
          $("#btn_editar").show()
          break

        }
      }
    }

    function updateUsuer(code: any , newName: any, newTelephone: any, newNit: any, newEmail: any){
      return new Promise<void>(() => {

        let idSupplier = -1

      for(var i = 0; i < clientsList.length; i++) {
          
        if(clientsList[i].codigo_proveedor == code || clientsList[i].nit_proveedor == code) {
          idSupplier = clientsList[i]._id
            break      
        }
      }

        fetch(URLHost + "/api/proveedores/actualizar/" + idSupplier, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "nombre_proveedor": String(newName),
          "email_proveedor":String(newTelephone),
          "nit_proveedor":String(newNit),
          "telefono_proveedor":String(newTelephone),})
        }).then(() => {
          UpdateList()
          $("#btn_eliminar").hide()
          $("#btn_editar").hide()
          ShowMessage('<strong>Se ha actualizado el proveedor</strong>',"#Form_Supplier")

        })

      })
    }

    function deleteClient(code: any){
      return new Promise(() => {
       let idSupplier = -1
       let name: any
 
       for(var i = 0; i < clientsList.length; i++) {
           
         if(clientsList[i].codigo_proveedor == code || clientsList[i].nit_proveedor == code) {
           name = clientsList[i].nombre_proveedor
           idSupplier = clientsList[i]._id
             break      
         }
       }
 
       fetch(URLHost + "/api/proveedores/eliminar/" + idSupplier, {
         method: 'DELETE',
       }).then(() => {
         $("#Form_Supplier").html('')
         ShowMessage('<strong>Se ha eliminado! </strong>El Proveedor '+name,'#messageEdit')
         $("#btn_eliminar").hide()
         $("#btn_editar").hide()
         UpdateList()
 
       })
 
      });
     }
  }

}
