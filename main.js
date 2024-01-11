inicio();

function inicio() {
  let divContenedor = document.getElementById("contenedor");
  for (let i = 1; i < 1018; i++) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeapi.co/api/v2/pokemon/" + i);

    xhr.responseType = "json";
    let div = document.createElement("div");
    div.setAttribute("class", "celda");
    divContenedor.appendChild(div);
    xhr.onload = function () {
      if (xhr.status === 200) {
        let name = document.createElement("p");
        name.textContent = xhr.response.name.toUpperCase();
        div.appendChild(name);
        recuperoImagen(xhr, div, "imgLista");
      } else if (xhr.status === 404) {
        Swal.fire({
          title: "No existe el Pokemon",
          icon: "error",
          confirmButtonColor: "#ff0000",
        });
      }
    };
    xhr.onerror = function () {
      document.getElementById("resultado").textContent = "Error";
    };

    xhr.send();
  }
}

function recuperoImagen(xhr, div, id) {
  let img = xhr.response.sprites.front_default;
  let icon = document.createElement("img");
  icon.setAttribute("src", img);
  icon.setAttribute("id", id);
  div.appendChild(icon);
}

// -------------------------------------------------------------------------------------- Para el detalle del Pokemon

document.getElementById("buscaPokemon").addEventListener("click", () => {
  peticion();
});

window.addEventListener("keypress", ()=>{
  if(e.code==="Enter"){
    peticion();
  }
})

function peticion(){
  let xhr = new XMLHttpRequest();
  let nombrePokemon =
    document.getElementById("pokemonName").value != ""
      ? document.getElementById("pokemonName").value
      : 0;
  let ruta = "https://pokeapi.co/api/v2/pokemon/" + nombrePokemon;
  xhr.open("GET", ruta);
  console.log(ruta);

  xhr.responseType = "json";
  xhr.onload = function () {
    let body = document.getElementsByTagName("body")[0];

    // recuperarEstadisticas(xhr);
    if (!document.getElementById("divPokemon")) {
      let div = document.createElement("div");
      div.setAttribute("id", "divPokemon");
      body.appendChild(div);
    }

    if (xhr.status === 200) {
      habilidades(xhr);
      detallesPokemon(xhr);
      detallesBasicos(xhr);
      creaDivHabilidades(xhr);
    } else if (xhr.status === 404) {
      status404(body);
    }
  };

  xhr.onerror = function () {
    div.textContent = "Error";
  };

  xhr.send();
}

function status404(body) {
  if (!document.getElementById("contenedor")) {
    let div = document.createElement("div");
    div.setAttribute("id", "contenedor");
    body.appendChild(div);
  }
  inicio();
  if (document.getElementById("divPokemon")) {
    document.getElementById("divPokemon").remove();
  }
  Swal.fire({
    title: "No existe el Pokemon",
    icon: "error",
    confirmButtonColor: "#ff0000",
  });
}

function detallesPokemon(xhr) {
  let div = document.getElementById("divPokemon");
  recuperoImagen2(xhr, div, "imgDetalle");
  //Borra la lista de Pokemon
  if (document.getElementById("contenedor")) {
    let divContenedor = document.getElementById("contenedor");
    divContenedor.remove();
  }
}

function recuperoImagen2(xhr, div, id) {
  let img = xhr.response.sprites.front_default;
  //Si no existe el elemento IMG lo creo y le meto la imagen del pokemon
  if (!document.getElementById(id)) {
    let icon = document.createElement("img");
    icon.setAttribute("src", img);
    icon.setAttribute("id", id);
    div.appendChild(icon);
  } else {
    //Si existe el elemento lo recupero y le meto la imagen nueva
    let imgElement = document.getElementById(id);
    imgElement.setAttribute("src", img);
  }
}

//PRUEBA
function recuperarEstadisticas(xhr) {
  // let stats= xhr.response.stats;
  // for (let i = 0; i < stats.length; i++) {
  //   console.log("Estadística básica"+stats[i].stat.name);
  // }
}

//Recupero detalles básicos como nombre, id, peso...
function detallesBasicos(xhr) {
  if (!document.getElementById("detallesBásicos")) {
    creaDivDetallesBasicos();
    let detalles = 'Id: ,Name: ,Base experience: ,Height: ,Default: ,Order: ,Weight: '.split(",");
    let detallesPeticion = [xhr.response.id,xhr.response.name,xhr.response.base_experience,xhr.response.height,xhr.response.is_default,xhr.response.order,xhr.response.weight];
    for (let i = 0; i < detalles.length; i++) {
      let detalle = document.createElement("p");
      detalle.setAttribute("id", detalles[i]);
      detalle.setAttribute("class", "atributosBasicos");
      detalle.textContent= (detalles[i]+ detallesPeticion[i]).toUpperCase();
      if(!document.getElementById(detalles[i])){
        document.getElementById("detallesBasicos").appendChild(detalle);
      }else{
        document.getElementById(detalles[i]).textContent= (detalles[i]+ detallesPeticion[i]).toUpperCase();
      }
    }
  }
}


function creaDivDetallesBasicos(){
  if(!document.getElementById("detallesBasicos")){
    let divDetallesBasicos = document.createElement("div");
    divDetallesBasicos.setAttribute("id", "detallesBasicos");
    document.getElementById("divPokemon").appendChild(divDetallesBasicos);
  }
}

// --------------------------------------------------------------- Habilidades
function habilidades(xhr){
  creaDivHabilidades();
  let divHabilidades= document.getElementById("habilidades");
  let titulo= document.createElement("p");
  titulo.textContent="Abilities";
  divHabilidades.appendChild(titulo);
  let habilidades= xhr.response.abilities;
  let datos= document.createElement("ul");
  for (let i = 0; i < habilidades.length; i++) {
    let li= document.createElement("li");
    li.textContent= habilidades[i].ability.name;
    datos.appendChild(li);
    console.log(habilidades[i].ability.name);
  }
  divHabilidades.appendChild(datos);

}


function creaDivHabilidades(){
  if(!document.getElementById("habilidades")){
    let divHabilidades = document.createElement("div");
    divHabilidades.setAttribute("id", "habilidades");
    document.getElementById("divPokemon").appendChild(divHabilidades);
  }
}