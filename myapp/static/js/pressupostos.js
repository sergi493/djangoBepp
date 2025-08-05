 function updateTotalGeneral(tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    let total = 0;
    let totalQuantity = 0;

    table.querySelectorAll('tbody tr:not([style*="display: none"])').forEach(row => {
        const qtyInput = row.querySelector('.producte-input-quantitat, .producte-input-quantitat-crear');
        const priceEl = row.querySelector('.producte-preu-unitat');
        const totalEl = row.querySelector('.producte-preu-total, .producte-preu-total-crear');

        if (qtyInput && priceEl && totalEl) {
            const qty = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceEl.textContent.replace('€', '').trim()) || 0;
            const rowTotal = qty * price;
            totalEl.textContent = rowTotal.toFixed(2);
            total += rowTotal;
            totalQuantity += qty;
        }
    });

    table.querySelector('.sumTotal').textContent = total.toFixed(2);
    table.querySelector('#sumQuantitat').textContent = totalQuantity;
}




document.addEventListener('input', function(e) {
    const table = e.target.closest('.taula-productes-pressupost');
    if (!table) return;

    const tableId = table.id;
    if (tableId === 'taula-crear' || tableId === 'taula-editar') {
        updateTotalGeneral(`#${tableId}`);
    }
});



function esborrarDePressupost(producte_id, pressupost_id){
        const row = document.querySelector(`.linea_productes_pressupost_${producte_id}`);
            if (row) {
                row.remove();   
                console.log(`Producto con ID ${producte_id} y data ID ${pressupost_id} ha sido eliminado.`);
                // Aquí puedes añadir lógica adicional para manejar la eliminación en el servidor si es necesario
            }
       
        alert("ESBORRA EL PRODUCTE " + producte_id +" DEL PRESSUPOST " + pressupost_id);
        var csrftoken = getCookie('csrftoken');
        var xhr = new XMLHttpRequest();
        console.log("qq"+producte_id+"ww");
        xhr.open("POST", "/borrar_de_pressupost/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Respuesta del servidor:", xhr.responseText);
                 updateTotalGeneral('#taula-editar');
                
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error("Error de red al enviar la solicitud.");
        };
        xhr.send(JSON.stringify({producte_id:producte_id,pressupost_id:pressupost_id}));
    }
    
 
    function aplicarPressupost(id_pressupost) {
      
    const csrftoken = getCookie('csrftoken');
    updateTotalGeneral();

    // 1️⃣ Recopilar línies de productes
    const productes = [];
document.querySelectorAll('.linea_productes_pressupost_edit').forEach(row => {
  // buscamos sólo el input con la clase
  const input = row.querySelector('input.producte-input-quantitat');
  if (!input) {
    console.warn('Fila sin input de cantidad, la salto', row);
    return;
  }
  // sacamos la cantidad
  const quantitat = parseInt(input.value, 10) || 0;

// y la referencia la extraemos directamente de la celda de referencia
const referenciaCell = row.querySelector('#producte_id_pressupost').textContent.trim();

  productes.push({
    producte_id: referenciaCell,
    quantitat: quantitat
  });
});

console.log("Productes recollits:", productes);
    // 2️⃣ Recollir nova persona i mètode de pagament
    const PersonaId = document.getElementById('clientIdSelEdit').innerText.trim();
    const metodePagament = document.getElementById('paymentMethod').value;
    // 3️⃣ Actualizar el total general en el popup
    const totalGeneral = document.querySelector('.total-editar').textContent.trim();
    const nota = document.getElementById('notaPressupostEdit').value.trim();

    console.log("Enviant:", { productes, id_pressupost, PersonaId, metodePagament,totalGeneral });

    // 3️⃣ Enviar al backend
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/aplicar_pressupost/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Resposta servidora:", xhr.responseText);
            //obtenirUltimClient();
        } else {
            console.error("Error sol·licitud:", xhr.statusText);
        }
    };
    xhr.onerror = () => console.error("Error de xarxa.");
    xhr.send(JSON.stringify({
        productes: productes,
        id_pressupost: id_pressupost,
        persona_id: PersonaId,
        metodo_pago: metodePagament,
        totalGeneral:totalGeneral,
        nota: nota
    }));
}

   

    function showOverlay3(){
        var overlay = document.getElementById("buscar_productos");
        overlay.style.display = "block";
    }

    function facturarPressupost(id){

        var csrftoken = getCookie('csrftoken');

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/facturar_pressupost/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Respuesta del servidor:", xhr.responseText);
                obtenirUltimClient();
                
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error("Error de red al enviar la solicitud.");
        };
        xhr.send(JSON.stringify({ id:id }));
        

    }

