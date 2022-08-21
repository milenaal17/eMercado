//Incorpora la lista de productos de la categoría seleccionada en la url:
function showProductsList(data,productArray){
  let htmlCode="";
  for (let product of productArray) {
    htmlCode += `
      <div class="list-group-item list-group-item-action cursor-active">
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
      </div>
      `;
  }
  document.getElementById(`product-list`).innerHTML = htmlCode;
}

//Creación de los encabezados de la página, adaptables a futuras categorías que se incorporen:
function showProductsPage (container,data){
  container.innerHTML=`
    <div class="text-center p-4">
      <h2>Productos</h2>
      <p class="lead">Verás aquí todos los productos de la categoría ${data.catName}.</p>
    </div>
    <div class="container">
      <div class="row">
        <div class="list-group" id="product-list">
        </div>
      </div>
    </div>
    `;
  showProductsList(data,data.products);
}

//url a utilizar:
const url ="https://japceibal.github.io/emercado-api/cats_products/101.json";

//Se realiza el pedido al servidor con la url cuando los contenidos del DOM estan cargados:
document.addEventListener('DOMContentLoaded', function (){
  let container= document.getElementById('mainBox');
  //Función que maneja fetch y valida los datos recibidos en la petición:
  getJSONData(url).then(function(dataObject){
    if (dataObject.status === "ok")
      showProductsPage(container,dataObject.data);
  });   
})