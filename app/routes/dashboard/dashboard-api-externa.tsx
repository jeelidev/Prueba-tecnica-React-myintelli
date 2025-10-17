import type { Route} from "./+types/dashboard-api-externa";
import { Button } from "~/components/ui/button"
import SetTitleBread from "~/components/triggersClient/setTitleBread"
import { useFetcher, useLoaderData } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "~/components/ui/spinner"
import { toast } from "sonner"
import { ScrollArea } from "~/components/ui/scroll-area"
import { CharacterDetails } from "~/components/CaracterDetail"

import { Search } from "lucide-react"

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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Listado de api externa - Jeelidev App" },
    { name: "description", content: "Listado personajes de Rick y Morty" },
  ];
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
    let url = new URL(request.url);
    let Page = url.searchParams.get("page");
    let link = url.searchParams.get("link");
    let filter = url.searchParams.get("filter");
    let activePage = 1
    let rawResponse 
        if (link) {
          const urlLink = new URL(link);
          const currentPage = urlLink.searchParams.get("page");
          activePage = currentPage ? Number(currentPage) : 1
          rawResponse = await fetch(link, {
              method: 'GET', 
          })
        } else if (Page) {
          activePage = Number(Page)
          rawResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${Page}`, {
             method: 'GET', 
          })
        } else if (filter) {
          rawResponse = await fetch(`https://rickandmortyapi.com/api/character/?name=${filter}`, {
            method: 'GET', 
          })
        } else {
          rawResponse = await fetch(`https://rickandmortyapi.com/api/character`, {
            method: 'GET', 
          })
        }
  const content = await rawResponse.json()
  if (!content) {
      return { data: { result: [], info: {}, activePage: null }, error:"error desconocido" }
  } 

  if (content?.error == "There is nothing here") {
      return { data: { result: [], info: {}, activePage: null }, error:"" }
  }
    
  return {data:{ result:content?.results, info: content?.info, activePage}, error:"" } 
  
}

export default function ApiExterna() {
    const initialData = useLoaderData();
    const fetcher = useFetcher();
    const fetcherFilter = useFetcher();
    const [items, setItems] = useState<any[]>([]);
    const [infoData, setInfoData] = useState<{[name:string]:any}>({});
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRefFilter = useRef<HTMLFormElement>(null);
    const [searchTerm, setSearchTerm] = useState<null | string>(null);
    const [activePage, setActivePage] = useState(1);
    const [modalOpen, setChangeModal] = useState(false);
    const [loaderModal, setLoaderModal] = useState(false);
    const [loaderModalError, setLoaderModalError] = useState<any>(null);
  
    const [urlFecth, setUrlFecth] = useState("")
    const [caracterData, setCaracterData] = useState<{[name:string]:any}>({})

  useEffect(() => {
            if (!urlFecth) {
              return;
            }
        const fetchDataModal = async () => {
          const controller = new AbortController();
          const signal = controller.signal;

          try {
            setLoaderModal(true);
            setLoaderModalError(null);

            const response = await fetch(urlFecth, {
              method: 'GET',
              signal,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setCaracterData(result);

          } catch (err) {
            // @ts-ignore:
            if (err && err.name !== 'AbortError') {
              setLoaderModalError(err);
            }
          } finally {
            setLoaderModal(false);
          }
          return () => {
            controller.abort();
          };
        }
        fetchDataModal();
    }, [urlFecth]);

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
            setActivePage(initialData.data.activePage)
        }
        if (initialData?.error) {
            toast.warning(`Error al cargar datos iniciales: ${initialData.error}`);
        }
     }, [initialData])
    
    useEffect(() => {
            if (fetcher.data?.data?.result && fetcher.state === 'idle') {
                setItems(fetcher.data.data.result);
                setInfoData(fetcher.data.data.info);
                setActivePage(fetcher.data.data.activePage)
                setTimeout(() => {
                    if (scrollAreaRef.current) {
                        const scrollElement = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
                        if (scrollElement) {
                            scrollElement.scrollTo({
                                top: - scrollElement.scrollHeight,
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
            setActivePage(fetcherFilter.data.data.activePage)

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
                                                <Button className="cursor-pointer" onClick={() => { setChangeModal(true); setUrlFecth(item.url) }}>
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
                            <Pagination className="max-w-[600px]">
                              <PaginationContent>
                                <PaginationItem>
                                 <PaginationPrevious disabled={!infoData.prev} onClick={()=>{ eventoEnvio({tipo:"link", dato:infoData.prev})}}  />
                                </PaginationItem>
                                  <PaginationItem>
                  {Array.from({ length: infoData.pages }, (_, i) => i).map((itemPage) => {
                    if(itemPage > 10 || itemPage== 0) {
                        return null
                    } else {
                      return (      <PaginationLink key={itemPage} className={ activePage == itemPage ? "text-(--accent-foreground) bg-(--foreground)" : "" }  onClick={()=>{ eventoEnvio({tipo:"page", dato:itemPage})}} >{itemPage}</PaginationLink>)
                    } 
                  })}             </PaginationItem>
                                  <PaginationItem>
                                  <PaginationNext disabled={!infoData.next} onClick={()=>{ eventoEnvio({tipo:"link", dato:infoData.next})}}/>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
          </div>
                            <Dialog open={modalOpen} onOpenChange={(estatus)=>{setChangeModal(estatus)}}>
                              <DialogContent className="xs:max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] xl:max-w-[800px] min-h-[400px]">
                                
                              {loaderModal ?
                                <div className="size-full flex justify-center items-center">
                                    <Spinner className="size-8" />
                                </div>
                                :
                                <DialogHeader>
                                    <DialogTitle>Detalles de { caracterData?.name}</DialogTitle>
                                    <CharacterDetails  character={caracterData} />
                                </DialogHeader>
                              }
                              </DialogContent>
                            </Dialog>
        </div>
        </>
  )
}

