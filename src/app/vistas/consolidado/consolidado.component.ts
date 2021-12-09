import { Component, OnInit } from '@angular/core';
import { resultCityI } from '../../modelos/resultCityI.interface';

@Component({
  selector: 'app-consolidado',
  templateUrl: './consolidado.component.html',
  styleUrls: ['./consolidado.component.css'],
})
export class ConsolidadoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let URLHost = 'http://3.15.208.210:8088';

    $('#mensajeNav').html(
      '<i class="fas fa-wifi"></i></i>Conectado a <strong>Bogotá</strong>'
    );

    getSellbyCity();

    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla
     * @returns lista de usuarios
     */
    function getSellbyCity() {
      return new Promise((resolve, reject) => {
        let bogotaResult: ResultCity = new ResultCity("bogota");
        let medellinResult: ResultCity = new ResultCity("medellin");
        let caliResult: ResultCity = new ResultCity("cali");

        fetch(URLHost + '/api/consolidacion/listar', {
          method: 'GET',
        }).then((result) =>
          result.json().then((data) => {
            JSON.stringify(data);
            resolve(data);

            for (var iterator in data) {
              switch (data[iterator].ciudad) {
                case 'Bogotá':
                  bogotaResult.total += data[iterator].total_ventas;
                  break;
                case 'Medellín':
                  medellinResult.total += data[iterator].total_ventas
                  break;
                case 'Cali':
                  caliResult.total += data[iterator].total_ventas
                  break;
                default:
                  break;
              }

              
            }
            console.log("b " + bogotaResult.total + " m " + medellinResult.total + " c " + caliResult.total )
            showResult("#bogotaResult",bogotaResult.total)
            showResult("#medellinResult",medellinResult.total,"Medellin")
            showResult("#caliResult",caliResult.total,"Cali")
            showResult("#totalResult",(bogotaResult.total + medellinResult.total + caliResult.total),"Total Vendido")
            
          })
        );
      });
    }
    // ---------------- mostrar el resultado de la ciudad --------------------------------
    /**
     * muestra el resultado de las ventas de las ciudades en una tabla
     * @param location // hace referencia al id del la etiqueta en la que se va a mostrar la tabla 
     * @param result // valor total a mostrar
     * @param city  // ciudad de la que se esta mostrando el resultado 
     */
    function showResult(
      location: String ,
      result: number = 0,
      city: String = 'Bogota'
    ) {
      let salida = '<div class="table-responsive"><table class="table">';
      salida =
        salida +
        '<tr> <thead class="table-dark"> ' +
        '<th scope="col">Ciudad</th>' +
        '<th scope="col">total</th>' +
        '</thead><tbody>';

      salida += '<td>' + city + '</td>';
      salida += '<td>' + result + '</td>';
      salida += '</tr>';

      salida = salida + '</tbody></table></div>';
      $(location).html(salida);
    }

  }
}

// -------- clases ----------------------------------------------------------------
class ResultCity implements resultCityI {
  city: string ;
  total: number ;

  constructor(city:string, total =0) {
    this.city = city;
    this.total = total;
  }
}