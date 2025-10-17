import { createContext } from "react-router";
import { type UserSession } from "../../db/schema"
import { useState } from 'react';
import { db } from "~/lib/dbManager.server"
import { userSession } from "db/schema";
import { eq } from 'drizzle-orm'
import { redirect } from "react-router"
/*
export interface useMyRedux {
    UserSessionLocal: {
        id: number;
        token: string | null;
        userData: string;
        dateLastSession: Date;
        statusSession: boolean;
        finLastSession: Date;
    };
    setUserSession: (actualUserSession: UserSession) => void;
    Loguout: () => Promise<void>;
}
function useMyRedux(initialValue = {
        id: 0,
        token: "",
        userData: "",
        dateLastSession: new Date(),
        statusSession: false,
        finLastSession:  new Date('0000-00-00')
}) {
  const [UserSessionLocal, dispachUserSession] = useState<UserSession>(initialValue);

  const setUserSession = (actualUserSession:UserSession) => dispachUserSession(actualUserSession);
    const Loguout = async () => {
        await await db.update(userSession).set({
            statusSession: false,
        }).where(eq(userSession.id, Number(UserSessionLocal.id)));
        dispachUserSession({...UserSessionLocal, statusSession:false})
        redirect("/")
    }
;

  return { UserSessionLocal, setUserSession, Loguout };
}*/


export const generalContextServer= createContext(null);