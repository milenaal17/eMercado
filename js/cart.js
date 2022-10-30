let cart;
const DOLAR=41.12;
let shipping="standard";
let payMethod="";

//Expresiones regulares para la validacion de los campos de tarjeta de credito:
const validCardNum= /\d{16}/;
const validCardCode= /\d{3}/;
const validCardDate= /\d{2}\/{1}\d{2}/;

//Funcion que modifica el total:
function changeTotal(dif,currency){
  let total=document.getElementById('totalProductPrice');
  if (currency=="UYU")
    dif=Math.round(dif/DOLAR);
  total.innerHTML=parseInt(total.innerHTML)+dif;
  changeShipping()
}

//Funcion que identifica el tipo de envio y coloca el valor correspondiente en costo de envio y total:
function changeShipping(){
  let total=document.getElementById('totalProductPrice');
  let cost;
  if (shipping=="standard")
    cost=Math.round(parseInt(total.innerHTML)*0.05);
  if (shipping=="express")
    cost=Math.round(parseInt(total.innerHTML)*0.07);
  if (shipping=="premium")
    cost=Math.round(parseInt(total.innerHTML)*0.15);
  document.getElementById('shippingCost').innerHTML= cost;
  document.getElementById('totalPrice').innerHTML= parseInt(total.innerHTML)+cost;
}

//Funcion que agrega un producto al la lista del carrito y controla sus funcionalidades:
function addCartProduct(product){
  let newProduct = document.createElement("tr");
  newProduct.classList.add("align-middle","text-center");
  newProduct.id= product.id;
  newProduct.innerHTML=`
    <th scope="row">
      <img class="cartImg" src="${product.image}" alt="${product.name}">
    </th>
    <td class="text-start">${product.name}</td>
    <td><p class="minW-maxC m-0">${product.currency} ${product.unitCost}</p></td>
    <td><input type="number" id="input${product.id}" class="form-control cantInputs m-auto" value="1"></td>
    <td class="fw-bold"><p class="minW-maxC m-0">${product.currency} <span id="subtotal${product.id}">${product.unitCost}</span></p></td>
    <td><button id="button${product.id}" class="btn btn-outline-dark border-0 m-auto"><i class="fas fa-trash-alt"></i></button></td>
  `;
  document.getElementById('cartProducts').appendChild(newProduct);
  let price= product.unitCost;
  if (product.currency=="UYU") 
    price= Math.round(price/DOLAR)
  document.getElementById('totalProductPrice').innerHTML=parseInt(document.getElementById('totalProductPrice').innerHTML)+price;
  
  let cantInput = document.getElementById(`input${product.id}`);
  //Controla los cambios en el input de cantidad
  cantInput.addEventListener("input",()=>{
    let subtot=document.getElementById(`subtotal${product.id}`);
    let ini= subtot.innerHTML;
    if (cantInput.value!="" && cantInput.value>=0){
      subtot.innerHTML=product.unitCost*cantInput.value;
      cantInput.classList.remove("is-invalid")
    }else{
      cantInput.value= 0;
      subtot.innerHTML= 0;
    }
    changeTotal(subtot.innerHTML-ini,product.currency)
  })

  let trashButton = document.getElementById(`button${product.id}`);
  //Elimina el producto de la tabla y hace los cambios correspondientes en los costos:
  trashButton.addEventListener("click",()=>{
    let toRest=document.getElementById(`subtotal${product.id}`);
    document.getElementById(product.id).remove()
    let i=cart.indexOf(product)
    if (i!=-1) {
      cart.splice(i,1);
      localStorage.setItem("cartList",JSON.stringify(cart));
      changeTotal(-toRest.innerHTML,toRest.classList.value);
      if (cart.length==0)
        window.location.href=window.location.href;
    }
  })
}

//Hace la validacion del modal de metodo de pago
function validPay(ok, buyForm) {
  if (ok) {
    if (payMethod=="credit") {
      ok= validCardNum.test(buyForm.cardNum.value) && validCardCode.test(buyForm.cardCode.value) && validCardDate.test(buyForm.cardDate.value);
      isValid(validCardNum.test(buyForm.cardNum.value),"cardNum");
      isValid(validCardCode.test(buyForm.cardCode.value),"cardCode");
      isValid(validCardDate.test(buyForm.cardDate.value),"cardDate");
    } else {
      ok= buyForm.bankNum.value.length>0;
      isValid(ok,"bankNum");
    }
  }
  isValid(ok,"payButton");
  return ok;
}

