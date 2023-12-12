import React from 'react';
import { Link } from 'react-router-dom';
import './menu.css';

const Menu = () => {
return (
    <div className='containerButtons'>
        <Link to="/agregar-pedido">
            <button>AGREGAR PEDIDO NUEVO</button>
        </Link>
        <Link to="/ver-pedidos">
            <button>VER PEDIDOS</button>
        </Link>
    </div>
);
};

export default Menu;
