import { useContext } from 'react';
import reduxContext from '~/context/useMyRedux';

function Button({ children }: { children?: string }) {
  const { contextRedux, AddValue } = useContext(reduxContext);

  return (
    <header>
      <button onClick={() => { AddValue("titleDashboard",`${contextRedux.titleDashboard}a`) }}>{children ? children : "HACER CLICK"}</button>
    </header>
  );
}

export default Button;