import { useContext, useEffect } from 'react';
import reduxContext from '~/context/useMyRedux';

function setTitleBread({title}:{title:string}) {
    const { ChangeTitleDashboard } = useContext(reduxContext);
    useEffect(() => {
        ChangeTitleDashboard(title)
    }, [title])
    return <></>
  
}

export default setTitleBread;