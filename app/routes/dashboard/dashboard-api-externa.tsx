import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/dashboard-api-externa";
import { useFetcher, useLoaderData } from "react-router";
import { toast } from "sonner";
import { Search, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CharacterDetails } from "~/components/CaracterDetail";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from "~/components/ui/item";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import SetTitleBread from "~/components/triggersClient/setTitleBread";


type Character = {
  id: number;
  name: string;
  image: string;
  url: string;
};

type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

type LoaderData = {
  data: {
    result: Character[];
    info: Info;
    activePage: number;
  };
  error: string | null;
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Listado de API Externa - Jeelidev App" },
    { name: "description", content: "Listado de personajes de Rick y Morty" },
  ];
}

export async function loader({ request }: Route.LoaderArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const link = url.searchParams.get("link");
  const filter = url.searchParams.get("filter");

  let fetchUrl = "https://rickandmortyapi.com/api/character";
  const params = new URLSearchParams();

  if (link) {
    fetchUrl = link;
  } else {
    if (page) params.append("page", page);
    if (filter) params.append("name", filter);
    if (params.toString()) {
      fetchUrl += `?${params.toString()}`;
    }
  }

  try {
    const rawResponse = await fetch(fetchUrl);
    if (rawResponse.status != 200 && rawResponse.status != 404) throw new Error(`API Error: ${rawResponse.statusText}`);

    const content = await rawResponse.json();
    if (content.error === "There is nothing here") {
      return { data: { result: [], info: { count: 0, pages: 0, next: null, prev: null }, activePage: 1 }, error: null };
    }

    const finalUrl = new URL(fetchUrl);
    const activePage = Number(finalUrl.searchParams.get("page") || "1");

    return { data: { result: content.results, info: content.info, activePage }, error: null };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    toast.error(errorMessage);
    return { data: { result: [], info: { count: 0, pages: 0, next: null, prev: null }, activePage: 1 }, error: errorMessage };
  }
}

export default function ApiExterna() {
  const initialData = useLoaderData() as LoaderData;
  const fetcher = useFetcher<LoaderData>();
  const fetcherFilter = useFetcher<LoaderData>();


  const [items, setItems] = useState<Character[]>([]);
  const [infoData, setInfoData] = useState<Info>({ count: 0, pages: 0, next: null, prev: null });
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<null | string>(null);


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCharacterUrl, setSelectedCharacterUrl] = useState<string | null>(null);
  const { data: characterData, loading: loaderModal, error: loaderModalError } = useCharacterFetch(selectedCharacterUrl);

  const formRefFilter = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formRefFilter.current && searchTerm !== null) {
        fetcherFilter.submit(formRefFilter.current);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const handlePagination = (type: "link" | "page", value: string | number) => {
    const formData = new FormData();
    formData.append(type, String(value));
    fetcher.submit(formData, { method: "get" });
  };

  const openCharacterModal = (characterUrl: string) => {
    setSelectedCharacterUrl(characterUrl);
    setModalOpen(true);
  };


  useEffect(() => {
    const source = initialData;
    if (source?.data?.result) {
      setItems(source.data.result);
      setInfoData(source.data.info);
      setActivePage(source.data.activePage);
    }
    const errorSource = initialData.error;
    if (errorSource) {
      toast.warning(`Error: ${errorSource}`);
    }
  }, [initialData]);

  useEffect(() => {
    const source = fetcher.data || fetcherFilter.data;
    if (source?.data?.result) {
      setItems(source.data.result);
      setInfoData(source.data.info);
      setActivePage(source.data.activePage);
    }
    const errorSource = fetcher.data?.error;
    if (errorSource) {
      toast.warning(`Error: ${errorSource}`);
    }
  }, [fetcher.data]);

  useEffect(() => {
    const source = fetcherFilter.data;
    if (source?.data?.result) {
      setItems(source.data.result);
      setInfoData(source.data.info);
      setActivePage(source.data.activePage);
    }
    const errorSource = fetcher.data?.error;
    if (errorSource) {
      toast.warning(`Error: ${errorSource}`);
    }
  }, [fetcherFilter.data]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      document.getElementById('main-general')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetcher.data, fetcher.state]);

  const isLoading = fetcher.state !== "idle" || fetcherFilter.state !== "idle";

  return (
    <>
      <SetTitleBread title="Rick y Morty API" />
      <div className="relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-20">
          <div className="sticky top-0 flex justify-start p-4 bg-gradient-to-b from-background to-transparent pointer-events-auto min-h-[150px]">
            <fetcherFilter.Form ref={formRefFilter} method="get">
              <InputGroup className="w-full max-w-sm bg-input">
                <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
                <InputGroupInput name="filter" value={searchTerm === null ? "" : searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar personaje..." />
                {searchTerm && (
                  <InputGroupAddon>
                    <Button variant="ghost" size="icon-sm" type="button" onClick={() => setSearchTerm("")}><XIcon className="size-4" /></Button>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </fetcherFilter.Form>
          </div>

          <div className="sticky bottom-0 flex p-4 text-color-primary bg-gradient-to-t from-background to-transparent pointer-events-none min-h-[150px]">
            <Pagination className="items-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className="pointer-events-auto" disabled={!infoData.prev} onClick={() => handlePagination("link", infoData.prev!)} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink className="pointer-events-auto" isActive>{activePage}</PaginationLink>
                  <span className="px-2 text-sm text-muted-foreground">de {infoData.pages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext className="pointer-events-auto" disabled={!infoData.next} onClick={() => handlePagination("link", infoData.next!)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-30">
            <Spinner className="size-8" />
          </div>
        )}

        {items.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-(--max-height-filtros) py-20">
            <p className="p-4 text-lg font-medium text-muted-foreground">No hay resultados para mostrar</p>
          </div>
        ) : (
          <ScrollArea
            className="h-full"
          >
            <ItemGroup className="grid grid-cols-1 gap-6 p-4 pt-24 pb-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {items.map((item) => (
                <Item key={item.id} variant="outline" className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl group/item">
                  <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                    <img src={item.image} alt={item.name} className="size-full object-cover transition-transform duration-300 group-hover/item:scale-105" loading="lazy" />
                  </div>
                  <div className="flex flex-col flex-grow p-4 text-center">
                    <h3 className="flex-grow font-semibold text-lg">{item.name}</h3>
                    <Button className="mt-4 w-full" onClick={() => openCharacterModal(item.url)}>
                      Ver Detalles
                    </Button>
                  </div>
                </Item>
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-3xl  flex flex-col max-h-[90vh]">
          {loaderModal && (
            <div className="flex items-center justify-center flex-grow">
              <Spinner className="size-8" />
            </div>
          )}
          {loaderModalError && <p className="text-red-500">Error al cargar: {loaderModalError.message}</p>}
          {characterData && !loaderModal && (
            <>
              <DialogHeader className="shrink-0">
                <DialogTitle>Detalles de {characterData.name}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-2">
                <CharacterDetails character={characterData} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

}


function useCharacterFetch(url: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}