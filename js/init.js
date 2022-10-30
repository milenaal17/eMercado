const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//4to elemento li del nav, correspondiente al espacio del usuario:
let profileLi= document.getElementsByClassName("nav-item")[3];
//Muestra en la barra de navegación el email de la cuenta logueada como un menu desplegable:
profileLi.innerHTML=`
  <div class="dropdown" id="drop">
    <!-- Se hace uso de "collapse" para la visualizacion y animacion del menu desplegable  -->
    <a class="nav-link active" href=# data-bs-toggle="collapse" data-bs-target="#dropMenu" aria-expanded="false" id="userName">
      ${localStorage.getItem("user")}  <i class="fas fa-angle-down ms-2" id="dropArrow"></i>
    </a>  
    <div id="dropMenu" class="collapse position-absolute w-100">
      <ul class="list-group list-group-flush dropdown-menu-dark show w-100 mt-1 p-1 border-dark border-2 rounded-0 rounded-bottom list-unstyled">
        <!-- Enlace a la pagina de carrito de compras -->
        <li><a class="dropdown-item p-1 px-3" href="cart.html">Mi carrito <i class="fas fa-shopping-cart ms-2"></i></a></li>

        <!-- Enlace al perfil del usuario -->
        <li><a class="dropdown-item p-1 px-3" href="my-profile.html">Mi perfil <i class="fas fa-user-alt ms-2"></i></a></li>

        <!-- Boton para cerrar sesion, redirige al login -->
        <li class="border-top border-secondary mt-1 pt-1">
          <button class="dropdown-item p-1 px-3" id="signOut">Cerrar Sesion <i class="fas fa-sign-out-alt ms-2"></i></button>
        </li>
      </ul> 
    </div> 
  </div>
`;
//Agrega la clase que rota la flecha en el menu desplegable:
document.getElementById("userName").addEventListener("click",()=>{
  document.getElementById("dropArrow").classList.toggle("dropRotate");
})

//Al hacer click en el botón para salir de la cuenta:
document.getElementById("signOut").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("cartList");
  localStorage.removeItem("productID");
  window.location.href= "login.html"; //Vuelve al login
})

//Guarda en LocalStorage la id de un producto pasada por parametro y redirige a product-info.html:
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}

let cartURL =CART_INFO_URL + 25801 + EXT_TYPE;

function isValid(ok,field){
  if (ok) {
    document.getElementById(`${field}`).classList.remove('is-invalid');
    document.getElementById(`${field}`).classList.add('is-valid');
  } else {
    document.getElementById(`${field}`).classList.remove('is-valid');
    document.getElementById(`${field}`).classList.add('is-invalid');
  };
}