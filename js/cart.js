let cart;

function removeCartProduct(id) {
  document.getElementById(id).remove()
  let i=0
  while (i<cart.length && cart[i].id != id) 
    i++;
  if (i<cart.length) {
    cart.splice(i,1);
    localStorage.setItem("cartList",JSON.stringify(cart));
  }
}

function addCartProduct(product){
  let newProduct = document.createElement("tr");
  newProduct.classList.add("align-middle","text-center");
  newProduct.id= product.id;
  newProduct.innerHTML=`
    <th scope="row" class="position-relative text-start">
      <button onclick="removeCartProduct(${product.id})" class="btn btn-outline-dark border-0 position-absolute top-50 start-0 translate-middle-y"><i class="fas fa-times"></i></button>
      <img class="cartImg ms-5" src="${product.image}" alt="${product.name}">
    </th>
    <td class="text-start">${product.name}</td>
    <td>${product.currency} ${product.unitCost}</td>
    <td id="input${product.id}"></td>
    <td class="fw-bold">${product.currency} <span class="subPrice" id="subtotal${product.id}">${product.unitCost}</span></td>
  `;
  document.getElementById('cartProducts').appendChild(newProduct);
  let cantInput = document.createElement("input");
  cantInput.classList.add("form-control", "cantInputs", "m-auto");
  cantInput.type="number";
  cantInput.value="1";
  document.getElementById(`input${product.id}`).appendChild(cantInput);
  cantInput.addEventListener("input",()=>{
    let subtot=document.getElementById(`subtotal${product.id}`);
    if (cantInput.value!="" && cantInput.value>=0){
      subtot.innerHTML=product.unitCost*cantInput.value;
    }else{
      cantInput.value=0;
      subtot.innerHTML=0;
    }
  })
}

document.addEventListener("DOMContentLoaded",()=>{
  cart= localStorage.getItem("cartList");
  if (cart!=null) {
    cart= JSON.parse(cart)
    for (const article of cart)
      addCartProduct(article);
  }
  document.getElementById('backCart').addEventListener("click",()=>{
    let flag= localStorage.getItem("productID");
    if (flag==null)
      window.location.href= "categories.html";
    else
      window.location.href= "product-info.html";
  })
})