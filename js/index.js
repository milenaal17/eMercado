document.addEventListener("DOMContentLoaded", function(){
  //Verificación de la existencia de parámetros de formulario en la url: 
  let user= localStorage.getItem("user");
  if(user==null)
    //Si NO está logueado:
    window.location.href= "login.html";
  else{
    //Si está logueado:
    document.getElementById("profile").classList.remove("invisible");
  }

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
  
  //"Esconde" el elemento para que no se vea un null por el breve periodo de tiempo que tarda en cambiar al login:
  document.getElementById("signOut").addEventListener("click", () => {
    document.getElementById("profile").classList.add("invisible");
  })
});