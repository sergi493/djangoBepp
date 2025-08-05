 function ImportarProducte(id_producte, nom, referencia,quantitat,descripcio,preu){
    // Solo comprobar si el producto ya está en la tabla visible
    const visibleTable = Array.from(document.querySelectorAll(".taula-productes-pressupost"))
        .find(t => t.offsetParent !== null);

    if (visibleTable && visibleTable.querySelector(`.linea_productes_pressupost_${id_producte}`)) {
        alert('Este producto ya está añadido al presupuesto.');
       return;
    }  var csrftoken = getCookie('csrftoken');

    //si estoy editando
    var idPressupostElem = document.getElementById("pressupost_id_obtenir");
    if (idPressupostElem) {
        var idPressupost = idPressupostElem.innerHTML;
       
    } 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/afegir_producte_pressupost/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Respuesta del servidor:", xhr.responseText);
            
              
            
            
        } else {
            console.error("Error en la solicitud:", xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Error de red al enviar la solicitud.");
    };
    xhr.send(JSON.stringify({ idPressupost:idPressupost,id_producte:id_producte }));
    VeureUltimProductePressupost(id_producte,nom, referencia,quantitat,descripcio,preu);
    //calcularTotal(); 

    }



       document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.producte-input-quantitat-crear').forEach(function(input) {
            input.addEventListener('input', function () {
                const fila = input.closest('tr');
                //updateRowTotal(fila);
                updateTotalGeneral();
            });
        });
    });




    
   function VeureUltimProductePressupost(id_producte,nom, referencia,quantitat,descripcio,preu){
    var table = document.querySelectorAll(".taula-productes-pressupost");

        // Filtra solo la que esté visible
    var visibleTable = Array.from(table).find(t => t.offsetParent !== null);

    if (!visibleTable) {
        console.error("❌ No se encontró ninguna tabla visible");
        return;
    }

    // Si la tabla tiene tbody, inserta en él
    const tbody = visibleTable.querySelector('tbody');


    var newRow = tbody.insertRow();
    newRow.className = `linea_productes_pressupost_${id_producte} linea_productes_pressupost_edit`;
    

    // Crea y añade las celdas a la nueva fila
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    

    // Asigna el contenido a cada celda
    cell1.textContent = referencia;   // Reemplaza con el valor real
    cell1.id = 'producte_id_pressupost';
    cell2.textContent = nom;           // Reemplaza con el valor real
      // Reemplaza con el valor real
      var input = document.createElement("input");
      input.type = "number";
      input.id = "quantitat_" + id_producte;   
             // Assigna un ID a l'element d'entrada
      input.value = 1;   
    input.id = "quantitat_" + id_producte; // Reemplaça amb el valor real si cal
    input.className="producte-input-quantitat"
      cell3.appendChild(input);   // Reemplaza con el valor real




      var pElement = document.createElement("p");


    // Crear el elemento span
    var spanElement = document.createElement("span");
   
    // Asignar el contenido de texto al span
    spanElement.textContent = preu;
    // Agregar el span al p
    
    // Agregar el símbolo del euro al p como texto
    spanElement.appendChild(document.createTextNode("€"));
    // Vaciar el contenido actual de cell4 (opcional)
    cell4.textContent = "";
    // Agregar el p a cell4
    cell4.appendChild(spanElement);
    spanElement.className="producte-preu-unitat";

    
    
    // Crear el elemento span
    var preuLinea = document.createElement("span");
    // Asignar el contenido de texto al span
    preuLinea.textContent = preu;

    // Agregar el span al p
    
    // Después de insertar la fila y asignar eventos
    //calcularTotal();
//updateTotalGeneral();

    // Agregar el símbolo del euro al p como texto
    
    // Vaciar el contenido actual de cell4 (opcional)
    cell5.textContent = "";
    // Agregar el p a cell4
    cell5.appendChild(preuLinea);
   
    var button = document.createElement("button");
    button.innerHTML="BORRAR";
    // Solo añadir el botón BORRAR si existe el elemento de id "pressupost_id_obtenir"
    var pressIdElem = document.getElementById("pressupost_id_obtenir");
    if (pressIdElem && window.getComputedStyle(pressIdElem).display !== "none" && window.getComputedStyle(pressIdElem).visibility !== "hidden") {
        var press_id = pressIdElem.innerHTML;
        button.onclick = function() {
            esborrarDePressupost(id_producte, press_id);
            
        };

        preuLinea.className="producte-preu-total";
        input.className = "producte-input-quantitat";
    }
    else{
        button.onclick = function() {
            esborrarDeCreacio(id_producte);
            
        };
        preuLinea.className="producte-preu-total-crear";
         
    }
    cell7.appendChild(button);
     //var total = document.getElementById("sumTotal");
     //total.textContent += preuLinea.textContent*1000;
     //console.log(total.innerHTML*1000)
     //calcularTotal();
// Actualiza el total de la fila y el total general al cambiar la cantidad
// Sumar el preuLinea al total actual mostrado en .sumTotal (si existe)
var sumTotalElem = visibleTable.querySelector('.sumTotal');
if (sumTotalElem) {
    let sumaActual = parseFloat(sumTotalElem.textContent) || 0;
    let sumaFila = parseFloat(preuLinea.textContent) || 0;
    sumTotalElem.textContent = (sumaActual + sumaFila).toFixed(2);
}
input.addEventListener('input', function () {
    // Calcular el total de la fila 
    const cantidad = parseFloat(input.value) || 0;
    const precioUnitario = parseFloat(spanElement.textContent.replace('€', '').trim()) || 0;
    preuLinea.textContent = (precioUnitario * cantidad).toFixed(2);

    // Sumar todos los precios totales de productos añadidos
    let sumaTotal = 0;
    visibleTable.querySelectorAll('.producte-preu-total, .producte-preu-total-crear').forEach(function(span) {
        sumaTotal += parseFloat(span.textContent) || 0;
    });
    sumTotalElem.textContent = sumaTotal.toFixed(2);

  const tabla = document.querySelector('#taula-editar') || document.querySelector('#taula-crear');
    if (tabla) {
        updateTotalGeneral(`#${tabla.id}`);
    }
    
    
});
    
}





function esborrarDeCreacio(id_producte) {
    // Buscar la fila visible que té la classe específica
    const fila = document.querySelector(`#taula-crear tbody tr.linea_productes_pressupost_${id_producte}`);
    if (fila) {
        fila.remove();
        updateTotalGeneral('#taula-crear'); // Actualitza el total després d'esborrar
    } else {
        console.warn(`No s'ha trobat la fila del producte ${id_producte} a la taula #taula-crear`);
    }
}



  function updateRowTotal(fila) {
        const quantitatInput = fila.querySelector('.producte-input-quantitat');
        const preuPerUnitat = parseFloat(fila.querySelector('.producte-preu-unitat').textContent);
        const total = fila.querySelector('.producte-preu-total');
        const quantitat = parseFloat(quantitatInput.value);
        total.textContent = (preuPerUnitat * quantitat).toFixed(2);
    }