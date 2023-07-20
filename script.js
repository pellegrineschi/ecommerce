class BaseDeDatos{
    constructor(){
        this.productos = [];
        this.agregarRegistro(1,"arroz",100,"alimentos","arroz.jpg");
        this.agregarRegistro(2,"fideos",50,"alimentos","fideos.jpg");
        this.agregarRegistro(3,"alfajor",25,"alimentos","alfajor.jpg");
        
    }

    agregarRegistro(id,nombre,precio,categoria,imagen){
       const producto = new Producto(id,nombre,precio,categoria,imagen);
       this.productos.push(producto); 

    }

    traerRegistros(){
        return this.productos;
    }

    registroPorId(id){
        return this.productos.find((producto) => producto.id === id);

    }
}

class Carrito{
    constructor(){
        this.carrito =[];
        this.total = 0;
        this.totalProductos = 0;

    }
    
    estaEnCarrito(productoCarrito){
        return this.carrito.find((producto) => producto.id === productoCarrito.id);
    }
}


class Producto{
    constructor(id,nombre,precio,categoria,imagen = false){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

const bd = new BaseDeDatos();

const divProductos = document.querySelector("#productos");

cargarProductos();

function cargarProductos(){
    const productos = bd.traerRegistros();
    divProductos.innerHTML = "";
    for (const producto of productos){
        divProductos.innerHTML += `
        <div class= "producto">
            <h2>${producto.nombre}</h2>
            <p>${producto.precio}</p>
            <img src="img/${producto.imagen}" widht ="150" />
            <p><a href="#" class = "btnAgregar" data-id = "${producto.id}">Agregar al carrito</a></p>
        </div>
        `;
    }

    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for(const boton of botonesAgregar){
       boton.addEventListener("click", (event) =>{
        event.preventDefault();
        const id = Number(boton.dataset.id);
        const producto = bd.registroPorId(id);
        

       }); 
    }

}