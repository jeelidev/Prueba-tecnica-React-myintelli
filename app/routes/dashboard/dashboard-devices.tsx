import type { Route} from "./+types/dashboard-devices";
import {  getSession } from "~/lib/sessionManager.server"
import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import SetTitleBread from "~/components/triggersClient/setTitleBread"
import { toast } from "sonner"
import { useFetcher, useLoaderData } from "react-router";
import { useState, useEffect, useRef} from "react";
import { ScrollArea } from "~/components/ui/scroll-area"
import {  Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,

} from "~/components/ui/input-group"
import {
    Item,
    ItemDescription,
    ItemContent,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from "~/components/ui/item"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Listado de dispositivos - Jeelidev App" },
    { name: "description", content: "Listado de dispositivos" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
    let url = new URL(request.url);
    let offset = url.searchParams.get("offset");
    let filter = url.searchParams.get("filter");
    const inneroffset = offset ? Number(offset) : 0
    const session = await getSession(request.headers.get("Cookie"));

    const token = session.get("token")
     const rawResponse = await fetch(`https://api.qa.myintelli.net/v1/devices?limit=5&offset=${inneroffset}${filter ? `&search=${filter}` : ""}`, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
     })
    console.log(rawResponse)
    const content = await rawResponse.json()
    if (content?.status != 200 && content?.message) {
        return {data: { result: [], offset: inneroffset }, error:content?.message }
    } else if (content?.status != 200) {
        return { data: { result: [], offset: inneroffset }, error:"error desconocido" }
    }

    
  return {data:{ result:content?.data?.results, offset: content?.data?.offset }, error:"" } 
  
}


export default function Divices() {
    const initialData = useLoaderData();
    const fetcher = useFetcher();
    const fetcherFilter = useFetcher();
    const [items, setItems] = useState<any[]>([]);
    const [nextOffset, setNextOffset] = useState<number>(0);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRefFilter = useRef<HTMLFormElement>(null);
    const [searchTerm, setSearchTerm] = useState<null | string>(null);
    
        useEffect(() => {
        const handler = setTimeout(() => {
            if (formRefFilter.current && searchTerm !== null) {
                fetcherFilter.submit(formRefFilter.current);
            }
        }, 1000);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);


    useEffect(() => {
        if (initialData?.data?.result) {
            setItems(initialData.data.result);
            setNextOffset(initialData.data.offset);
        }
        if (initialData?.error) {
            toast.warning(`Error al cargar datos iniciales: ${initialData.error}`);
        }
     }, [initialData])
    
    useEffect(() => {
            if (fetcher.data?.data?.result && fetcher.state === 'idle') {
                setItems(prevItems => [...prevItems, ...fetcher.data.data.result]);
                setNextOffset(fetcher.data.data.offset);
                setTimeout(() => {
                    if (scrollAreaRef.current) {
                        const scrollElement = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
                        if (scrollElement) {
                            scrollElement.scrollTo({
                                top: scrollElement.scrollHeight,
                                behavior: 'smooth'
                            });   
                        }
                    }
                }, 500);
            }
            if (fetcher.data?.error) {
                toast.warning(`Error al cargar más datos: ${fetcher.data.error}`);
            }
    }, [fetcher.data, fetcher.state]);
    
    useEffect(() => {
        if (fetcherFilter.data?.data?.result && fetcherFilter.state === 'idle') {
            setItems(fetcherFilter.data.data.result);
            setNextOffset(fetcherFilter.data.data.offset);

            if (fetcherFilter.data?.error) {
                toast.warning(`Error al cargar más datos con filtro: ${fetcherFilter.data.error}`);
            }
        }
    }, [fetcherFilter.data, fetcherFilter.state]);

    
    const isLoadingMore = fetcher.state !== "idle" ||  fetcherFilter.state !== "idle" ;

    return (
        <>
        <SetTitleBread title="List Devices" />
        <div className="flex flex-col h-full relative">
                <div>
                    <fetcherFilter.Form ref={formRefFilter} method="get" >
                            <InputGroup className="max-w-[300px]">
                            <InputGroupInput name="filter" value={searchTerm ? searchTerm : ''} onChange={(event) => { setSearchTerm(event.target.value) }} placeholder="Buscar..." />
                                <InputGroupAddon>
                                <Search />
                                </InputGroupAddon>
                            <InputGroupAddon align="inline-end">{ items.length } results</InputGroupAddon>
                            </InputGroup>
                    </fetcherFilter.Form>
                </div>
                    {
                        items.length === 0 && !isLoadingMore ?
                            <div className="flex-grow w-full  pt-12">
                                <p className="font-bold text-xl text-center p-4 bg-card rounded border-secondary not-first-of-type:border-2">
                                    no hay resuldados para mostrar
                                </p>
                            </div>
                        :
                            <ScrollArea ref={scrollAreaRef} className="flex-grow w-full max-h-(--calc-height-devices) pt-12 mask-b-from-10% mask-b-to-100% ">
                                <ItemGroup className="flex w-full flex-row flex-wrap gap-4 mb-[32%] justify-center">
                                    {items.map((item: any) => {
                                        return (
                                            <Item key={item.id_device} className="min-w-70  max-w-90 w-1/3" variant="outline">
                                                <ItemHeader className="basis-auto w-full justify-center min-h-[300px]">
                                                    <img
                                                        src={item.photo}
                                                        alt={item.device_name}
                                                        width={128}
                                                        height={128}
                                                        className="aspect-1/2.5 rounded-sm contain-layout"
                                                        loading="lazy"
                                                    />
                                                </ItemHeader>
                                                <ItemContent className="basis-full" >
                                                    <ItemTitle>{item.device_name}- ID:{item.id_device}</ItemTitle>
                                                    <ItemDescription className="block">
                                                        <ul>
                                                            <li>Modelo: {item.device_model}</li>
                                                            <li>Fabricante: {item.factory_family}</li>
                                                            <li>Tiene grupo: {item.hasGroups ? "si" : "no"}</li>
                                                            <li>Estatus: {!item.status ? `${item.status} (activo)` : `${item.status} (Inactivo)`}</li>
                                                        </ul>
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        )
                                    })}
                                </ItemGroup>
                            </ScrollArea>
                }
            {isLoadingMore &&
                <div className="flex w-full h-full justify-center items-center max-h-(--calc-height-devices) absolute mt-9 backdrop-blur-sm ">
                    <Spinner className="size-8" />
                </div>
            }
            <div className="w-full flex justify-center absolute bottom-0 pb-5">
                    <fetcher.Form method="get" >
                        <input name="filter" type="hidden" value={searchTerm ? searchTerm : ''} />
                        <input name="offset" type="hidden" value={Number(nextOffset) + 5} />
                        <Button name="submit" value="cargar-mas" type="submit" size="lg" variant="secondary" disabled={isLoadingMore}>
                        {isLoadingMore && <><Spinner /> Cargando...</>}
                        {!isLoadingMore && "Cargar mas"} 
                        </Button>
                </fetcher.Form>
            </div>
        </div>
        </>
  )
}

