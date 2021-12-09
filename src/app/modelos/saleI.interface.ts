export interface saleI{
    codigo_venta: String,
    // nombre_proveedor: String,
    cedula_cliente: String,
    nombre_clientes: String,
    direccion_clientes: string,
    telefono_clientes: string,
    valorTotal_venta: number,
    valor_iva: number,
    valorTotal_masIva: number,
    
    detalle_veta: Array<String>
    
    fecha_hora: string,
    tipo_de_venta: string,
    sucursal: string 
}