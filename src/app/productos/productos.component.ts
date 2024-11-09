import { Component, OnDestroy, OnInit, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstantesURL } from '../Services/Constantes/ConstantesHost';
import { Categorias } from '../Services/Constantes/ProductosEndpoint';
import { Productos } from '../Services/Constantes/ProductosEndpoint';
import { HttpClient, HttpHeaders, HttpClientModule  } from '@angular/common/http';
import { createRequire } from 'module';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationStart } from '@angular/router';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
import { ModalOkComponent } from '../modal-ok/modal-ok.component';
import { response } from 'express';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalErrorComponent,
    ModalOkComponent
],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  private URL: ConstantesURL;
  urlBase: string;
  private Categoria : Categorias;
  endpointCategoria: string;
  private Producto : Productos;
  endpointProducto: string;

  fechaActual = new Date();
  diaActual = this.fechaActual.getDate();
  
  routerSubscription: Subscription | undefined;

  PId : any = 0;

  PDescricion : string = '';
  PExistencia : any = 0;
  PPrecio : GLfloat = 0.0;
  PCategoria : any = 0;

  EDescripcion: string = '';
  EPrecio: any = 0.0;
  EExistencia : any =0;
  ECategoria: any = 0;

  saveDisabled = false;

  mensajeError : string = '';
  mensajeOk : string = "Registrado correctamente";

  isVisibleAP : boolean = true;
  isVisibleDP : boolean = true;
  isVisibleEP : boolean = true;

  @ViewChild(ModalErrorComponent) modalError!: ModalErrorComponent;
  @ViewChild(ModalOkComponent) modalOk!: ModalOkComponent;

  products = [
    { idProducto: 0, descripcion: '', precio: 0.0, existencia:0, fechaRegistro: '2000-01-01', fkCategoria:0, bactivo: true}
  ];
  selectedProduct: any | null = null;

  categorias = [
    { id_Categoria: 0, descripcion: '', fecha_Registro: '2000-01-01', b_activo:true }
  ];

  categoriasRenombradas : any[] = []; 
  error: any;

  constructor(private http:HttpClient, private router: Router){
    this.URL = new ConstantesURL;
    this.Categoria = new Categorias;
    this.Producto = new Productos;
    this.urlBase = this.URL.URLBack;
    this.endpointCategoria = this.Categoria.categorias;
    this.endpointProducto = this.Producto.productos;
  }

  async ngOnInit() {
    await this.getCategorias();
    this.getProductos();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  IniciarApp(){

  }

  getProductos(): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.products = [];
    var urlhttp = this.urlBase + this.endpointProducto;
    try{
      this.http.get(urlhttp,{headers})
      .subscribe((respuesta:any) => {              
        this.products.push(...respuesta);
      }, (error : any)=>{
        console.log('Error en la solicitud:', error);
      });
    }catch(error){
      console.error("Error :"+error)
    }
    
  }

  getCategorias(): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.categorias = [];
    var urlhttp = this.urlBase + this.endpointCategoria;
    try{
      this.http.get(urlhttp,{headers})
      .subscribe((respuesta:any) => {
        this.categorias.push({ id_Categoria: 0, descripcion: '', fecha_Registro: '', b_activo:true });
        this.categorias.push(...respuesta);
      }, (error : any)=>{
        console.log('Error en la solicitud:', error);
      })
    }catch (error){
      console.error("Error : "+ error)
    }
    
  }

  obtenerCategoriaDescripcion(fkCategoria: any): string {
    if (fkCategoria == null) {
      return 'Categoría desconocida';
    }
    const fkCategoriaNumerico = Number(fkCategoria);
    let categoria = this.categorias.find(cat => Number(cat.id_Categoria) === fkCategoriaNumerico);
    return categoria ? categoria.descripcion : 'Categoría desconocida';
  }

  openAddModal() {
    this.isVisibleAP = true;
  }

  openEditModal(descripcion : string, precio : any, existencia : any, categoria : any, id : any) {
    this.EDescripcion = descripcion;
    this.EPrecio = precio;
    this.EExistencia = existencia;
    this.ECategoria = categoria;
    this.isVisibleEP = true;
    this.PId = id;    
    this.checkFormValidity();
  }

  EditProduct(): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const producto = {
      idproudcto:  this.PId,
      descripcion: this.EDescripcion,
      precio: this.EPrecio,
      existencia: this.EExistencia,
      fecharegistro: this.diaActual,
      fkCategoria: this.ECategoria,
      bactivo: true
    }
    try{
      this.http.put(this.urlBase + this.endpointProducto+"/"+this.PId, producto, {headers} )
        .subscribe((response: any)=>{
          console.log("todo bien");
          this.closeEditModal();
          this.getProductos();          
          this.clearEdit();
          this.modalOk.showOk(this.mensajeOk);
        }, (error)=>{
          console.error(error);
          this.mensajeError = error.message;          
          this.modalError.showError(this.error.message)
        })
    }catch(error){
      console.error(error)
      this.mensajeError = this.error.message;
      this.modalError.showError(this.error.message)
    }
    this.PId = 0;
  }

  clearSave(){
    this.PCategoria = 0
    this.PDescricion = '';
    this.PId = 0;
    this.PExistencia = 0;
    this.PPrecio = 0.0;
  }

  clearEdit(){
    this.ECategoria = 0
    this.EDescripcion = '';
    this.PId = 0;
    this.EExistencia = 0;
    this.EPrecio = 0.0;
  }

  checkFormValidity() {
    if ((this.PDescricion && this.PPrecio > 0 && this.PExistencia > 0 && this.PCategoria !== 0) || 
    (this.EDescripcion  && this.EPrecio > 0 && this.EExistencia > 0 && this.ECategoria !==0)) {
      this.saveDisabled = true;
    } else {
      this.saveDisabled = false;
    }
  }

  onInputChange() {
    this.checkFormValidity();
  }

  

  SaveProduct(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const producto = {
      idproudcto:  null,
      descripcion: this.PDescricion,
      precio: this.PPrecio,
      existencia: this.PExistencia,
      fecharegistro: this.diaActual,
      fkCategoria: this.PCategoria,
      bactivo: true
    }

    try{
      this.http.post(this.urlBase + this.endpointProducto, producto, {headers} )
        .subscribe((response: any)=>{
          console.log("todo bien");
          this.closeAddModal();
          this.getProductos();          
          this.clearSave();
          this.modalOk.showOk(this.mensajeOk);
        }, (error)=>{
          console.error(error);
          this.mensajeError = error.message;          
          this.modalError.showError(this.error.message)
        })
    }catch(error){
      console.error(error)
      this.mensajeError = this.error.message;
      this.modalError.showError(this.error.message)
    }
    //this.closeAddModal();
  }

  closeAddModal() {
    this.isVisibleAP = false;
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    this.clearSave();
  }

  closeDeleteModal(){
    this.isVisibleDP = false;
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    this.PId = 0;
  }

  closeEditModal(){
    this.isVisibleEP = false;
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    this.clearEdit();
  }

  onSave() {

  }

  openDeleteModal(id : any, descripcion : any) {
    this.PDescricion = descripcion;
    this.PId = id;
    this.isVisibleDP = true;
  }

  confirmDelete() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    try{
      this.http.delete(this.urlBase+this.endpointProducto+"/"+this.PId, {headers})
      .subscribe((response: any)=>{
        this.closeDeleteModal();
        this.getProductos();          
        this.modalOk.showOk(this.mensajeOk);
      },(error)=>{        
        this.mensajeError = error.message;
        this.modalError.showError(this.error.message);
        this.closeDeleteModal();
        this.getProductos();         
      })
    }catch (error){
      this.modalError.showError(this.error.message);
      this.closeDeleteModal();
      this.getProductos();  
    }
    this.PId = 0;
  }
}
