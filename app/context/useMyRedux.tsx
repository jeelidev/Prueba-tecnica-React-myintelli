import React, { useState, createContext, useEffect } from 'react';

interface  ContextRedux {
        [name:string]:any
    };

export interface useMyRedux {
    contextRedux:ContextRedux,
    setContextRedux: (actualUserSession:ContextRedux) => void;
  AddValue: (name: string, value: any) => void;
  ChangeTitleDashboard: (name: string) => void;
}

const MyContext = createContext<useMyRedux>({
    contextRedux: {
        id: 0,
    },
    setContextRedux: (actualUserSession: ContextRedux) => {},
    AddValue: () => { },
    ChangeTitleDashboard:() => { }
})
export default MyContext;

export function UseReduxProvider({ children }: { children: React.ReactNode }) {
    const [contextRedux, dispachContextRedux] = useState<ContextRedux>({
        titleDashboard: "",
    });
    useEffect(() => {
      const persistente = localStorage.getItem("client-persisten-status")  
      console.log(persistente)
      if (persistente) {
        const ObjectPersistente = JSON.parse(persistente)
        dispachContextRedux({...ObjectPersistente})
      }
    },[])
  const setContextRedux = (actualUserSession: ContextRedux) => {
    dispachContextRedux(actualUserSession);
    localStorage.setItem("client-persisten-status", JSON.stringify({ ...actualUserSession }))
  }
  const AddValue = (name: string, value: any) => {
      dispachContextRedux({ ...contextRedux, [name]: value })
       localStorage.setItem("client-persisten-status", JSON.stringify({ ...contextRedux, [name]: value }))
  }
  const ChangeTitleDashboard = (name: string) => {
      dispachContextRedux({ ...contextRedux, titleDashboard: name })
      localStorage.setItem("client-persisten-status", JSON.stringify({ ...contextRedux, titleDashboard: name }))
  }


  return (
    <MyContext.Provider value={{ contextRedux, setContextRedux, AddValue, ChangeTitleDashboard }}>
      {children}
    </MyContext.Provider>
  );
}
