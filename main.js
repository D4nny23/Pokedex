
let todosLosPokemon= async(i)=>{
  try {
      let peticiones= await fetch("https://pokeapi.co/api/v2/pokemon/" + i)
      let datos= await peticiones.json();
      return {
        'id': datos.id,
        'nombre': datos.name.toUpperCase(),
        'imagen': datos.sprites.front_default
      }
    } catch (error) {
      Swal.fire({
        title: "No existe el Pokemon",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }
}

async function inicio() {
  let divContenedor = document.getElementById("contenedor");
  let arrayPokemons=[""];
  for (let i = 1; i < 1026; i++) {
    arrayPokemons.push(await todosLosPokemon(i));
    let div = document.createElement("div");
    div.setAttribute("class", "celda");
    divContenedor.appendChild(div);
    let name = document.createElement("p");
    name.textContent =arrayPokemons[i].nombre.toUpperCase();
    div.appendChild(name);
    recuperoImagen(arrayPokemons[i].imagen, div, "imgLista");
  }
}

inicio();

async function recuperoImagen(imagen, div, id) {
  let icon = document.createElement("img");
  icon.setAttribute("src", imagen);
  icon.setAttribute("id", id);
  div.appendChild(icon);
}

// -------------------------------------------------------------------------------------- Para el detalle del Pokemon

document.getElementById("buscaPokemon").addEventListener("click", () => {
  peticion();
});

window.addEventListener("keypress", (e)=>{
  if(e.code==="Enter"){
    peticion();
  }
})

let peticionPokemon=async(nombrePokemon)=>{
  try {
    let peticion= await fetch("https://pokeapi.co/api/v2/pokemon/" + nombrePokemon);
    let datos= await peticion.json();
    return datos;
  } catch (error) {
    return "";
  }
}

async function peticion(){
  borraDiv("habilidades");
  borraDiv("tipos");
  borraDiv("estadisticas");
  borraDiv("imagen");

  let nombrePokemon =
    document.getElementById("pokemonName").value != ""
      ? document.getElementById("pokemonName").value.toLowerCase()
      : 0;
    let objetoPokemon= await peticionPokemon(nombrePokemon);
    if(objetoPokemon!=""){
      let body = document.getElementsByTagName("body")[0];
      if (!document.getElementById("divPokemon")) {
        let div = document.createElement("div");
        div.setAttribute("id", "divPokemon");
        body.appendChild(div);
      }
      detallesPokemon(objetoPokemon);
      habilidades(objetoPokemon);
      creaDivHabilidades(objetoPokemon);
      tipos(objetoPokemon);
      recuperarEstadisticas(objetoPokemon);
    }else{
      status404(document.getElementsByTagName('body')[0]);
      Swal.fire({
      title: "No existe el Pokemon",
      icon: "error",
      confirmButtonColor: "#ff0000",
    });
    }
    
}

function borraDiv(div){
  if(document.getElementById(div)){
    document.getElementById(div).remove();
  }
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

function detallesPokemon(objeto) {
  let div = document.getElementById("divPokemon");
  primeraPeticionEvolucion(objeto.id);
  recuperoImagen2(objeto, div, "imgDetalle");
  //Borra la lista de Pokemon
  if (document.getElementById("contenedor")) {
    let divContenedor = document.getElementById("contenedor");
    divContenedor.remove();
  }
}

function recuperoImagen2(objeto, div, id) {
  let imgFrente = objeto.sprites.front_default;
  let imgDetras = objeto.sprites.back_default;

  //Si no existe el elemento IMG lo creo y le meto la imagen del pokemon
  if (!document.getElementById(id)) {
    let divImg= document.createElement("div");
    divImg.setAttribute("id", "imagen");
    let icon = document.createElement("img");
    icon.setAttribute("src", imgFrente);
    icon.setAttribute("id", id);
    divImg.appendChild(icon);
    div.appendChild(divImg);
  } else {
    //Si existe el elemento lo recupero y le meto la imagen nueva
    let imgElement = document.getElementById(id);
    imgElement.setAttribute("src", imgFrente);
  }
  imgEspalda(imgFrente, imgDetras);
}

//Recupero detalles básicos como nombre, id, peso...
function detallesBasicos(objeto) {
  if (!document.getElementById("detallesBásicos")) {
    creaDivDetallesBasicos();
    let detalles = 'Id: ,Name: ,Height: ,Weight: '.split(",");
    let detallesPeticion = [objeto.id,objeto.name,objeto.height,objeto.weight];
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
    document.getElementById("habilidades").appendChild(divDetallesBasicos);
  }
}

// --------------------------------------------------------------- Habilidades
function habilidades(objeto){
  creaDivHabilidades();
  detallesBasicos(objeto); 
  let divHabilidades= document.getElementById("habilidades");

  if(!document.getElementById("titulo") && !document.getElementById("listaHabilidades")){
    let titulo= document.createElement("p");
    titulo.textContent="ABILITIES";
    titulo.setAttribute("id", "titulo");
    divHabilidades.appendChild(titulo);
    let datos= document.createElement("ul");
    datos.setAttribute("id", "listaHabilidades");
    divHabilidades.appendChild(datos);
  }

  let habilidades= objeto.abilities;
  for (let i = 0; i < habilidades.length; i++) {
    let li= document.createElement("li");
    li.textContent= (habilidades[i].ability.name).toUpperCase();
    document.getElementById("listaHabilidades").appendChild(li);
  }
}


function creaDivHabilidades(){
  if(!document.getElementById("habilidades")){
    let divHabilidades = document.createElement("div");
    divHabilidades.setAttribute("id", "habilidades");
    document.getElementById("divPokemon").appendChild(divHabilidades);
  }
}

// -------------------------------------------------- TIPOS

function tipos(objeto){
  creaDivTipos();
  let tipos= objeto.types;
  for (let i = 0; i < tipos.length; i++) {
    let p= document.createElement("p");
    p.setAttribute("id", "tipos");
    colorTipos(p,tipos[i].type.name);
    p.textContent= (tipos[i].type.name).toUpperCase();
    document.getElementById("tipos").appendChild(p);
  }

}

function creaDivTipos(){
  if(!document.getElementById("tipos")){
    let divTipos = document.createElement("div");
    divTipos.setAttribute("id", "tipos");
    document.getElementById("imagen").appendChild(divTipos);
  }
}

function colorTipos(p,tipo){
  let pokemonTypes = ["steel","water","bug","dragon","electric","ghost","fire","fairy","ice","fighting","normal","grass","psychic","rock","dark","ground","poison","flying"];
  let colores= ["#B0BEC5", "#2196F3", "#4CAF50", "#673AB7", "#FFEB3B", "#9E9E9E","#F44336", "#FF4081", "#80D8FF", "#D84315", "#9E9E9E", "#4CAF50", "#AB47BC", "#795548", "#212121", "#6D4C41", "#880E4F", "#03A9F4"]
  for (let i = 0; i < pokemonTypes.length; i++) {
    if(pokemonTypes[i]==tipo){
      p.style.backgroundColor=colores[i];
    }
  }
}


// ----------------------------------------------------- ESTADISTICAS

//PRUEBA
function recuperarEstadisticas(objeto) {
  creaDivEstadisticas();
  let divEstadisticas= document.getElementById("estadisticas");
  let stats= objeto.stats;
  let tabla= document.createElement("table");
  let tituloStats= document.createElement('p');
  tituloStats.textContent="STATS";
  tituloStats.setAttribute('id', 'tituloStats');
  divEstadisticas.appendChild(tituloStats);
  
  for (let i = 0; i < stats.length; i++) {
    let tr= document.createElement("tr");
    let tdEstadistica= document.createElement("td");
    tdEstadistica.textContent= stats[i].stat.name.toUpperCase();

    let tdNEstadistica= document.createElement("td");
    tdNEstadistica.textContent= stats[i].base_stat;

    let td= document.createElement("td");
    let divBarra= document.createElement("div");
    let divBarraProgreso= document.createElement("div");
    divBarra.appendChild(divBarraProgreso);
    divBarraProgreso.setAttribute('id','rellenoBarra');
    divBarra.setAttribute('id','contornoBarra');
    divBarraProgreso.style.width=(stats[i].base_stat*100)/255+"%";
    
    tr.appendChild(tdEstadistica);
    tr.appendChild(tdNEstadistica);
    tr.appendChild(td);
    td.appendChild(divBarra);
    tabla.appendChild(tr);
  }
  divEstadisticas.appendChild(tabla);
}

function creaDivEstadisticas(){
  if(!document.getElementById("estadisticas")){
    let div = document.createElement("div");
    div.setAttribute("id", "estadisticas");
    document.getElementById("divPokemon").appendChild(div);
  }
}
//---------------------------------------------------Evoluciones
let peticiones= async(id)=>{
  try {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    let peticion1= await fetch(url);
    let data= await peticion1.json();
    let urlEvoluciones= data.evolution_chain.url;
    let peticion2= await fetch(urlEvoluciones);
    let dataEvoluciones= await peticion2.json();
    imgEvoluciones(dataEvoluciones);
  } catch (error) {
    console.log(error);
  }
  
}

function primeraPeticionEvolucion(id){
  borraDiv("evolucion"+0);
  borraDiv("evolucion"+1);
  borraDiv("evolucion"+2);

  peticiones(id);
    
}

async function imgEvoluciones(data){
  const evolutions = [];
  let currentEvolution = data.chain;
  
  while (currentEvolution) {
  evolutions.push(currentEvolution.species.name);
  currentEvolution = currentEvolution.evolves_to[0];
  }

  let arrayEvoluciones= [];
  for (let i = 0; i < evolutions.length; i++) {
    creaDivEvolucion(i);
    arrayEvoluciones.push(await evolucionesPokemon(evolutions[i]));
}
  setImgEvoluciones(arrayEvoluciones);
}

let evolucionesPokemon= async(evolucion)=>{
  let peticionPokemon= await fetch("https://pokeapi.co/api/v2/pokemon/"+ evolucion)
  let data= await peticionPokemon.json();
  return {
    'nombre' : data.name,
    'id' : data.id,
    'imagen' : data.sprites.front_default
  };
}

function setImgEvoluciones(arrayEvoluciones){
  for (let i = 0; i < arrayEvoluciones.length; i++) {
  let div= document.getElementById("evolucion"+i);
  let img= document.createElement("img");
  img.setAttribute("id", "imgEvolucion"+i);
  img.setAttribute("src", arrayEvoluciones[i].imagen);
  let idNombre= document.createElement('p');
  idNombre.setAttribute("id", "idNombre");
  let id= document.createElement('span');
  id.textContent="ID: "+ arrayEvoluciones[i].id;
  let nombre= document.createElement('span');
  nombre.textContent=arrayEvoluciones[i].nombre.toUpperCase();
  idNombre.appendChild(id);
  idNombre.appendChild(nombre);
  div.appendChild(idNombre);
  div.appendChild(img);  
  }
}

function creaDivEvolucion(numero){
  if(!document.getElementById("evolucion"+numero)){
    let divEvolucion = document.createElement("div");
    divEvolucion.setAttribute("id", "evolucion"+numero);
    document.getElementById("divPokemon").appendChild(divEvolucion);
  }
}

function imgEspalda(imgFrente, imgDetras){
  let divImg= document.getElementById("imgDetalle");
  divImg.addEventListener("mouseover", ()=>{
    divImg.setAttribute("src", imgDetras);

      setTimeout(()=>{
        divImg.setAttribute("src",imgFrente);
      }, 1000)
  })
}