function ImportarClientPressupost(id,nom,nif,tel){
    var idClient=document.getElementById("clientIdPressupost");
    var nomClient=document.getElementById("clientNomPressupost");
    var nifClient=document.getElementById("clientNifPressupost");
    var telClient=document.getElementById("clientTelPressupost");

    var idClientEdit=document.getElementById("clientIdPressupostEdit");
    var nomClientEdit=document.getElementById("clientNomPressupostEdit");
    var nifClientEdit=document.getElementById("clientNifPressupostEdit");
    var telClientEdit=document.getElementById("clientTelPressupostEdit");
    console.log("aa",nif);
    idClient.textContent=id;
    nomClient.textContent=nom;
    nifClient.textContent=nif;
    telClient.textContent=tel;

    idClientEdit.textContent=id;
    nomClientEdit.textContent=nom;
    nifClientEdit.textContent=nif;
    telClientEdit.textContent=tel;
    hideOverlay();
}
    function PressupostClientNou(){
        var csrftoken = getCookie('csrftoken');

        var nom=document.getElementById("nom-input").value;
        var telefon=document.getElementById("telefon-input").value;
        var banc=document.getElementById("banc-input").value;
        var localitat=document.getElementById("localitat-input").value;
        var direccio=document.getElementById("direccio-input").value;
        var nif=document.getElementById("nif-input").value;
        var email=document.getElementById("email-input").value;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/crear_client/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Respuesta del servidor:", xhr.responseText);
                obtenirUltimClient();
                
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error("Error de red al enviar la solicitud.");
        };
        xhr.send(JSON.stringify({ nom:nom, telefon:telefon, nif:nif, email:email, localitat:localitat, direccio:direccio, banc:banc }));
        hideOverlay();
    }
    

    function showOverlay() {

        var overlay = document.getElementById("overlay");
        overlay.style.display = "block";

    }

    function hideOverlay() {

        var overlay = document.getElementById("overlay");
        overlay.style.display = "none";
        
        
        
    }
    function hideOverlay4() {

        var overlay = document.getElementById("buscar_productos");
        overlay.style.display = "none";
        
        
        
    }

document.addEventListener('DOMContentLoaded', function () {
    const afegirReparacioBtn = document.getElementById('afegir-reparacio-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');

    afegirReparacioBtn.addEventListener('click', function () {
        modalOverlay.style.display = 'flex'; // Mostrar el overlay
    });

    closeModalBtn.addEventListener('click', function () {
        modalOverlay.style.display = 'none'; // Ocultar el overlay
    });

    // Opcional: cerrar el modal al hacer clic fuera del panel
    modalOverlay.addEventListener('click', function (event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = 'none'; // Ocultar el overlay
        }
    });
});


function genPressupost() {
  // 1️⃣ Recogemos datos del presupuesto
  const id = document.getElementById('pressupost_id_obtenir').textContent.trim();
  const dateText = document.querySelector('#date h4').textContent;
  const clienteId = document.getElementById('clientIdSelEdit').textContent;
  const clienteNom = document.getElementById('clientNomSelEdit').textContent;
  // 2️⃣ Recogemos líneas de productos
  const rows = Array.from(
  document.querySelectorAll('.taula-productes-pressupost tbody tr')
).filter(row => row.offsetParent !== null);
  let baseTotal = 0;
  const body = [];
  rows.forEach(row => {
    const ref = row.querySelector('td:first-child').textContent;
    const nom = row.children[1].textContent;
    const qty = parseInt(row.querySelector('.producte-input-quantitat').value, 10);
    const unit = parseFloat(row.querySelector('.producte-preu-unitat').textContent);
    const total = (unit * qty).toFixed(2);
    baseTotal += parseFloat(total);
    body.push([
      { text: ref, alignment: 'left' },
      { text: nom, alignment: 'left' },
      { text: `${qty}`, alignment: 'center' },
      { text: `${unit.toFixed(2)} €`, alignment: 'right' },
      { text: `${total} €`, alignment: 'right' }
    ]);
  });
  // 3️⃣ Montamos el documento
  const docDefinition = {
    pageSize: 'A4',
    content: [
      { text: `PRESUPOST núm. ${id}`, style: 'header' },
      `Data: ${dateText}`,
      { text: 'Cliente:', style: 'subheader' },
      `ID: ${clienteId} — Nombre: ${clienteNom}`,
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Ref.', bold: true },
              { text: 'Descripción', bold: true },
              { text: 'Cant.', bold: true },
              { text: 'P.U.', bold: true },
              { text: 'Total', bold: true }
            ],
            ...body
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 20, 0, 20]
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            table: {
              body: [
                [
                  { text: 'Total presupuestado:', bold: true },
                  { text: `${baseTotal.toFixed(2)} €`, bold: true, alignment: 'right' }
                ]
              ]
            },
            layout: 'noBorders'
          }
        ]
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
    },
    footer: () => ({
      text: 'Documento generado automáticamente. ¡Gracias por confiar en nosotros!',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      italics: true
    })
  };
  // 4️⃣ Disparo la descarga
  pdfMake.createPdf(docDefinition).download(`Presupost_${id}.pdf`);
}




