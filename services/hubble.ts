export interface HubbleImage {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
}

export async function getHubbleGallery(): Promise<HubbleImage[]> {
  // Buscamos especificamente por imagens científicas do Hubble
  const query = "hubble space telescope science nebula galaxy";
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.collection || !data.collection.items) return [];

    return data.collection.items
      .slice(0, 40) // Pegamos uma boa quantidade para garantir variedade
      .map((item: any) => ({
        id: item.data[0].nasa_id,
        title: item.data[0].title || "Exploração Hubble",
        description:
          item.data[0].description ||
          "Imagem capturada pelo Telescópio Espacial Hubble.",
        url: item.links && item.links[0] ? item.links[0].href : "",
        date: item.data[0].date_created
          ? item.data[0].date_created.split("T")[0]
          : "",
      }))
      .filter((img: HubbleImage) => img.url !== "");
  } catch (error) {
    console.error("Erro ao buscar galeria Hubble:", error);
    return [];
  }
}
