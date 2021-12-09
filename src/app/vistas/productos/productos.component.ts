import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Papa } from 'ngx-papaparse'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  constructor(private papa: Papa) { }

  ngOnInit(): void {

    const URLHost = "http://3.15.208.210:8087"
    // -------- se utiliza para guardar la lista de productos que recibe de la api ------------
    let productList: any;
    UpdateList()
  
    $("#btn_eliminar").hide()
    $("#btn_editar").hide()
    $("#btn_Subir").hide()

    // se utiliza para guardar un array con los productos por guardar 
    let auxList: any;

    // ----------- mensaje en el navbar ---------------
    $("#mensajeNav").html('<i class="fas fa-wifi"></i></i>Conectado a <strong>Cali</strong>')

    $("#btn_buscar").on("click", () => {

      let document = $("#inp_code").val();
      searchProduct(document);

    })

    $("#btn_editar").on("click",() => {
      let code = $("#inp_code").val();
      let name = $("#inp_name").val();
      let nit = $("#inp_nit").val();
      let buyPrice = $("#inp_precioC").val();
      let iva = $("#inp_iva").val();
      let sellPrice = $("#inp_precioV").val();
      let url = $("#inp_url").val();
    

      if(ValidTextField(code) 
      && ValidTextField(name) 
      && ValidTextField(nit)
      && ValidTextField(buyPrice) 
      && ValidTextField(iva)
      && ValidTextField(sellPrice)
      && ValidTextField(url)
      ){
        updateUsuer(code, name, nit ,buyPrice, iva, sellPrice, url);
      }else{
        ShowMessage("los campos son incorrectos o estan vacios ","#messageEdit","alert-danger")
      }

    })

    $("#btn_eliminar").on("click", () => {
      let code = $("#inp_code").val();
      if (code != '') {
        deleteProduct(code);
      }
    })

    $("#btn_crearP").on("click", () => {


      let code = $("#inp_newCode").val();
      let name = $("#inp_newName").val();
      let nit = $("#inp_newNit").val();
      let buyPrice = $("#inp_newBuyPrice").val();
      let iva = $("#inp_newIva").val();
      let sellPrice = $("#inp_newSellPrice").val();
      let url = $("#inp_newUrl").val();

      if (productExist(code)) {
        ShowMessage("el usuario ya se encuentra registrado", "#message")
      } else {
        if (
          // compreba los valores
          ValidTextField(code)
          && ValidTextField(name)
          && ValidTextField(nit)
          && ValidTextField(buyPrice)
          && ValidTextField(iva)
          && ValidTextField(sellPrice)
          && ValidTextField(url)
        ) {
          saveProduct(code, name, nit, buyPrice, iva, sellPrice, url);
        } else {

          ShowMessage("<strong>Informacion Invalida!</strong>" +
            "Los campos son incorrectos o estan en blanco", "#message", "alert-danger")
        }

      }


    })

    //----------- boton para visualizar el csv --------------------
    $("#btn_Accept").on("click", () => {
      let inputFile: any;
      try {
        const inputFile = document.getElementById('inp_documentNew') as HTMLInputElement;

        var extPermitidas =  /(.csv)$/i;
        let jsonData = inputFile.files?.item(0);

        if(extPermitidas.exec(inputFile.value)){
          getCSV(jsonData).then((data) => {

            auxList = data
            let salida = '<div class="table-responsive"> <table class="table">';
            salida = salida + '<thead> <tr> <th scope="col">#</th>'
  
  
            for (let i = 0; i < auxList.length; i++) {
  
              if (i == 0) {
                salida +=
                  '<th scope="col">' + auxList[i][0] + '</th>' +
                  '<th scope="col">' + auxList[i][1] + '</th>' +
                  '<th scope="col">' + auxList[i][2] + '</th>' +
                  '<th scope="col">' + auxList[i][3] + '</th>' +
                  '<th scope="col">' + auxList[i][4] + '</th>' +
                  '<th scope="col">' + auxList[i][5] + '</th>' +
                  '<th scope="col">' + auxList[i][6] + '</th>' +
                  '</th></thead><tbody>';
  
              } else if (auxList[i][0] != '') {
  
                salida = salida + '<tr><th scope="row">' + i + '</th>';
                salida = salida + '<td>' + auxList[i][0] + '</td>';
                salida = salida + '<td >' + auxList[i][1] + '</td>';
                salida = salida + '<td>' + auxList[i][2] + '</td>';
                salida = salida + '<td>' + auxList[i][3] + '</td>';
                salida = salida + '<td>' + auxList[i][4] + '</td>';
                salida = salida + '<td>' + auxList[i][5] + '</td>';
                salida = salida + '<td>' + auxList[i][6] + '</td>';
                salida = salida + '</tr>';
  
              }
  
            }
            salida = salida + "</tbody></table></div>";
            $("#result").html(salida);
            $("#btn_Subir").show()
  
          })

        }else{
          ShowMessage("<strong>archivo no valido! </strong>asegurese de que la exetencion es .csv","#CSVmessage","btn btn-danger")
        }
        


      } catch (error) {
        console.log(error)

      }

    })

    //---------- guardar listado csv -----------
    $("#btn_Subir").on("click",() => {
      $("#result").html("")
      $("#btn_Subir").hide()
      
      let resultList: String[] = []

      let code: String
      let name: String
      let nit: String
      let buyPrice: Number
      let iva: Number
      let sellPrice: Number
      let url: String

      for (let i = 1; i < auxList.length; i++) {
        if(auxList[i] != "" ){
          
          code = auxList[i][0]
          name = auxList[i][1]
          nit = auxList[i][2]
          buyPrice = auxList[i][3]
          iva = auxList[i][4]
          sellPrice = auxList[i][5]
          url = auxList[i][6]

          if(code == ''){ 
            
          }else  
         if(productExist(code)){
          resultList.push('<i class="fas fa-exclamation-triangle"></i> El producto ' + name + ' ya existe con el codigo ' + code)
         }else{
          resultList.push('<i class="fas fa-check"></i> El producto ' + name + ' se ha guardado con el codigo ' + code)
          saveProduct(code, name, nit, buyPrice, iva, sellPrice, url)           
         }
         
        }
      }
      let message = ''

     for(var i=0; i<resultList.length; i++){
      message += '<div class="alert alert alert-dark alert-dismissible fade show" role="alert">' +
      resultList[i] + // aqui esta el mensaje
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
      '</div>'
     }

     $("#CSVmessage").html(message)
     
    })

    
    // ---------------- funciones -----

    /**
     * se encarga de convertir el csv en json
     * @param csv 
     * @returns 
     */
    function getCSV(csv: any) {
      return new Promise((resolve, reject) => {
        let papaParseParser = new Papa;
        let csvData = csv;
        let options = {
          complete: (results: any, file: any) => {
            resolve(results.data);
          }

        };

        papaParseParser.parse(csvData, options);

      })

    }


    // -------------------------------


    //----------- actulizar tabla de clientes ----------------------------
    function UpdateList() {
      getProducts().then((data) => {
        productList = data
      });
    }
    //---------------- mensajes ----------------
    /**
      * muestra una alerta en la pagina
      * @param text el texto que se va a mostrar en el mensaje
      * @param location el id de la etiqueta html en la que se va a mostrar el mensaje
      * @param alertType el estilo de alerta de bootstrap [alert-primary, alert-secondary, alert-success, 
      * alert-danger, alert-warning, alert-info, alert-light, alert-dark]
      */

    function ShowMessage(text: string, location: string, alertType: string = "alert-warning") {
      let message = '<div class="alert ' + alertType + ' alert-dismissible fade show" role="alert">' +
        text + // aqui esta el mensaje
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>'
      $(location).html(message)
      setTimeout(() => { $(location).html('') }, 5000)
    }

    /**
     * valida que el texto que se ingresa cumpla con los requisitos
     */
    function ValidTextField(text: any, lengthMin: number = 3) {
      console.log(text)
      if (text == "" || text == undefined || text.length < lengthMin) return false
      else return true;

    }
    function productExist(code: any) {
      let exists = false
      for (var i = 0; i < productList.length; i++) {
        if (code == productList[i].codigo_producto) {
          exists = true
          break
        }
      }
      return exists
    }

    // -------- traer todos los productos --------------------
    /**
    * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla 
    * @returns lista de usuarios 
    */
    function getProducts() {
      return new Promise((resolve, reject) => {

        fetch(URLHost + "/api/productos/listar", {
          method: 'GET',
        }).then(result => result.json().then(
          data => {
            JSON.stringify(data)
            resolve(data);
            let salida = '<div class="row row-cols-1 row-cols-md-3 g-4">';

            for (var iterator in data) {

              salida += '<div class="col">' +
                '<div class="card h-100">' +
                '<img src="' + data[iterator].imagen_url + '" class="card-img-top" alt="...">' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + data[iterator].nombre_producto + '</h5>' +
                '<p class="card-text"> <strong>Codigo </strong>' + data[iterator].codigo_producto + '</p>' +
                '<p class="card-text"> <strong>Precio sin iva </strong>' + data[iterator].precio_venta + '</p>' +
                '<p class="card-text"> <strong>Valor iva </strong>' + data[iterator].iva_compra + '</p>' +
                '<hr>'+
                '<p class="card-text"> <strong>Valor total </strong>' + (data[iterator].precio_venta + data[iterator].iva_compra) + '</p>' +

                '</div>' +
                '</div>' +
                '</div>'

            }
            salida = salida + "<tbody></table>";
            $("#tbProduct").html(salida);
          }
        ));

      });
    }

    // -------- gurdar productos --------
    function saveProduct(newCode: any, newName: any, newNit: any, newBuyPrice: any, newIva: any, newSellPrice: any, newURL: any) {
      return new Promise<void>(() => {


        fetch(URLHost + "/api/productos/guardar", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "codigo_producto": String(newCode),
            "nombre_producto": String(newName),
            "nit_proveedor": String(newNit),
            "precio_compra": Number(newBuyPrice),
            "iva_compra": Number(newIva),
            "precio_venta": Number(newSellPrice),
            "imagen_url": String(newURL)
          })
        }).then(() => {
          UpdateList()
          ShowMessage("Producto creado", "#message", "alert-success")
        })

      })
    }

    //------------- buscar --------------------------------
    function searchProduct(code: any) {
      let finded = false;
      for (var i = 0; i < productList.length; i++) {


        if (productList[i].codigo_producto == code) {
          finded = true;
          //---------- imprime la el formulario con los datos del usuario
          let result = '<label for="inp_name" class="col-form-label">Nombre</label>' +
            '<input id="inp_name" type="text" class="form-control" value="' + productList[i].nombre_producto + '">' +
            '<label for="inp_nit" class="col-form-label">Nit</label>' +
            '<input id="inp_nit" type="text" class="form-control" value="' + productList[i].nit_proveedor + '">' +
            '<label for="inp_precioC" class="col-form-label">Precio compra</label>' +
            '<input id="inp_precioC" type="text" class="form-control" value="' + productList[i].precio_compra + '">' +
            '<label for="inp_iva" class="col-form-label">iva</label>' +
            '<input id="inp_iva" type="text" class="form-control" value="' + productList[i].iva_compra + '">' +
            '<label for="inp_precioV" class="col-form-label">Precio venta</label>' +
            '<input id="inp_precioV" type="text" class="form-control" value="' + productList[i].precio_venta + '">' +
            '<label for="inp_url" class="col-form-label">URL imagen</label>' +
            '<input id="inp_url" type="text" class="form-control" value="' + productList[i].imagen_url + '">'


          $("#Form_Product").html(result)
          // muestra los botones de editar y eliminar
          $("#btn_eliminar").show()
          $("#btn_editar").show()
          break

        }
      }
    }
    // -------- eliminar clientes -----------------------------

    function deleteProduct(codeProduct: any) {
      return new Promise(() => {
        let idProduct = -1
        let nameProduct: any

        for (var i = 0; i < productList.length; i++) {

          if (productList[i].codigo_producto == codeProduct) {
            nameProduct = productList[i].nombre_producto
            idProduct = productList[i]._id
            break
          }
        }

        fetch(URLHost + "/api/productos/eliminar/" + idProduct, {
          method: 'DELETE',
        }).then(() => {
          ShowMessage('<strong>Se ha eliminado! </strong>El producto ' + nameProduct, '#messageEdit')
          $("#Form_Product").html("")
          $("#btn_eliminar").hide()
          $("#btn_editar").hide()
          UpdateList()

        })

      });
    }

     // --------------------- actualizar clientes --------------------
     function updateUsuer(code: any , newName: any, newNit: any, newBuyPrice: any,newIva: any, newSellPrice: any, newUrl: any){
      return new Promise<void>(() => {

        let idProduct = -1

      for(var i = 0; i < productList.length; i++) {
          
        if(productList[i].codigo_producto == code) {
          idProduct = productList[i]._id
            break      
        }
      }

        fetch(URLHost + "/api/productos/actualizar/" + idProduct, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "nombre_producto": String(newName),
          "nit_proveedor":String(newNit),
          "precio_compra":Number(newBuyPrice),
          "iva_compra":Number(newIva),
          "precio_venta":Number(newSellPrice),
          "imagen_url":String(newUrl)
        })
        }).then(() => {
          UpdateList()
          $("#btn_eliminar").hide()
          $("#btn_editar").hide()
          ShowMessage('<strong>Se ha actualizado </strong> el Producto',"#messageEdit")
          $("#Form_Product").html("")

        })

      })
    }

  }
  

}
