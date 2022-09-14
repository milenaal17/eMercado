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
profileLi.classList.add("d-flex");
//Muestra en la barra de navegación el email de la cuenta logueada:
profileLi.innerHTML=`
  <a class="nav-link active" href="" id="userName">${localStorage.getItem("user")}</a>
  <!-- Botón para salir de la cuenta (regresa al login) -->
  <button class="btn btn-dark" id="signOut" aria-label="cerrarSesion"><i class="fas fa-sign-out-alt mr-1"></i></button>
`;
//Al hacer click en el botón para salir de la cuenta:
document.getElementById("signOut").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href= "login.html"; //Vuelve al login
})

//Guarda en LocalStorage la id de un producto pasada por parametro y redirige a product-info.html:
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}