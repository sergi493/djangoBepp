




async function genFactura(data, accion = 'email') {
    const formattedDate = new Date().toLocaleDateString('es-ES');
  const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  var baseTotal = (parseFloat(data.total) / 1.21).toFixed(2);
  var ivaTotal = (parseFloat(data.total) - baseTotal).toFixed(2);

  const base64Logo = await getBase64ImageFromUrl('/static/media/imagenes/beep.png');

  const docDefinition = {
  content: [
    // Header con logo + info empresa a la izquierda y info cliente a la derecha, alineados en altura
    {
      columns: [
        {
          width: 'auto',
          stack: [
            { image: base64Logo, width: 80 },
            { text: 'Beep Informàtica', style: 'title', margin: [0, 10, 0, 2] },
            { text: 'C/ Exemple, 123', style: 'companyInfo' },
            { text: '43736 El Masroig, Tarragona', style: 'companyInfo' },
            { text: 'Tel: 977 123 456', style: 'companyInfo' },
            { text: 'Email: beep@beep.com', style: 'companyInfo' },
            { text: 'CIF: B12345678', style: 'companyInfo' }
          ]
        },
       {
  width: '*',  // ocupa todo el espacio posible
  stack: [
    { text: `Factura núm. ${data.id}`, style: 'header', margin: [0, 0, 0, 5], alignment: 'right' },
    { text: `Data: ${formattedDate} - Hora: ${time}`, style: 'subheader', alignment: 'right' },
    { text: `Client: ${data.persona_nombre}`, style: 'subheader', margin: [0, 10, 0, 2], alignment: 'right' },
    { text: `Número client: ${data.persona_id}`, style: 'subheader', alignment: 'right' },
    { text: `Telèfon: ${data.telefon}`, style: 'subheader', alignment: 'right' },
    { text: `Procedència: ${data.procedencia} (Nº ${data.taula_id_procedencia})`, style: 'subheader', alignment: 'right' },
    { text: `Mètode de pagament: ${data.metodo_pago}`, style: 'subheader', alignment: 'right' }
  ]
}
      ]
    },

    { text: '\n' },

    // Tabla productos
    {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'ID', style: 'tableHeader' },
            { text: 'Nom', style: 'tableHeader' },
            { text: 'Preu', style: 'tableHeader' },
            { text: 'Quantitat', style: 'tableHeader' },            
            { text: 'Total', style: 'tableHeader' }
          ],
          ...data.productos.map(p => [
            p.producto_id,
            p.nombre,
            { text: `${p.preu} €`, alignment: 'right' },
            p.cantidad,
            { text: `${(p.preu * p.cantidad).toFixed(2)} €`, alignment: 'right' }
          ])
        ]
      },


      layout: 'lightHorizontalLines'
    },

    

   
    
  ],
footer: (currentPage, pageCount) => {
  return {
    table: {
      widths: ['*', 'auto', 'auto'],
      body: [
        [
          { text: 'Total Base sin IVA:', bold: true },
          { text: `${baseTotal} €`, bold: true, alignment: 'right' },
          { text: '', margin: [10, 0, 0, 0] }
        ],
        [
          { text: 'Total IVA (21%):', bold: true },
          { text: `${ivaTotal} €`, bold: true, alignment: 'right' },
          { text: '', margin: [10, 0, 0, 0] }
        ],
        [
          { text: 'Total:', bold: true, fontSize: 16 },
          { text: `${data.total} €`, bold: true, fontSize: 16, alignment: 'right' },
          { text: '', margin: [10, 0, 0, 0] }
        ]
      ],
       
    },
    layout: 'lightHorizontalLines',
    margin: [250, -70, 40, 0]  // Ajusta los márgenes para que quede bien en el pie
  };
},
styles: {
  title: { fontSize: 20, bold: true, color: '#0056A3' },
  companyInfo: { fontSize: 10, color: '#555' },
  header: { fontSize: 16, bold: true, margin: [0, 0, 0, 5], color: '#0056A3' },
  subheader: { fontSize: 11, margin: [0, 2, 0, 2] },
  tableHeader: { bold: true, fontSize: 12, fillColor: '#E0E0E0', alignment: 'center' },
  total: { fontSize: 14, bold: true, alignment: 'right', color: '#000' },
  ivaBase: { fontSize: 10, bold: true, alignment: 'right', color: '#333' },
  footer: { fontSize: 10, italics: true, color: '#777' }
}

};



console.log("preparaaaa...")
 if (typeof accion === 'function') {
  pdfMake.createPdf(docDefinition).getDataUrl(accion);

} else if (accion === 'print') {
  pdfMake.createPdf(docDefinition).print();
  console.log("imprimiendo...")
} else {
  // Por defecto, descarga
  pdfMake.createPdf(docDefinition).download(`factura_${data.id}.pdf`);
  console.log("descargando...")
}
};
