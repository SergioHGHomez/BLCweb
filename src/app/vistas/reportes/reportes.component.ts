import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const ventasApiUrl: RequestInfo = 'http://3.15.208.210:8085';
    const clienetesApiUrl: RequestInfo = 'http://3.15.208.210:8086'

    let clientsList: any;
  

    $('#mensajeNav').html(
      '<i class="fas fa-wifi"></i></i>Conectado a <strong>Bogotá</strong>'
    );

    $('#btn_findSells').on('click', () => {
      let document:string = String ($("#inp_document").val());
      if (document == "") {
        ShowMessage("La cedula esta en blanco","#tblContent","alert-danger")
      }else{
        showSells(document);
        // sellModal.focus;
      }
      
    });

    $('#btn_findClient').on("click",() => {
      let document = $('#inp_document').val()
      if (document) {
        showClient(String(document))
      }else {
        
        showAllClients()
      }

    })

    function ShowMessage(text:string, location:string, alertType:string="alert-warning") {
      let message = '<div class="alert '+alertType+' alert-dismissible fade show" role="alert">'+
        text+ // aqui esta el mensaje
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
      '</div>'
        $(location).html(message)
        setTimeout(() => {$(location).html('')},5000)
    }

    function showSells(document: string) {
      fetch(ventasApiUrl + '/api/ventas/buscarVentas/' + document, {
        method: 'GET',
      })
        .then((data) =>
          data.json().then((data) => {
            JSON.stringify(data);
            console.log(data);
            let total: number = 0;
            let salida = '<div class="table-responsive"><table class="table">';
            salida =
              salida +
              '<tr> <thead class="table-dark"> <th scope="col">#</th>' +
              '<th scope="col">CODIGO DE VENTA</th>' +
              '<th scope="col">Nombre cliente </th>' +
              '<th scope="col">Total de la venta</th>' +
              '</thead><tbody>';

            for (var iterator in data) {
              salida = salida + '<tr><th scope="row">' + iterator + '</th>';
              salida = salida + '<td>' + data[iterator].codigo_venta + '</td>';
              salida =
                salida + '<td>' + data[iterator].nombre_cliente + '</td>';
              salida =
                salida + '<td>' + data[iterator].valorTotal_masIva + '</td>';
              salida = salida + '</tr>';

              total += Number(data[iterator].valorTotal_masIva);
            }
            salida +=
              '<tr>' +
              '<th scope="row"><i class="fas fa-equals"></i></th>' +
              '<td colspan="2" class="table-active">Total de ventas </td>' +
              '<td>'+total+'</td>' +
              '</tr>';
            salida = salida + '</tbody></table></div>';
            $('#tblContent').html(salida);
          })
        )
        .catch(() => {
          console.log('no connection with the api');
        });
    }
    
    function showAllClients(){
      fetch (clienetesApiUrl + '/api/clientes/listar',{
        method: 'GET',
      }).then(data => data.json().then(
        data =>  {JSON.stringify(data)
        console.log(data)
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
            $("#tblClient").html(salida);
      }
      ))
    }

    function showClient(document: string){
      fetch (clienetesApiUrl + '/api/clientes/buscar/' + document ,{
        method: 'GET',
      }).then(data => data.json().then(
        data =>  {JSON.stringify(data)
        console.log(data)
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
            $("#tblClient").html(salida);
      }
      ))
    }



  }
}
