import { useContext } from 'react';
import reduxContext from '~/context/useMyRedux';

function Hola() {
  const { contextRedux } = useContext(reduxContext);

  return (
    <header>
      <h1>Bienvenido, {contextRedux.titleDashboard}</h1>
    </header>
  );
}

export default Hola;