function mostrarEditorEmail(pressupostId) {
  

  const popup = document.getElementById('popup');
  const container = popup.querySelector('.popup-content');

  // Limpiar contenido previo
  

  const id          = document.getElementById('pressupost_id_obtenir').textContent.trim();
  const clientNom   = document.getElementById('clientNomSelEdit').textContent.replace('|', '').trim();
  const clientEmail = document.getElementById('clientEmailSelEdit').textContent.trim();
  const clientTel   = document.getElementById('clientTelSelEdit').textContent.replace('|', '').trim();
  const dateText    = document.getElementById('date').querySelector('h4').textContent.replace('Data:', '').trim();
  const timeText    = document.getElementById('time').querySelector('h4').textContent.replace('Hora:', '').trim();
  const total       = document.getElementById('total-general').textContent.trim();

  // 👉 4. Construir lista de productos leyendo cada fila del HTML
  const filas = container.parentNode.querySelectorAll('.linea_productes_pressupost_edit');
  const productos = Array.from(filas).map(fila => {
    const ref       = fila.querySelector('#producte_id_pressupost').textContent.trim();
    const nombre    = fila.children[1].textContent.trim();
    const cantidad  = parseInt(fila.querySelector('.producte-input-quantitat').value, 10) || 0;
    const precio    = parseFloat(fila.querySelector('.producte-preu-unitat').textContent) || 0;
    return { producto_id: ref, nombre, cantidad, preu: precio };
  });


  const textarea = document.createElement('textarea');
  textarea.id = 'email-message';
  textarea.placeholder = 'Missatge que s\'enviarà per correu...';
  textarea.style.width = '100%';
  textarea.style.minHeight = '100px';
  textarea.style.marginTop = '1rem';
   textarea.value = 
    `Hola ${clientNom},\n\n` +
    `Te adjunto el presupuesto nº ${id} fechado el ${dateText} a las ${timeText}.\n\n` +
    `¡Gracias por confiar en nosotros!`;

  const btn = document.createElement('button');
  btn.textContent = '✉️ Enviar correu';
  btn.className = 'blue-button';
  btn.style.marginTop = '1rem';

  btn.onclick = () => {
    const mensaje = textarea.value;

    // Generar PDF
    //const dateObj = new Date(pressupostData.date);
    //const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    //const time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    const docDefinition = {
      content: [
        { text: `Presupuesto nº ${id}`, style: 'header' },
        `Fecha: ${dateText} — Hora: ${timeText}\n\n`,
        { text: `Cliente: ${clientNom}`, style: 'subheader' },
        `Tel: ${clientTel} — Email: ${clientEmail}\n\n`,
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Ref.', 'Nombre', 'Cant.', 'P.U.', 'Total'],
              ...productos.map(p => [
                p.producto_id,
                p.nombre,
                p.cantidad,
                `${p.preu.toFixed(2)} €`,
                `${(p.preu * p.cantidad).toFixed(2)} €`
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        },
        `\nTotal: ${total} €`
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0,0,0,10] },
        subheader: { fontSize: 14, bold: true, margin: [0,10,0,5] }
      }
    };

    pdfMake.createPdf(docDefinition).getDataUrl(pdfBase64 => {
      // **Enviar al servidor**
      fetch('/enviar_factura_email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          pdf: pdfBase64,
          factura: { id, clientNom, total },
          mensaje,clientEmail
        })
      })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(() => {
        alert('¡Correo enviado con éxito! 🚀');
        popup.style.display = 'none';
      })
      .catch(err => {
        console.error(err);
        alert('Error enviando correo: ' + err.message);
      });
    });
  };
  container.appendChild(textarea);
  container.appendChild(btn);
}
 
    

    function ImportarProducteExistent(referencia, descripcio, preu){
        updateTotalGeneral();
        var taula = document.getElementById("taulaPressupostProductes");
        console.log("WW");
        // Crear una nueva fila al final de la tabla
        var newRow = taula.insertRow(taula.rows.length - 1);
    
        // Crear y añadir celdas a la nueva fila
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
    
        // Rellenar las celdas con los datos pasados como parámetros
        cell1.textContent = referencia;
        cell1.id="referencia-producte-taula-pressupost";
        cell2.textContent = descripcio;
        cell3.textContent = preu;
        
        // Crear elementos para el input y el span
        var inputQuantitat = document.createElement("input");
        inputQuantitat.id = "input-quantitat-producte";
        inputQuantitat.type = "number";
        inputQuantitat.value = "1"; // Valor por defecto o inicial
        
        
        
        // Función para actualizar el span y el total cuando cambia el valor del input
        inputQuantitat.addEventListener("input", function() {
            var quantitat = parseInt(inputQuantitat.value); // Convertir el valor del input a entero
            var preuUnitari = parseFloat(preu); // Convertir el precio a número decimal
            var total = quantitat * preuUnitari; // Calcular el total
            
            // Mostrar el total en la celda5
            cell5.textContent = total.toFixed(2); // Asegurar que el total tenga 2 decimales
            calcularTotal();
            calcularSumaProductes();
        });
        
        // Añadir el input y el span a la celda correspondiente
        
        cell4.appendChild(inputQuantitat);
        
        // Mostrar el precio inicial en la celda5
        cell5.textContent = parseFloat(preu).toFixed(2); // Mostrar el precio por unidad inicial
    
        cell5.className = "preu-total";
        calcularTotal();
        calcularSumaProductes();
    }
    
    
    
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
   


    function PressupostCrearProducte(){
        var csrftoken = getCookie('csrftoken');

        var nom=document.getElementById("nom-input-nou").value;
        var referencia=document.getElementById("referencia-input").value;
        var descripcio=document.getElementById("descripcio-input").value;
        var preu=document.getElementById("preu-input").value;
        var quantitat=document.getElementById("quantitat-input").value;
        var preuCompra=document.getElementById("preu-compra-input").value;
        console.log("aa" + nom +quantitat);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/crear_producte/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Respuesta del servidor:", xhr.responseText);
                var response = JSON.parse(xhr.responseText);
        // Obtener el ID del producto
                var producteId = response.id;
                console.log(producteId+"sss");
                ImportarProducte(producteId, nom, referencia,quantitat,descripcio,preu);
                
                
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error("Error de red al enviar la solicitud.");
        };
        xhr.send(JSON.stringify({ nom:nom, referencia:referencia, quantitat:quantitat, descripcio:descripcio, preu:preu,preuCompra:preuCompra }));
        hideOverlay2();
        
        
        
    }

  
    
    





    


    

