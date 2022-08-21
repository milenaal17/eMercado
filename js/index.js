document.addEventListener("DOMContentLoaded", function(){
  //Verificación de la existencia de parámetros de formulario en la url: 
  if(document.location.href.indexOf('?')==-1)
    window.location.href= "login.html";
    
  document.getElementById("autos").addEventListener("click", function() {
    localStorage.setItem("catID", 101);
    window.location = "products.html"
  });
  document.getElementById("juguetes").addEventListener("click", function() {
    localStorage.setItem("catID", 102);
    window.location = "products.html"
  });
  document.getElementById("muebles").addEventListener("click", function() {
    localStorage.setItem("catID", 103);
    window.location = "products.html"
  });
});