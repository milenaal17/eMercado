//URL a utilizar, haciendo uso de local storage para que aplique a cualquier categoria elegida:
const url =PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

//Variables globales:
let originalProductsList= [];
let currentProductsList= [];
let minPrice=undefined;
let maxPrice=undefined;
let toSearch="";

//Funcion que ordena la lista de productos, ademas modifica el color del boton seleccionado:
function orderProducts(orderCrit, notCrit1, notCrit2){
    let sortBtn= document.getElementById(`${orderCrit}Btn`);
    if (sortBtn.classList.contains("btn-light")) {
      //Configuracion de colores:
      sortBtn.classList.remove("btn-light");
      sortBtn.classList.add("btn-dark");
      let elseBtn1=document.getElementById(`${notCrit1}Btn`);
      let elseBtn2=document.getElementById(`${notCrit2}Btn`);
      let notSortBtn= elseBtn1.classList.contains("btn-dark")?elseBtn1:elseBtn2;
        if (notSortBtn.classList.contains("btn-dark")) {
          notSortBtn.classList.remove("btn-dark");
          notSortBtn.classList.add("btn-light")
        }

      //Ordenacion segun criterio:
      if (orderCrit === "ascOrder")
        currentProductsList.sort((a,b) => a.cost-b.cost);
      else if (orderCrit === "descOrder")
        currentProductsList.sort((a,b) => b.cost-a.cost);
      else if (orderCrit === "relOrder")
        currentProductsList.sort((a,b) => b.soldCount-a.soldCount);
    } else {
      //Si el boton ya habia sido seleccionado se "deselecciona" y muestra la lista en el orden original:
      sortBtn.classList.remove("btn-dark");
      sortBtn.classList.add("btn-light");
      currentProductsList= originalProductsList.slice();
    }
    //Muestra la nueva lista:
    showProductsList();
}

//Incorpora la lista de productos de la categoría seleccionada en la url:
function showProductsList(){
  let prodContainer= document.getElementById(`product-list`);
  //Para eliminar cualquier contenido previo:
  prodContainer.innerHTML = "";
  for (let product of currentProductsList) {
    //Controla si se cumplen las condiciones de minimo, maximo y coincidencia de busqueda:
    if ((minPrice==undefined || product.cost >= minPrice) &&
        (maxPrice==undefined || product.cost <= maxPrice) && 
        (product.name.toLowerCase().includes(toSearch) || product.description.toLowerCase().includes(toSearch))){
      
      //Se crea el div contenedor con document para que se pueda referenciar mas
      let divToAppend= document.createElement("div");
      divToAppend.classList.add("list-group-item", "list-group-item-action", "cursor-active")
      divToAppend.id= product.id;
      divToAppend.innerHTML= `
          <div class="row">
            <div class="col-3">
              <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                <small class="text-muted">${product.soldCount} vendidos</small>
              </div>
              <p class="mb-1">${product.description}</p>
             </div>
          </div>
        `;
      prodContainer.appendChild(divToAppend);
      divToAppend.addEventListener("click",()=> setProductID(divToAppend.id));
    }
  }
  //Por si no hay productos que mostrar:
  if (prodContainer.innerHTML == "") {
    let noProducts= document.createElement('h5');
    noProducts.classList.add("text-center", "alert-danger", "fw-bold", "p-2");
    noProducts.innerHTML= "No se encontraron productos";
    prodContainer.appendChild(noProducts);
  }
}

//Se realiza el pedido al servidor con la url cuando los contenidos del DOM estan cargados:
document.addEventListener('DOMContentLoaded', function (){
  let container= document.getElementById('mainBox');
  //Función que maneja fetch y valida los datos recibidos en la petición:
  getJSONData(url).then(function(dataObject){
    if (dataObject.status === "ok")
      currentProductsList= dataObject.data.products;
      //Hace una copia completamente independiente, si se modifica currentProductsList no se ve afectado:
      originalProductsList= currentProductsList.slice();
      document.getElementById("catName").innerHTML=dataObject.data.catName;
      showProductsList();
  });  
  
  //Orden de precio ascendente:
  document.getElementById("ascOrder").addEventListener("click", () => 
    orderProducts('ascOrder', 'descOrder', 'relOrder')
  );
  //Orden de precio desdentente:
  document.getElementById("descOrder").addEventListener("click", () => 
    orderProducts('descOrder', 'relOrder', 'ascOrder')
  );
  //Orden segun relevancia:
  document.getElementById("relOrder").addEventListener("click", () =>
    orderProducts('relOrder', 'ascOrder', 'descOrder')
  );
  
  //Determina maximo y minimo cuando se quiere filtrar:
  document.getElementById("filterPrice").addEventListener("click", function(){
    minPrice = document.getElementById("minPrice").value;
    maxPrice = document.getElementById("maxPrice").value;
    
    if (minPrice=="" || minPrice<0) 
      minPrice=undefined;
    if (maxPrice=="" || maxPrice<0)
      maxPrice=undefined;
    
    showProductsList();
  });
  //"Resetea" los input y quita los limites de precio:
  document.getElementById("clearPrice").addEventListener("click", function(){
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    minPrice= undefined;
    maxPrice= undefined;
    showProductsList();
  });

  //Busca coincidencia entre el valor ingresado y el nombre o descripcion de cada producto:
  document.getElementById('searchInput').addEventListener('input', (e) => {
    toSearch=e.target.value.toLowerCase();
    showProductsList()
  });
})

