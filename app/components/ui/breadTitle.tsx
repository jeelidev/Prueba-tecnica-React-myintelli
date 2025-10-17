import { useContext } from 'react';
import reduxContext from '~/context/useMyRedux';

function BreadTitle() {
  const { contextRedux } = useContext(reduxContext);

  return (
      <h1>{contextRedux.titleDashboard}</h1>
  );
}

export default BreadTitle;