document.addEventListener("DOMContentLoaded",()=>{
  cart= localStorage.getItem("cartList");
  if (cart!=null) {
    cart= JSON.parse(cart)
    for (const article of cart)
      addCartProduct(article);
    let total=parseInt(document.getElementById('totalProductPrice').innerHTML);
    document.getElementById('shippingCost').innerHTML=Math.round(total*0.05)
    document.getElementById('totalPrice').innerHTML=total+Math.round(total*0.05);
    if (cart.length==0)
      document.getElementById('cartProducts').innerHTML=`
        <td class="text-center text-danger" colspan="6">No hay productos en el carrito</td>
      `;
  }
  //Envío standard:
  document.getElementById("standard").addEventListener("click", () => {
    shipping="standard";
    changeShipping();
  });
  //Envío express:
  document.getElementById("express").addEventListener("click", () => {
    shipping="express";
    changeShipping();
  });
  //Envío premium:
  document.getElementById("premium").addEventListener("click", () => {
    shipping="premium";
    changeShipping();
  });

  //Pago con tarjeta:
  document.getElementById("credit").addEventListener("click", () => {
    payMethod= "credit";
    document.getElementById("cardNum").disabled=false;
    document.getElementById("cardCode").disabled=false;
    document.getElementById("cardDate").disabled=false;
    document.getElementById("bankNum").disabled=true;
    document.getElementById("paySelect").innerHTML="Tarjeta de credito";
  });
  //Pago por transferencia:
  document.getElementById("bank").addEventListener("click", () => {
    payMethod= "bank";
    document.getElementById("bankNum").disabled=false;
    document.getElementById("cardNum").disabled=true;
    document.getElementById("cardCode").disabled=true;
    document.getElementById("cardDate").disabled=true;
    document.getElementById("paySelect").innerHTML="Transferencia bancaria";
  });

  //Boton que devuleve a categorias para que siga comprando:
  document.getElementById('backCart').addEventListener("click",()=>{
    window.location.href= "categories.html";
  })

  //Validacion de la compra
  const buyForm= document.getElementById('toBuy');
  buyForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    //Validacion de tipo de envio
    if (buyForm.selectType.value=="")
      document.getElementById('shippingType').classList.add("border", "border-danger")
    else
      document.getElementById('shippingType').classList.remove("border", "border-danger")
    //Validacion de calle (direccion de envio):
    isValid(buyForm.street.value.length>0,"street");
    //Validacion de numero (direccion de envio):
    isValid(buyForm.num.value!="" && buyForm.num.value>0, "num");
    //Validacion de esquina (direccion de envio):
    isValid(buyForm.esq.value.length>0,"esq") ;
    //Validacion de metodo de pago:
    let payOk= validPay(buyForm.payMeth.value!="",buyForm);
    //Validacion de los input cantidad:
    let cantInputs= document.getElementsByClassName('cantInputs');
    let contBool=cantInputs.length>0
    for (const input of cantInputs) {
      contBool= contBool && input.value>0;
      isValid(input.value>0,input.id);
    }

    //Si se cumplen todas las condiciones limpia el carrito y muestra una alerta
    if (buyForm.selectType.value!="" && buyForm.street.value.length>0 
        && buyForm.num.value!="" && buyForm.num.value>0 
        && buyForm.esq.value.length>0 && payOk && contBool) {
        document.getElementById('complete').classList.remove('visually-hidden');
        cart=[];
        localStorage.setItem("cartList",JSON.stringify(cart));
    }  
  });

  //Aporte visual al campo de vencimiento de la tarjeta de credito:
  let dateInput= document.getElementById('cardDate');
  dateInput.addEventListener("input",()=>{
    if(dateInput.value.length==2)
      dateInput.value+='/'
  })
  
  //Al finalizar la compra y cerrar el mensaje se reinicia la pagina:
  document.getElementById('complete').addEventListener('closed.bs.alert', () => {
    window.location.href = window.location.href;
  })
})

