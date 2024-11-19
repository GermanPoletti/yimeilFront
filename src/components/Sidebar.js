import React from 'react';

const Sidebar = ({ token, cambiarVista, cerrarSesion }) => (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/LogoY.png" alt="Logo YIMEIL" className="logo-img"
        style={{ width: '50px', height: 'auto', marginRight: '10px' }}  />
        <h2 className="logo" style={{ color: 'white' }}>YIMEIL</h2>
      </div>
      <nav>
        <ul>
          {token ? (
          <>
            <li><button onClick={() => cambiarVista('bandeja')}>Bandeja de Entrada</button></li>
            <li><button onClick={() => cambiarVista('enviar')}>Enviar Mensaje</button></li>
            <li><button onClick={cerrarSesion}>Cerrar sesión</button></li>
          </>
        ) : null}
      </ul>
    </nav>
  </div>
);

export default Sidebar;
/*import React from 'react';

const Sidebar = ({ token, cambiarVista, cerrarSesion }) => (
    <div className="sidebar">
        <div className="logo-container">
            <img src="/YIMEIL.png" alt="Logo YIMEIL" className="logo-img" />
            <h2 className="logo">YIMEIL</h2>
        </div>
        <nav>
            <ul>
                {!token ? (
                    <li>
                        <button onClick={() => cambiarVista('login')}>Iniciar sesión</button>
                    </li>
                ) : (
                    <>
                        <li><button onClick={() => cambiarVista('bandeja')}>Bandeja de Entrada</button></li>
                        <li><button onClick={() => cambiarVista('enviar')}>Enviar Mensaje</button></li>
                        <li><button onClick={cerrarSesion}>Cerrar sesión</button></li>
                    </>
                )}
            </ul>
        </nav>
    </div>
);

export default Sidebar;*/
