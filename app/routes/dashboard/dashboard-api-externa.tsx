import type { Route} from "./+types/dashboard-api-externa";
import { Button } from "~/components/ui/button"
import SetTitleBread from "~/components/triggersClient/setTitleBread"
import { useFetcher, useLoaderData } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "~/components/ui/spinner"
import { toast } from "sonner"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Listado de api externa - Jeelidev App" },
    { name: "description", content: "Listado personajes de Rick y Morty" },
  ];
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
    let url = new URL(request.url);
    let offset = url.searchParams.get("link");
    let link = url.searchParams.get("link");
    console.log(link)
    const inneroffset = offset ? Number(offset) : 0

     const rawResponse = await fetch(`https://rickandmortyapi.com/api/character`, {
      method: 'GET', 
     })
  const content = await rawResponse.json()
    if (!content) {
        return { data: { result: [], offset: inneroffset }, error:"error desconocido" }
    } 
    
  return {data:{ result:content?.results, info: content?.info }, error:"" } 
  
}

export default function ApiExterna() {
    const initialData = useLoaderData();
    const fetcher = useFetcher();
    const fetcherFilter = useFetcher();
    const [items, setItems] = useState<any[]>([]);
    const [infoData, setInfoData] = useState<{[name:string]:any}>({});
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRefFilter = useRef<HTMLFormElement>(null);
    const formRefPaginator = useRef<HTMLFormElement>(null);
    const [searchTerm, setSearchTerm] = useState<null | string>(null);
  /* info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null
  },*/
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
  
      const eventoEnvio = ({ tipo, dato }: { tipo: string, dato: any }) => {
        const formData = new FormData();
        formData.append(tipo,dato)
        fetcher.submit(formData,{ method: "get" })
      }


    useEffect(() => {
        if (initialData?.data?.result) {
            setItems(initialData.data.result);
            setInfoData(initialData.data.info);
        }
        if (initialData?.error) {
            toast.warning(`Error al cargar datos iniciales: ${initialData.error}`);
        }
     }, [initialData])
    
    useEffect(() => {
            if (fetcher.data?.data?.result && fetcher.state === 'idle') {
                setItems(fetcher.data.data.result);
                setInfoData(fetcher.data.data.info);
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
            setInfoData(fetcherFilter.data.data.info);

            if (fetcherFilter.data?.error) {
                toast.warning(`Error al cargar más datos con filtro: ${fetcherFilter.data.error}`);
            }
        }
    }, [fetcherFilter.data, fetcherFilter.state]);

    
  const isLoadingMore = fetcher.state !== "idle" || fetcherFilter.state !== "idle";
  
    return (
       <>
        <SetTitleBread title="Rick y Morty Api" />
        <div className="flex flex-col h-full relative">
                <div>
                    <fetcherFilter.Form ref={formRefFilter} method="get" >
                            <InputGroup className="max-w-[300px]">
                            <InputGroupInput name="filter" value={searchTerm ? searchTerm : ''} onChange={(event) => { setSearchTerm(event.target.value) }} placeholder="Nombre de personaje" />
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
                                                <ItemHeader className="basis-auto w-full justify-center min-h-[150px]">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={128}
                                                        height={128}
                                                        className="aspect-1/2.5 rounded-sm contain-layout"
                                                        loading="lazy"
                                                    />
                                                </ItemHeader>
                                                <ItemContent className="basis-full" >
                                                    <ItemTitle className="text-center w-full flex justify-center pb-3">{item.name}- ID:{item.id}</ItemTitle>
                                                    <ItemDescription className=" w-full flex justify-center">
                                                         <Button className="cursor-pointer" onClick={()=>{ console.log(item.url)}}>
                                                              Ver Detalles
                                                         </Button>
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
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                 <PaginationPrevious disabled={!infoData.prev} onClick={()=>{ eventoEnvio({tipo:"link", dato:infoData.prev})}}  />
                                </PaginationItem>
                                <PaginationItem>
                  <PaginationLink >1</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                  <PaginationLink >2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationNext disabled={!infoData.next} onClick={()=>{ eventoEnvio({tipo:"link", dato:infoData.next})}}/>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
            </div>
        </div>
        </>
  )
}

