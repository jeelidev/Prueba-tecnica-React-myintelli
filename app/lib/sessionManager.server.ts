import { createSessionStorage, createCookie, redirect, type SessionData, type FlashSessionData } from "react-router"
import { db } from "~/lib/dbManager.server"
import { userSession } from "db/schema";
import { eq } from 'drizzle-orm'

function createDatabaseSessionStorage({
  cookie,
  host,
  port,
}:SessionData) {

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      //@ts-ignore
      
      const insert = await db.insert(userSession).values(data).onConflictDoUpdate({
      target: userSession.id,
        set: {
            token: data.token,
            userData: data.userData,
            dateLastSession:data.dateLastSession,
            statusSession: data.statusSession,
            finLastSession: data.finLastSession
      },
    }).returning({ insertedId: userSession.id });
      return insert[0].insertedId.toString()
    },
    //@ts-ignore
    async readData(id) {
      const result = await db.select().from(userSession).where(eq(userSession.id, Number(id)));
      return result.length == 0 ? null : result[0]
    },
    
    async updateData(id, data, expires) {
    //@ts-ignore
      await db.update(userSession).set({
            token: data.token,
            userData: data.userData,
            dateLastSession:data.dateLastSession,
            statusSession: data.statusSession,
            finLastSession: data.finLastSession
      }).where(eq(userSession.id, Number(id)));
    },
    async deleteData(id) {
    //@ts-ignore
    await db.delete(userSession).where(eq(userSession.id, Number(id)))
    },
  });
}
export const sessionCookie = createCookie("__session", {
        httpOnly: true,
        maxAge: 120,
        path: "/",
        sameSite: "none",
        secrets: ["RRjj88j$$##@@"],
        secure: true,
      })
  
  export const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    host: process.env.HOST,
    port: process.env.PORT,
    cookie: sessionCookie
  });



