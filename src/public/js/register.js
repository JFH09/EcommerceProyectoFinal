console.log("entro al js...");
let btnRegister = document.getElementById("registrarUsu");
let btnLogin = document.getElementById("login");

let currentURL = window.location.href;
btnRegister.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log("entro a registrar usuario...");
  console.log(currentURL);

  let obj = {};
  if (currentURL[1] != "") {
    currentURL = currentURL.split("/register");
  }

  console.log(currentURL[0]);

  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  let name = document.getElementById("inputName").value;
  let lastName = document.getElementById("inputLastName").value;
  let age = document.getElementById("inputAge").value;
  let rol = document.getElementById("inputRol").value;
  console.log("rol", rol);
  if (
    !email ||
    !password ||
    !name ||
    !lastName ||
    !age ||
    rol == "Selecciona..."
  ) {
    Swal.fire("No se pudo crear el ususario!!!", "", "warning");
    console.log("entro al else de redirecc");
  } else {
    obj = {
      first_name: name,
      last_name: lastName,
      email: email,
      age: age,
      password: password,
      rol: rol,
    };

    console.log("objeto", obj);
    let data = "";
    const response = await fetch(currentURL[0] + "/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        data = result;
        console.log(data);
        // Manejar la respuesta del servidor
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });

    console.log(data);

    console.log("response 2 line44_", response);
    const responseData = data;
    console.log(data.status);
    if (data.status === "success") {
      console.log("entro al if para redireccionar");
      Swal.fire("Usuario registrado con exito!!!", "", "success");
      window.location.replace("/login");
    } else {
      Swal.fire("No se pudo crear el ususario!!!", "", "warning");
      console.log("entro al else de redirecc");
    }
  }
});

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/login");
});
