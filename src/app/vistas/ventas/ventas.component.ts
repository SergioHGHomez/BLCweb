import { Component, OnInit } from '@angular/core';
import { cartListI } from '../../modelos/cartListI.interface';
import { productI } from '../../modelos/productI.interface';
import { saleI } from '../../modelos/saleI.interface';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const URLApiVentas = 'http://3.15.208.210:8085';
    const URLApiClientes = 'http://3.15.208.210:8086';
    const URLApiProductos = 'http://3.15.208.210:8087';
    const URLApiConsolidacion = 'http://3.15.208.210:8088';

    let productList: any;
    let clientList: any;
    let cartList: Array<ProductList> = [];
    let newSale: Sale = new Sale();

    // ----- muestra en la pagina al iniciar --------------------
    $('#mensajeNav').html(
      '<i class="fas fa-wifi"></i></i>Conectado a <strong>Bogotá</strong>'
    );
    UpdateList();
    newSale.codigo_venta = String(getInvoiceNumber());

    // ----- acciones de los botones de la pagina -----
    $('#btn_agregar').on('click', () => {
      addProduct();
    });

    $('#buscarcliente').on('click', () => {
      let document = String($('#inp_docCliente').val());
      searchClient(document);
    });

    $('#registrar').on('click', () => {
      saveSale();
    });

    $('#btn_cancelar').on('click', () => {
      window.location.reload();
    })

    // ---------- funciones --------------------------------
    // ----- actualiza la lista de productos  --------------------------------
    function UpdateList() {
      getProducts().then((data) => {
        productList = data;
      });
    }

    // -------- traer el numero de factura  --------------------------------

    /**
     * trae el numero de documentos de la base de datos --------------------------------
     * @returns numero de factura 
     */
    function getInvoiceNumber() {
      let invoice = 0;

      fetch(URLApiVentas + '/api/ventas/numeroVenta', {
        method: 'GET',
      }).then((result) => {
        result.json().then((data) => {
          invoice = data;
          invoice++;
          newSale.codigo_venta = String(invoice);
          $('#numFactura').val(invoice);
          $;
        });
      });

      return invoice;
    }

    //------------------------- buscar cliente ------------------------------------
    function searchClient(docClient: string) {
      getClients().then((data) => {
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].cedula_clientes == docClient) {
            newSale.cedula_cliente = clientList[i].cedula_clientes;
            newSale.nombre_clientes = clientList[i].nombre_clientes;
            newSale.telefono_clientes = clientList[i].telefono_clientes;
            newSale.direccion_clientes = clientList[i].direccion_clientes;

            $('#inp_nombre').val(String(newSale.nombre_clientes));
            $('#inp_dirr').val(String(newSale.direccion_clientes));
          }
        }
      });
    }

    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla
     * @returns lista de usuarios
     */
    function getClients() {
      return new Promise((resolve, reject) => {
        fetch(URLApiClientes + '/api/clientes/listar', {
          method: 'GET',
        }).then((result) =>
          result.json().then((data) => {
            clientList = data;
            JSON.stringify(data);
            resolve(data);
          })
        );
      });
    }

    // -------- traer todos los productos --------------------
    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla
     * @returns lista de usuarios
     */
    function getProducts() {
      return new Promise((resolve, reject) => {
        fetch(URLApiProductos + '/api/productos/listar', {
          method: 'GET',
        }).then((result) =>
          result.json().then((data) => {
            JSON.stringify(data);
            resolve(data);
            let select = document.getElementById('selectDescripcion');

            for (var iterator in data) {
              let option = document.createElement('option');
              option.value = data[iterator].codigo_producto;
              option.innerHTML = data[iterator].nombre_producto;

              select?.appendChild(option);
            }
          })
        );
      });
    }

    //----------------------- agregar producto --------------------Producto ------------------------------

    function addProduct() {
      let code = $('#inp_code').val();
      let select = $('#selectDescripcion').val();
      let numberProduct = $('#inp_cantidad').val();
      let productItem: ProductList = new ProductList();

      for (let i = 0; i < productList.length; i++) {
        if (
          productList[i].codigo_producto == code ||
          productList[i].codigo_producto == select
        ) {
          // agregando la informacion al la lista de productos
          productItem.code = productList[i].codigo_producto;
          productItem.Number = Number(numberProduct);
          productItem.name = productList[i].nombre_producto;
          productItem.unitValue = productList[i].precio_venta;
          productItem.ivaValue = productList[i].iva_compra * productItem.Number;
          productItem.total =
            productItem.ivaValue + (productItem.unitValue * productItem.Number);
          // sumando los valores a las lista de compra

          newSale.valorTotal_venta +=
            productItem.unitValue * productItem.Number;
          newSale.valor_iva += productItem.ivaValue;
          newSale.valorTotal_masIva += productItem.total;

          cartList.push(productItem);
          break;
        }
      }
      showCartList();
    }
    // ----- mostrar lista de porductos ------------

    function showCartList() {
      let tableResponse = '';
      tableResponse +=
        ' <div id="tb_detalle" class="col">' +
        '<table class="table text-center">' +
        '<thead>' +
        '<tr>' +
        '<th>Codigo</th>' +
        '<th>Descripcion</th>' +
        '<th>Cantidad</th>' +
        '<th>Valor Uni</th>' +
        '<th>Valor iva</th>' +
        '<th>Sub Total</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

      for (var i = 0; i < cartList.length; i++) {
        tableResponse +=
          '<tr>' +
          '<td>' +
          cartList[i].code +
          '</td>' +
          '<td>' +
          cartList[i].name +
          '</td>' +
          '<td>' +
          cartList[i].Number +
          '</td>' +
          '<td>' +
          cartList[i].unitValue +
          '</td>' +
          '<td>' +
          cartList[i].ivaValue +
          '</td>' +
          '<td>' +
          cartList[i].total +
          '</td>' +
          '</tr>';
      }

      '</table>' + '</div>';

      $('#tbDetalle').html(tableResponse);
      $('#inp_total').val(newSale.valorTotal_venta);
      $('#inp_iva').val(newSale.valor_iva);
      $('#inp_totalMasIva').val(newSale.valorTotal_masIva);
    }
    // -------- guardar las ventas --------------------------------

    function saveSale() {
      newSale.fecha_hora = String($('#date').val());
      let optionSaleType = String($('#opventa').val());
      let optionCity = String($('#opCiudad').val());

      switch (optionSaleType) {
        case '1':
          newSale.tipo_de_venta = 'contado';
          break;
        case '2':
          newSale.tipo_de_venta = 'cuenta_corriente';
          break;
        case '3':
          newSale.tipo_de_venta = 'credito';
          break;

        default:
          break;
      }

      switch (optionCity) {
        case '1':
          newSale.sucursal = 'Bogotá';
          break;
        case '2':
          newSale.sucursal = 'Medellín';
          break;
        case '3':
          newSale.sucursal = 'Cali';
          break;

        default:
          break;
      }

      if (newSale.fecha_hora == '') {
        alert(' no se ha ingresado la fecha ');
      } else if (newSale.nombre_clientes == '') {
        alert('no se ha ingresado el cliente ');
      } else if (cartList.length == 0) {
        alert('no se ha ingresado ningun producto ');
      } else {
        fetch(URLApiVentas + '/api/ventas/guardar', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            codigo_venta: newSale.codigo_venta,
            nombre_cliente: newSale.nombre_clientes,
            cedula_cliente: newSale.cedula_cliente,
            direccion_cliente: newSale.direccion_clientes,
            telefono_cliente: newSale.telefono_clientes,
            valorTotal_venta: newSale.valorTotal_venta,
            valor_iva: newSale.valor_iva,
            valorTotal_masIva: newSale.valorTotal_masIva,
            detalle_veta: cartList,
            fecha_hora: newSale.fecha_hora,
            tipo_de_venta: newSale.tipo_de_venta,
            sucursal: newSale.sucursal,
          }),
        }).then(() => {
          // localStorage.setItem('numeroFactura', String(newSale.codigo_venta));
          fetch(URLApiConsolidacion + '/api/consolidacion/guardar',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              numero_venta : newSale.codigo_venta, 
              ciudad: newSale.sucursal,
              fecha: newSale.fecha_hora,
              total_ventas: newSale.valorTotal_masIva 
          })
            
          }).then(() => {
            alert('Se ha realizado la venta ');
            window.print()
            window.location.reload();
            
          }).catch(
            console.error
          )
        });
      }
    }
  }
}

// ---------------- clases ----------------

class ProductList implements cartListI {
  code: string = '';
  name: string = '';
  Number: number = 0;
  unitValue: number = 0;
  ivaValue: number = 0;
  total: number = 0;
}

class Sale implements saleI {
  codigo_venta: String = '';
  cedula_cliente: String = '';
  nombre_clientes: String = '';
  direccion_clientes: string = '';
  telefono_clientes: string = '';
  valorTotal_venta: number = 0;
  valor_iva: number = 0;
  valorTotal_masIva: number = 0;
  detalle_veta: String[] = new Array();
  fecha_hora: string = '';
  tipo_de_venta: string = '';
  sucursal: string = '';
}
