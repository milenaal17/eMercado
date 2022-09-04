//EXPRESIONES REGULARES para validación:
const validEmail= /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const validPass={
    upp: /[A-Z]+/,
    low: /[a-z]+/,
    num: /[0-9]+/,
    symb: /[\@\#\!\¡\,\.\:\-\_\+\^\(\)\=\&]+/,
};

function validField(ok,field){
  if (ok) {
    document.getElementById(`${field}Alert`).classList.add('visually-hidden');
    document.getElementById(`${field}Input`).classList.remove('border-danger');
  } else {
    document.getElementById(`${field}Alert`).classList.remove('visually-hidden');
    document.getElementById(`${field}Input`).classList.add('border-danger');
  };
}

// Validación de contraseña, posteriormente se implementará en el registro.
function passValidation(key){
    console.log(key);
    boolArray=[
        key.length>7,
        validPass.upp.test(key), //mayúsculas
        validPass.low.test(key), //minúsculas
        validPass.num.test(key), //números
        validPass.symb.test(key), //símbolos
    ];
    let resp= true;
    for (let i = 0; i < boolArray.length; i++) {
        console.log(`${i}:${boolArray[i]}`)
        if (boolArray[i])
            document.getElementById(`${i}`).classList.add('visually-hidden');
        else
            document.getElementById(`${i}`).classList.remove('visually-hidden');
        resp=resp && boolArray[i];
    }
    return resp;
}

//Input donde se ingresa el mail:
const email= document.getElementById('emailInput');
  email.addEventListener('blur',(e) => validField(validEmail.test(e.target.value),"email"));

//Input donde se ingresa la contraseña:
const pass= document.getElementById('passwordInput');
  pass.addEventListener('keyup', (e) => validField(passValidation(e.target.value),"password"));
  pass.addEventListener('blur',(e) => validField(passValidation(e.target.value),"password"));

//Obtención del formulario, validación de ambos campos y redirección a la página de inicio:
const form=document.getElementById("sing-in");
form.addEventListener("submit", function(e){
  e.preventDefault();
  if (validEmail.test(form.email.value) && passValidation(form.password.value)) {
    document.getElementById('sendData').classList.add('visually-hidden');
    localStorage.setItem("user", form.email.value);
    window.location.href= "index.html";
  } else
    document.getElementById('sendData').classList.remove('visually-hidden');
});