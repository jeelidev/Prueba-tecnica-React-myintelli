import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/dashboard-devices";
import { useFetcher, useLoaderData } from "react-router";
import { toast } from "sonner";
import { Search, XIcon } from "lucide-react";
import { getSession } from "~/lib/sessionManager.server";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ScrollArea } from "~/components/ui/scroll-area";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Item, ItemContent, ItemGroup, ItemDescription, ItemTitle } from "~/components/ui/item";
import SetTitleBread from "~/components/triggersClient/setTitleBread";


type Device = {
    id_device: number;
    device_name: string;
    photo: string;
    device_model: string;
    factory_family: string;
    hasGroups: boolean;
    status: number;
};

type LoaderData = {
    data: {
        result: Device[];
        offset: number;
    };
    error: string | null;
};

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Listado de Dispositivos - Jeelidev App" },
        { name: "description", content: "Listado de dispositivos de la cuenta" },
    ];
}


export async function loader({ request }: Route.LoaderArgs): Promise<LoaderData> {
    const url = new URL(request.url);
    const offset = url.searchParams.get("offset") || "0";
    const filter = url.searchParams.get("filter");
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");

    const params = new URLSearchParams({ limit: "10", offset });
    if (filter) {
        params.append("search", filter);
    }

    try {
        const rawResponse = await fetch(`https://api.qa.myintelli.net/v1/devices?${params.toString()}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        const content = await rawResponse.json();
        if (content?.status !== 200) {
            throw new Error(content?.message || "Error desconocido en la API");
        }

        return { data: { result: content.data.results, offset: content.data.offset }, error: null };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error de conexión";
        return { data: { result: [], offset: Number(offset) }, error: errorMessage };
    }
}

export default function Divices() {
    const initialData = useLoaderData() as LoaderData;
    const fetcher = useFetcher<LoaderData>();
    const fetcherFilter = useFetcher<LoaderData>();

    const [items, setItems] = useState<Device[]>([]);
    const [nextOffset, setNextOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);

    const formRefFilter = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (formRefFilter.current && searchTerm !== null) {
                fetcherFilter.submit(formRefFilter.current);
            }
        }, 1000);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (initialData?.data?.result) {
            setItems(initialData.data.result);
            setNextOffset(initialData.data.offset);
        }
        if (initialData?.error) {
            toast.error(`Error al cargar datos iniciales: ${initialData.error}`);
        }
    }, [initialData]);

    useEffect(() => {
        if (fetcher.data?.data?.result && fetcher.state === 'idle') {
            //@ts-ignore
            setItems(prevItems => [...prevItems, ...fetcher.data?.data.result]);
            setNextOffset(fetcher.data.data.offset);


            setTimeout(() => {
                const mainContainer = document.getElementById('main-general');
                if (mainContainer) {
                    mainContainer.scrollTo({ top: mainContainer.scrollHeight, behavior: 'smooth' });
                }
            }, 100);
        }
        if (fetcher.data?.error) {
            toast.error(`Error al cargar más datos: ${fetcher.data.error}`);
        }
    }, [fetcher.data, fetcher.state]);


    useEffect(() => {
        if (fetcherFilter.data?.data?.result && fetcherFilter.state === 'idle') {
            setItems(fetcherFilter.data.data.result);
            setNextOffset(fetcherFilter.data.data.offset);
        }
        if (fetcherFilter.data?.error) {
            toast.error(`Error al buscar: ${fetcherFilter.data.error}`);
        }
    }, [fetcherFilter.data, fetcherFilter.state]);

    const isLoading = fetcher.state !== "idle" || fetcherFilter.state !== "idle";

    return (
        <>
            <SetTitleBread title="Listar Dispositivos" />
            <div className="relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-20">
                    <div className="sticky top-0 flex justify-start p-4 bg-gradient-to-b from-background to-transparent pointer-events-auto">
                        <fetcherFilter.Form ref={formRefFilter} method="get">
                            <InputGroup className="w-full max-w-sm bg-input">
                                <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
                                <InputGroupInput name="filter" value={searchTerm === null ? "" : searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar dispositivo..." />
                                {searchTerm && (
                                    <InputGroupAddon>
                                        <Button variant="ghost" size="icon-sm" type="button" onClick={() => setSearchTerm("")}><XIcon className="size-4" /></Button>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                        </fetcherFilter.Form>
                    </div>

                    <div className="sticky bottom-0 flex justify-center p-4 bg-gradient-to-t from-background to-transparent pointer-events-auto">
                        <fetcher.Form method="get">
                            <input name="filter" type="hidden" value={searchTerm === null ? "" : searchTerm} />
                            <input name="offset" type="hidden" value={Number(nextOffset) + 5} />
                            <Button type="submit" size="lg" variant="secondary" disabled={isLoading || items.length == 0}>
                                {isLoading ? <><Spinner className="mr-2" /> Cargando...</> : "Cargar más"}
                            </Button>
                        </fetcher.Form>
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
                    <ScrollArea className="h-full">
                        <ItemGroup className="grid grid-cols-1 gap-6 p-4 pt-24 pb-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {items.map((item) => (
                                <Item
                                    key={item.id_device}
                                    variant="outline"
                                    className="flex flex-col rounded-lg shadow-md min-h-[380px] transition-shadow hover:shadow-xl "
                                >
                                    <div className="flex-none aspect-square max-h-40 rounded-t-lg bg-muted/20">
                                        <img
                                            src={item.photo}
                                            alt={item.device_name}
                                            className="size-full object-contain transition-transform duration-300 group-hover/item:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex flex-1 w-full flex-col flex-grow p-4 text-left">
                                        <ItemTitle className="font-semibold text-lg break-words">
                                            {item.device_name}
                                        </ItemTitle>
                                        <ItemDescription className="mt-2 text-sm text-muted-foreground flex-grow">
                                            <ul>
                                                <li><strong>Modelo:</strong> {item.device_model}</li>
                                                <li><strong>Fabricante:</strong> {item.factory_family}</li>
                                                <li><strong>Tiene grupo:</strong> {item.hasGroups ? "Sí" : "No"}</li>
                                                <li><strong>Estatus:</strong> {item.status === 0 ? "Activo" : "Inactivo"}</li>
                                            </ul>
                                        </ItemDescription>
                                    </div>
                                </Item>
                            ))}
                        </ItemGroup>
                    </ScrollArea>
                )}
            </div>
        </>
    );
}