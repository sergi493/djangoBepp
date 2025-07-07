// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('invoice-popup');

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => loadFactura(btn.dataset.id));
  });

  popup.addEventListener('click', e => {
    if (e.target === popup) hidePopup();
  });
});

async function loadFactura(id) {
  try {
    const res = await fetch(`/get_factura_data/${id}/`);
    const data = await res.json();
    showFactura(data);
  } catch (err) {
    console.error(err);
  }
}

function showFactura(data) {
  // Construcción simplificada del popup
  const content = document.createElement('div');
  content.className = 'popup-content';

  content.innerHTML = `
    <h2>Factura #${data.id}</h2>
    <p><strong>Cliente:</strong> ${data.persona_nombre}</p>
    <p><strong>Total:</strong> ${data.total} €</p>
    <button id="download-pdf" class="btn btn-primary">Descargar PDF</button>
    <button id="close-popup" class="btn btn-secondary">Cerrar</button>
  `;

  document.getElementById('invoice-popup').innerHTML = '';
  document.getElementById('invoice-popup').appendChild(content);
  document.getElementById('invoice-popup').classList.remove('hidden');

  document.getElementById('close-popup').onclick = hidePopup;
  document.getElementById('download-pdf').onclick = () => genPdf(data);
}

function hidePopup() {
  document.getElementById('invoice-popup').classList.add('hidden');
}

function genPdf(data) {
  const date = new Date(data.date);
  const docDef = {
    content: [
      { text: `Factura #${data.id}`, style: 'header' },
      { text: `Cliente: ${data.persona_nombre}`, margin: [0, 5] },
      { text: `Total: ${data.total} €`, margin: [0, 5] },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Producto', 'Cant.', 'Precio'],
            ...data.productos.map(p => [p.nombre, p.cantidad, `${p.preu} €`])
          ]
        }
      }
    ],
    styles: {
      header: { fontSize: 16, bold: true }
    }
  };
  pdfMake.createPdf(docDef).download(`factura_${data.id}.pdf`);
}