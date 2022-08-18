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

function passValidation(clave){
    console.log(clave);
    boolArray=[
        clave.length>7,
        validPass.upp.test(clave),
        validPass.low.test(clave),
        validPass.num.test(clave),
        validPass.symb.test(clave),
    ];
    let resp=true;
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

const email= document.getElementById('emailInput');
  email.addEventListener('keyup', (e) => validField(validEmail.test(e.target.value),"email"));
  email.addEventListener('blur',(e) => validField(validEmail.test(e.target.value),"email"));

const pass= document.getElementById('passwordInput');
  pass.addEventListener('keyup', (e) => validField(passValidation(e.target.value),"password"));
  pass.addEventListener('blur',(e) => validField(passValidation(e.target.value),"password"));

const form=document.getElementById("sing-in");
form.addEventListener("submit", function(evento){
  evento.preventDefault();
  if (validEmail.test(form.email.value) && passValidation(form.password.value)) {
    document.getElementById('sendData').classList.add('visually-hidden');
    window.location.href = "index.html";
  } else
    document.getElementById('sendData').classList.remove('visually-hidden');
});