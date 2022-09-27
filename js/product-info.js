//URLs a utilizar, haciendo uso de local storage para que aplique a cualquier producto elegido:
const infoURL =PRODUCT_INFO_URL + localStorage.getItem("productID") + EXT_TYPE;
const commentsURL =PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("productID") + EXT_TYPE;

//Variables globales:
let productInfo= [];
let productComments= [];
let scrollRel= document.getElementById('carouselRel'); //Elemento contenedor de la lista de productos relacionados
let score= document.querySelectorAll('#starScore label'); //Todas las estrellas del formulario = puntuacion total

//Crea el carusel de imagenes del producto:
function carouselCreate(){
  for (const imgInd in productInfo.images) {
    //Control e indice:
    let cBtn= document.createElement('button');
    cBtn.type="button";
    cBtn.classList.add("slides");
    cBtn.dataset.bsTarget="#myCarousel"; 
    cBtn.dataset.bsSlideTo=imgInd;
    cBtn.ariaLabel=`Slide ${parseInt(imgInd)+1}`;
    
    //Imagen:
    let cItem= document.createElement('div');
    cItem.classList.add('carousel-item');
    cItem.innerHTML= `<img src="${productInfo.images[imgInd]}" alt="image${imgInd}" class="bd-placeholder-img w-100 border rounded" aria-hidden="true" focusable="false">`;
    
    //Clases especificas de los primeros elementos:
    if (imgInd==0) {
      cBtn.classList.add('active');
      cItem.classList.add('active');
    }

    //Se agregan al documento
    document.getElementById('carouselBtns').appendChild(cBtn);
    document.getElementById('carouselItems').appendChild(cItem);
  };
}

//Arma la lista de productos relacionados:
function relatedProductsList(){
  for (const product of productInfo.relatedProducts) {
    let relatedProduct= document.createElement("div");
    relatedProduct.classList.add("list-group-item", "list-group-item-action", "prodRel");
    relatedProduct.id= product.id;
    relatedProduct.innerHTML=`
        <div class="row align-items-center">
          <div class="col">
            <img src="${product.image}" alt="relatedImage${product.id}" class="imgRel">
          </div>
          <div class="col">
            <h6>${product.name}</h6>
          </div>
        </div>
    `;
    document.getElementById('relatedProductsList').appendChild(relatedProduct);
    relatedProduct.addEventListener("click",()=>setProductID(relatedProduct.id)) 
  };
}

//Añade un comentario al final de la lista de comentarios:
function addProductComment(comment){
  let stars=""
  for (let i = 0; i < 5; i++) {
    if (i<comment.score)
      stars+=`<span class="fa fa-star checked"></span>`;
    else
      stars+=`<span class="fa fa-star"></span>`;
  }
  let commentToAdd= document.createElement("div");
  commentToAdd.classList.add("list-group-item");
  commentToAdd.innerHTML=`
    <div class="row align-items-center">
      <p class="m-0 p-0 ps-3"><b>${comment.user}</b> - ${comment.dateTime} - <span class="d-inline-block">${stars}</span></p>
      <p class="m-0 p-0 ps-3 text-secondary">${comment.description}</p>
    </div>
  `;
  document.getElementById("prodComments").appendChild(commentToAdd);
}


//"Colorea" (añade la clase checked) las estrellas HASTA la seleccionada y "despinta" las sobrantes:
function coloredStars (star){
  for (let i = 1; i <= 5; i++) {
    if (i<=star.control.id){
      score[i-1].classList.add("checked");
    }else
      score[i-1].classList.remove("checked");
  }
}

//Devuelve el indice de la estrella elegida si existe, sino retorna -1:
function checkedStar (){
  let resp=-1;
  for (let i = 0; i < 5; i++) {
    if (score[i].control.checked)
      resp=i;
  }
  return resp;
}

//Se realiza el pedido al servidor con las url cuando los contenidos del DOM estan cargados:
document.addEventListener('DOMContentLoaded', function (){
  //Obtencion de los datos e informacion del producto:
  getJSONData(infoURL).then(function(dataInfo){
    if (dataInfo.status === "ok")
      productInfo= dataInfo.data;
      //Imagenes:
      carouselCreate();
      //Informacion:
      document.getElementById('name').innerHTML=productInfo.name;
      document.getElementById('price').innerHTML=`${productInfo.currency} <span class="fs-1">${productInfo.cost}</span>`;
      document.getElementById('desc').innerHTML=productInfo.description;
      document.getElementById('cat').innerHTML=productInfo.category;
      document.getElementById('sold').innerHTML=productInfo.soldCount;
 
      //Productos relacionados:
      relatedProductsList();
    });
  //Obtencion de los comentarios del producto:
  getJSONData(commentsURL).then(function(dataComments){
    if (dataComments.status === "ok")
      productComments= dataComments.data
      //Adicion de cada comentario:
      for (const comment of productComments) {
        addProductComment(comment);
      }
      if (productComments.length==0) {
        document.getElementById('noComments').classList.remove("visually-hidden");
      }
  }); 

  //Botones de los productos relacionados:
  window.addEventListener('resize',()=>{
    if (scrollRel.scrollWidth>scrollRel.clientWidth) {
      document.getElementById('prevArrowRel').classList.remove("invisible");
      document.getElementById('nextArrowRel').classList.remove("invisible");
    }else{
      document.getElementById('prevArrowRel').classList.add("invisible");
      document.getElementById('nextArrowRel').classList.add("invisible");
    }
  },true)
  document.getElementById('prevArrowRel').addEventListener('click',()=>{
    scrollRel.scrollLeft -= 300;
  });
  document.getElementById('nextArrowRel').addEventListener('click',()=>{
    scrollRel.scrollLeft += 300;
  });
  
  //FORMULARIO:
  //Escucha cuando se clickea o se para sobre alguna de las estrellas del formulario y "colorea" segun corresponda:
  for (const star of score) {
    star.addEventListener('mouseover',()=>coloredStars(star));
    star.addEventListener('click',()=> coloredStars(star));
  };

  //Escucha cuando se abandona el area de la puntuacion, controla las estrellas que deben estar "coloreadas":
  document.getElementById("starScore").addEventListener('mouseout',()=>{
    let stars= checkedStar();
    if (stars == -1) {
      for (const star of score) 
        star.classList.remove("checked");   
    } else
      coloredStars(score[stars]);
  })

  //DESAFIATE, añade el comentario del usuario a la lista de comentarios:
  document.getElementById("comment").addEventListener('submit',(e)=>{
    e.preventDefault();
    let now= new Date();
    let month= (now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`;
    let day= (now.getDate()>9)?now.getDate():`0${now.getDate()}`;
    let dateForm=`${now.getFullYear()}-${month}-${day} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    let stars= checkedStar(); 
    if (stars == -1)
      document.getElementById('sendStars').classList.remove('visually-hidden');
    else {
      document.getElementById('sendStars').classList.add('visually-hidden');
      let newComment={
        dateTime: dateForm,
        description: e.target.opinion.value,
        product: localStorage.getItem("productID"),
        score: stars+1,
        user: localStorage.getItem("user")
      };
      document.getElementById('noComments').classList.add("visually-hidden");
      addProductComment(newComment);
      
      //Reinicia el formulario
      e.target.opinion.value="";

      coloredStars(score[0]);
      score[0].classList.remove("checked");
      score[checkedStar()].control.checked=false;

      for (const star of score) {
        star.classList.remove("checked");
        star.control.checked=false;
      } 
    }
  })
})
