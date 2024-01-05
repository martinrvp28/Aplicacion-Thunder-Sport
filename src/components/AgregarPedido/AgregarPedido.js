import './agregarpedido.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/database';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import React, { useState } from 'react';

const AgregarPedido = () => {
  const [pedido, setPedido] = useState({
    comprador: '',
    numeroContacto: '',
    instagramContacto: '',
    equipo: '',
    numeroCamiseta: '',
    nombreCamiseta: '',
    fotos: [],
    diseñoChapa: '',
    estado: 'RECIBIDO',
    cantidad: 0, // Nuevo campo 'cantidad'
    observaciones: '', // Nuevo campo 'observaciones'
  });

  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido((prevPedido) => ({
      ...prevPedido,
      [name]: value,
    }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Setear loading a true al comenzar el proceso
      setLoading(true);

      // Subir la imagen a Firebase Storage si hay una imagen seleccionada
      let fotosArray = pedido.fotos;
      if (imagen) {
        const storage = getStorage();
        const storageRef = ref(storage, 'fotos/' + imagen.name);
        await uploadBytes(storageRef, imagen);

        // Obtener la URL de la imagen después de subirla
        const url = await getDownloadURL(storageRef);

        // Agregar la URL de la imagen al array de fotos
        fotosArray = [...fotosArray, url];
      }

      // Crear el objeto pedido con la fecha y las fotos
      const pedidoConFecha = { ...pedido, fecha: serverTimestamp(), fotos: fotosArray };

      // Agregar el pedido a la colección 'pedidos' en la base de datos
      await addDoc(collection(db, 'pedidos'), pedidoConFecha);

      // Resetear el estado del formulario después de enviar el pedido
      setPedido({
        comprador: '',
        numeroContacto: '',
        instagramContacto: '',
        equipo: '',
        numeroCamiseta: '',
        nombreCamiseta: '',
        fotos: [],
        diseñoChapa: '',
        estado: 'RECIBIDO',
        cantidad: 0, // Restablecer el valor de 'cantidad'
        observaciones: '', // Restablecer el valor de 'observaciones'
      });

      // Setear loading a false después de completar el proceso
      setLoading(false);

      console.log('Pedido enviado a Firebase');
      // Puedes agregar lógica adicional después de enviar el pedido
    } catch (error) {
      console.error('Error al enviar el pedido a Firebase:', error);
      // Setear loading a false en caso de error
      setLoading(false);
    }
  };

  if (loading === true) {

    return (
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <img className='logoLoading' src='logoLoading.svg'></img>
      </div>
    );
    
  } else {
    return (
      <div>
        <h1>Agregar Pedido</h1>
        <form className='containerForm' onSubmit={handleSubmit}>
          <div className='containerDoubles'>
            <div className='containerLabel'>
              <label>
                Comprador:
              </label>
              <input type="text" name="comprador" value={pedido.comprador} onChange={handleChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Número de Contacto:
              </label>
              <input type="text" name="numeroContacto" value={pedido.numeroContacto} onChange={handleChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Instagram de Contacto:
              </label>
              <input type="text" name="instagramContacto" value={pedido.instagramContacto} onChange={handleChange} />
            </div>
          </div>
          <div className='containerDoubles'>
            <div className='containerLabel'>
              <label>
                Equipo:
              </label>
              <input type="text" name="equipo" value={pedido.equipo} onChange={handleChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Número en Camiseta:
              </label>
              <input type="text" name="numeroCamiseta" value={pedido.numeroCamiseta} onChange={handleChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Nombre en Camiseta:
              </label>
              <input type="text" name="nombreCamiseta" value={pedido.nombreCamiseta} onChange={handleChange} />
            </div>
          </div>
          <div className='containerDoubles'>
            <div className='containerLabel'>
              <label>
                Fotos:
              </label>
              <input type="file" accept="image/*" onChange={handleImagenChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Diseño de Chapa:
              </label>
              <input type="text" name="diseñoChapa" value={pedido.disenoChapa} onChange={handleChange} />
            </div>
          </div>
          <div className='containerDoubles'>
            <div className='containerLabel'>
              <label>
                Cantidad:
              </label>
              <input type="number" name="cantidad" value={pedido.cantidad} onChange={handleChange} />
            </div>
            <div className='containerLabel'>
              <label>
                Observaciones:
              </label>
              <input type="text" name="observaciones" value={pedido.observaciones} onChange={handleChange} />
            </div>
          </div>
          <button type="submit">Agregar Pedido</button>
        </form>
      </div>
    );
  }
};

export default AgregarPedido;
