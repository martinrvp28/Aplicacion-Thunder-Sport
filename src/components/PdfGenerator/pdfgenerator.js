import pdfMake from 'pdfmake';

const getDataUri = async (url) => {
  return new Promise((resolve) => {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); // obtener imágenes desde un dominio externo

    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;

      // las siguientes tres líneas son para un fondo blanco en caso de que la imagen tenga fondo transparente
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';  // establecer estilo de relleno blanco
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.getContext('2d').drawImage(this, 0, 0);

      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.src = url;
  });
};

export const generarPDF = async (pedidos) => {
  const promises = pedidos.map(async (pedido, index) => {
    if (!pedido.fotoURL) {
      console.error(`La URL de la imagen para el pedido ${index} está indefinida.`);
      return null;
    }

    const imageDataUri = await getDataUri(pedido.fotoURL);

    return [
      {
        image: imageDataUri,
        width: 50,
        alignment: 'left',
      },
      { text: `Equipo: ${pedido.equipo}`, margin: [60, 0, 0, 0] },
      { text: `Nombre en Camiseta: ${pedido.nombreCamiseta}`, margin: [60, 0, 0, 0] },
      { text: `Numero en Camiseta: ${pedido.numeroCamiseta}`, margin: [60, 0, 0, 0] },
      // ... Agregar más información según tu estructura de datos ...
    ];
  });

  const content = (await Promise.all(promises)).filter(Boolean);

  const docDefinition = {
    content: [
      { text: 'Pedidos Registrados', style: 'header' },
      // Iterar sobre los pedidos y agregar la información al PDF
      ...content,
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
  };

  pdfMake.createPdf(docDefinition).download('Pedidos.pdf');
};
