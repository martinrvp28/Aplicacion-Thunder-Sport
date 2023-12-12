import logo from './logo.svg';
import './App.css';
import Menu from './components/menu/Menu.js';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import AgregarPedido from './components/AgregarPedido/AgregarPedido.js';
import VerPedidos from './components/VerPedidos/VerPedidos.js';

function App() {
  return (
    <BrowserRouter>
      <div className='containerApp'>
        <Link to='/'><img className='mainLogo' src='logo.svg'></img></Link>

        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/agregar-pedido" element={<AgregarPedido />} />
          <Route path="/ver-pedidos" element={<VerPedidos/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
