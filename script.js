class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.agregarRegistro(1, "arroz", 100, "alimentos", "arroz.jpg");
    this.agregarRegistro(2, "fideos", 50, "alimentos", "fideos.jpg");
    this.agregarRegistro(3, "alfajor", 25, "alimentos", "alfajor.jpg");
  }

  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }

  traerRegistros() {
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }
  registroPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra)
    );
  }
}

class Carrito {
  constructor() {
    // Cargamos del storage
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    // Inicializamos variables
    this.carrito = carritoStorage || [];
    this.carrito = [];
    this.total = 0;
    this.totalProductos = 0;
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    let productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Actualizo el carrito en el HTML
    this.listar();
  }
  quitar(id) {
    // Recibimos como parámetro el ID del producto, con ese ID buscamos el índice
    // del producto para poder usar el splice y borrarlo en caso de que haga falta
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    // Si la cantidad del producto es mayor a 1, le resto
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      // Sino, signica que hay un solo producto, así que lo borro
      this.carrito.splice(indice, 1);
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Actualizo el carrito en el HTML
    this.listar();
  }

  listar() {
    this.total = 0;
    this.totalProductos = 0;
    divCarrito.innerHTML = "";
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
            <div class="producto">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
        </div> 
            `;
      // Actualizamos los totales
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      // Le agregamos un evento onclick a cada uno
      boton.onclick = (event) => {
        event.preventDefault();
        // Llamamos al método quitar, pasándole el ID del producto que sacamos
        // del atributo data-id del HTML
        this.quitar(Number(boton.dataset.id));
      };
    }
    // Actualizamos variables carrito
    spanCantidadProductos.innerText = this.totalProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

class Producto {
  constructor(id, nombre, precio, categoria, imagen = false) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

const bd = new BaseDeDatos();
//Elementos
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
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
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const id = Number(boton.dataset.id);
      const producto = bd.registroPorId(id);
      carrito.agregar(producto);
    });
  }
}

//evento buscador
formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registroPorNombre(palabra.toLowerCase()));
});
inputBuscar.addEventListener("keyup", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registroPorNombre(palabra.toLowerCase()));
});

const carrito = new Carrito();
