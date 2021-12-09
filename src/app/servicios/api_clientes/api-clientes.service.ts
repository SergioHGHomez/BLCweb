import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { clientesI } from '../../modelos/clientes.interface';
import { HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiClientesService {

  url:string = 'http://localhost:8082'

  constructor( private http:HttpClient ) { }

  getClients():Observable<clientesI[]> {


      let direccion = this.url + "/api/clientes/listar";
      return this.http.get<clientesI[]>(direccion);
      
  }


}
