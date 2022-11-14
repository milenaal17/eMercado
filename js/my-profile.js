//Formulario:
let profileForm= document.getElementById("profileForm");
//Input de tipo "file" donde se agrega la imagen del perfil:
let imgFile= document.getElementById("imgFile");
//Exp. regular para teléfono válido con número uruguayo:
const validPhone= /^09\d{7}$/;


document.addEventListener("DOMContentLoaded",()=>{
  //Al tener que estar logueado para acceder al perfil, directamente rellena el campo email con el del usuario logueado:
  profileForm.email.value=localStorage.getItem("user");
  //Verifica si hay datos de usuario guardados, si los hay, se cargan en sus campos correspondientes:
  if(localStorage.getItem("profileData")){
    let data= JSON.parse(localStorage.getItem("profileData"));
    for (const key of Object.keys(data)) {
        profileForm[key].value=data[key];
    }
  }
  //Verificación específica de imagen de perfil:
  if (localStorage.getItem("profileImg")) {
    document.getElementById("profileImg").src= localStorage.getItem("profileImg");
    document.getElementById("deleteImg").classList.remove("visually-hidden")
  }

  //Al momento de guardar los datos verifica que los campos requeridos no se encuentren vacíos:
  profileForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    //Validacion de primer nombre:
    isValid(profileForm.firstName.value.length>0,"firstName");
    //Validacion de primer apellido:
    isValid(profileForm.firstSurname.value.length>0,"firstSurname");
    //Validacion de email:
    isValid(validEmail.test(profileForm.email.value),"email");
    //Validacion de email:
    isValid(profileForm.phone.value=="" || validPhone.test(profileForm.phone.value),"phone");

    //Si se cumplen todas las condiciones guarda los datos y muestra una alerta
    if (profileForm.firstName.value.length>0 && profileForm.firstSurname.value.length>0 
        && validEmail.test(profileForm.email.value) && (profileForm.phone.value=="" || validPhone.test(profileForm.phone.value))) {
        let profile={
            "firstName": profileForm.firstName.value,
            "secondName": profileForm.secondName.value,
            "firstSurname": profileForm.firstSurname.value,
            "secondSurname": profileForm.secondSurname.value,
            "phone": profileForm.phone.value,
        };
        localStorage.setItem("user",profileForm.email.value);
        document.getElementById("userName").innerHTML=profileForm.email.value;
        localStorage.setItem("profileData",JSON.stringify(profile));
        document.getElementById('complete').classList.remove('visually-hidden');
    }  
  });
  
  //Al hacer click sobre el apartado de imagen genera un click en el input de tipo file oculto:
  document.getElementById("addImage").addEventListener("click",()=>{
    imgFile.click();
  });
  
  //Cualquier archivo que se vincule se muestra en pantalla y se guarda si url en el localStorage:
  imgFile.addEventListener("change",()=>{
    //Creación de un "lector de archivos" que permite la codificación de la ruta y nombre de imagen del usuario a url:
    let readFile= new FileReader();
    readFile.readAsDataURL(imgFile.files[0])
    readFile.addEventListener("load",()=>{
      document.getElementById("profileImg").src= readFile.result;
      localStorage.setItem("profileImg",readFile.result);
    })
    document.getElementById("deleteImg").classList.remove("visually-hidden")
  });
  
  //Botón para eliminar imagen cargada en el perfil:
  document.getElementById("deleteImg").addEventListener("click",()=>{
    localStorage.removeItem("profileImg");
    document.getElementById("profileImg").src="img/user-add-icon.png";
    document.getElementById("deleteImg").classList.add("visually-hidden");
  })
})