function showBuscar_productos() {

    var buscar_productos = document.getElementById("buscar_productos");
    buscar_productos.style.display = "block";
    console.log(buscar_productos)

}

function hideOverlay2() {

    var buscar_productos = document.getElementById("buscar_productos");
    buscar_productos.style.display = "none";
    
    
}

function CrearNouPresupost(){
    const visibleTable = Array.from(document.querySelectorAll(".taula-productes-pressupost"))
        .find(t => t.offsetParent !== null);
    var clientId=document.querySelector("#clientIdSelCrear").innerHTML;
    var descripcio=document.querySelector("#DescripcioPressupost").value;

    var total=parseFloat(visibleTable.querySelector(".sumTotal").innerHTML) || 0;
    const referenciesProd = Array.from(visibleTable.querySelectorAll(".taula-productes-pressupost #producte_id_pressupost"))
    .filter(t => t.offsetParent !== null);

const quantitatsProd = Array.from(visibleTable.querySelectorAll(".taula-productes-pressupost .producte-input-quantitat"))
    .filter(t => t.offsetParent !== null);

    var diccionariProductes = {};
    
    
       referenciesProd.forEach((element, index) => {
        const referencia = element.textContent.trim();
        const quantitat = quantitatsProd[index]?.value || 0;
        diccionariProductes[referencia] = quantitat;
    });
    
    console.log(diccionariProductes);
    var csrftoken = getCookie('csrftoken'); 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/crear_nou_pressupost/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken); // Include the CSRF token in the request header
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Respuesta del servidor:", xhr.responseText);
            window.location.reload();
            
        } else {
            console.error("Error en la solicitud:", xhr.statusText);
            alert("Falten dades per omplir. Revisa el client i els productes")
        }
    };
    xhr.onerror = function () {
        console.error("Error de red al enviar la solicitud.");
    };
    xhr.send(JSON.stringify({diccionariProductes:diccionariProductes, descripcio:descripcio,clientId:clientId,total:total}));
   
    

}