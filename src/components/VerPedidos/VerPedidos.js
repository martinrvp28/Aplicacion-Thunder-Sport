import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/database';

import './VerPedidos.css';

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const q = query(collection(db, 'pedidos'), orderBy('fecha'));
        const pedidosSnapshot = await getDocs(q);
        const pedidosData = [];

        for (const doc of pedidosSnapshot.docs) {
          const pedido = doc.data();
          const fotoURL = await getDownloadURL(ref(storage, pedido.fotos));
          const pedidoConFoto = { ...pedido, fotoURL, id: doc.id };
          pedidosData.push(pedidoConFoto);
        }

        setPedidos(pedidosData);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    obtenerPedidos();
  }, []);

  const eliminarPedido = async (pedidoId, fotoNombre) => {
    try {
      const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este pedido?');
      if (!confirmacion) {
        return;
      }

      if (!pedidoId || !fotoNombre) {
        console.error('ID de pedido o nombre de foto no válido.');
        return;
      }

      // Eliminar la imagen del storage
      await deleteObject(ref(storage, fotoNombre));

      // Eliminar el pedido de la base de datos
      await deleteDoc(doc(db, 'pedidos', pedidoId));

      // Actualizar la lista de pedidos después de la eliminación
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const actualizarEstado = async (pedidoId) => {
    try {
      const confirmacion = window.confirm('¿Estás seguro de cambiar el estado de este pedido?');
      if (!confirmacion) {
        return;
      }

      // Obtener el pedido correspondiente
      const pedido = pedidos.find((p) => p.id === pedidoId);
  
      // Verificar si el pedido existe y tiene un estado válido
      if (!pedido || !pedido.estado) {
        console.error('Pedido no encontrado o estado no válido.');
        return;
      }
  
      // Determinar el nuevo estado en función del estado actual
      const nuevoEstado = pedido.estado === 'RECIBIDO' ? 'ENCARGADO' : 'RECIBIDO';
  
      // Actualizar el estado en la base de datos
      await updateDoc(doc(db, 'pedidos', pedidoId), { estado: nuevoEstado });
  
      // Actualizar localmente el estado del pedido
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  return (
    <div>
      <h1>Pedidos Registrados</h1>
      <ul className='containerUl'>
        {pedidos.map((pedido, index) => (
          <li key={index}>
            <div className='containerInfo'>
              <div>
                <img className='prodImg' src={pedido.fotoURL} alt={`Foto del pedido ${index}`} />
                <br />
                Comprador: <strong>{pedido.comprador}</strong>
                <br />
                Número de Contacto: <strong>{pedido.numeroContacto}</strong>
                <br />
                Instagram de Contacto: <strong>{pedido.instagramContacto}</strong>
                <br />
                Equipo: <strong>{pedido.equipo}</strong>
                <br />
                Número en Camiseta: <strong>{pedido.numeroCamiseta}</strong>
                <br />
                Nombre en Camiseta: <strong>{pedido.nombreCamiseta}</strong>
                <br />
              </div>
              {/* Muestra la información de cada pedido, incluida la imagen */}

              {/* Agregar el botón de eliminar pedido */}
              <button
                className='eliminarPedido'
                onClick={() => eliminarPedido(pedido.id, pedido.fotoURL)}
              >
                Eliminar Pedido
              </button>

              {/* Agregar el botón de cambiar estado */}
              <button
                className='estadoFlotante'
                style={{ backgroundColor: pedido.estado === 'ENCARGADO' ? 'green' : 'rgb(230, 181, 92)',
                color: pedido.estado === 'ENCARGADO' ? 'white' : 'black' }}
                
                
                onClick={() => actualizarEstado(pedido.id)}
              >
                Estado: {pedido.estado}
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerPedidos;
