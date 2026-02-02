import { ImageSourcePropType } from "react-native";

export interface Star {
  id: string;
  name: string;
  constellation: string;
  brightness: string;
  visibleInHemisphere: "North" | "South" | "Both";
}

export interface Constellation {
  id: string;
  name: string;
  description: string;
  imageUrl: ImageSourcePropType;
  stars: string[];
  history: string;
}

export const getVisibleStars = (latitude: number): Star[] => {
  const stars: Star[] = [
    {
      id: "1",
      name: "Canopus",
      constellation: "Carina",
      brightness: "-0.74",
      visibleInHemisphere: "South",
    },
    {
      id: "2",
      name: "Sirius",
      constellation: "Cão Maior",
      brightness: "-1.46",
      visibleInHemisphere: "Both",
    },
    {
      id: "3",
      name: "Acrux",
      constellation: "Cruzeiro do Sul",
      brightness: "0.77",
      visibleInHemisphere: "South",
    },
    {
      id: "4",
      name: "Antares",
      constellation: "Escorpião",
      brightness: "1.06",
      visibleInHemisphere: "Both",
    },
    {
      id: "5",
      name: "Betelgeuse",
      constellation: "Órion",
      brightness: "0.42",
      visibleInHemisphere: "Both",
    },
    {
      id: "6",
      name: "Alpha Centauri",
      constellation: "Centauro",
      brightness: "-0.27",
      visibleInHemisphere: "South",
    },
  ];

  return stars.filter(
    (s) =>
      s.visibleInHemisphere === "South" || s.visibleInHemisphere === "Both",
  );
};

export const getConstellationsData = (): Constellation[] => [
  {
    id: "1",
    name: "Cruzeiro do Sul",
    description: "A bússola estelar do Hemisfério Sul.",
    imageUrl: require("../assets/images/Crux-Australis.png"),
    stars: [
      "Acrux (Alpha Crucis)",
      "Mimosa (Beta Crucis)",
      "Gacrux (Gamma Crucis)",
      "Imai (Delta Crucis)",
      "Intrometida (Epsilon Crucis)",
    ],
    history: `O Cruzeiro do Sul é a menor das 88 constelações, mas talvez a mais famosa. 

ORIGEM E ETIMOLOGIA:
O nome deriva da forma óbvia de cruz latina. Na antiguidade, era visível da Grécia, mas devido à precessão dos equinócios, "desceu" no horizonte. Foi separada da constelação de Centaurus no século XVII. Para os povos indígenas brasileiros, como os Guaranis, faz parte da figura do 'Homem Velho' ou da 'Ema'.

USO NAS NAVEGAÇÕES:

Foi o principal instrumento de navegação dos portugueses. Como não há uma 'Estrela Polar' no sul, os marinheiros estendiam o braço maior da cruz 4,5 vezes para localizar o Polo Sul Celeste. Na Bahia, ela é visível quase o ano todo, atingindo seu ponto mais alto entre abril e junho.

CURIOSIDADE CIENTÍFICA:
A estrela Epsilon Crucis é chamada de 'Intrometida' no Brasil porque quebra a simetria perfeita dos quatro braços da cruz.`,
  },
  {
    id: "2",
    name: "Órion",
    description: "O gigante caçador do equador celeste.",
    imageUrl: require("../assets/images/orion.jpg"),
    stars: [
      "Betelgeuse",
      "Rigel",
      "Bellatrix",
      "Saiph",
      "Alnitak",
      "Alnilam",
      "Mintaka",
    ],
    history: `Órion é uma constelação monumental visível globalmente.

MITOLOGIA COMPLETA:
Na tradição grega, Órion era um caçador de beleza e força descomunais, filho de Poseidon. Após ser morto por um escorpião, foi colocado entre as estrelas. Suas famosas 'Três Marias' (Alnitak, Alnilam e Mintaka) representam o Cinturão de Órion.

ASTRONOMIA E NAVEGAÇÃO:

As 'Três Marias' nascem quase exatamente no ponto cardeal Leste. Isso permitia que navegantes em mar aberto corrigissem suas rotas sem bússola magnética. Logo abaixo do cinturão, encontra-se a Grande Nebulosa de Órion (M42), uma das maiores fábricas de estrelas do universo, visível a olho nu em cidades com pouca poluição luminosa como as do interior da Bahia.

ESTRELAS DE CONTRASTE:
Possui Rigel (uma supergigante azul jovem) e Betelgeuse (uma supergigante vermelha moribunda), mostrando o ciclo de vida das estrelas em um só quadro.`,
  },
  {
    id: "3",
    name: "Escorpião",
    description: "A serpente de fogo que guarda o centro da galáxia.",
    imageUrl: require("../assets/images/scorpius.jpg"),
    stars: ["Antares", "Shaula", "Sargas", "Dschubba"],
    history: `Uma das poucas constelações que realmente se parece com o nome que carrega.

HISTÓRIA E NOME:
O nome vem do escorpião que confrontou Órion. Na mitologia grega, eles nunca aparecem juntos no céu: quando um nasce, o outro se põe, representando uma eterna fuga.

NAVEGAÇÃO E CLIMA:
Para os navegadores austrais, o Escorpião é o marco do inverno. Sua estrela principal, Antares, significa "Anti-Ares" (O Rival de Marte), devido à sua cor vermelha intensa. 

A 'cauda' do escorpião mergulha na parte mais rica da Via Láctea. Marinheiros usavam essa densidade de estrelas para identificar a direção do Centro Galáctico, uma região vital para observação astronômica primária.`,
  },
  {
    id: "4",
    name: "Centauro",
    description: "O portal para o sistema estelar mais próximo.",
    imageUrl: require("../assets/images/centaurus.avif"),
    stars: ["Rigil Kentaurus (Alpha Centauri)", "Hadar", "Menkent"],
    history: `Centauro é uma constelação colossal que abriga os vizinhos mais próximos do Sol.

O SÁBIO QUÍRON:
Representa Quíron, o mais nobre dos centauros, mestre de medicina e astronomia. Ele foi colocado no céu para honrar sua imortalidade e sabedoria.

CIÊNCIA E NAVEGAÇÃO:

Alpha Centauri não é uma estrela, mas um sistema triplo. A Alpha Centauri C (Próxima Centauri) está a apenas 4,24 anos-luz de nós. 
Na navegação, Alpha e Hadar são chamadas de 'As Guardiãs'. Elas sempre apontam para o Cruzeiro do Sul. Marinheiros experientes olhavam para o Centauro para validar se a cruz que estavam seguindo não era a 'Falsa Cruz' (localizada na constelação de Vela), o que poderia desviá-los por centenas de milhas.`,
  },
  {
    id: "5",
    name: "Carina",
    description: "A base do lendário Navio Argo.",
    imageUrl: require("../assets/images/Carina-1.png"),
    stars: ["Canopus", "Miaplacidus", "Avior", "Aspidiske"],
    history: `Antigamente, Carina era parte de uma constelação massiva chamada Argo Navis (O Navio de Jasão). No século XVIII, foi dividida em Quilha (Carina), Popa e Velas.

CANOPUS: A GUIA DOS DESERTOS E MARES:
Canopus é a segunda estrela mais brilhante do céu noturno. 

Diferente de Sirius, Canopus possui uma posição muito estável no sul. Beduínos no deserto e navegadores no oceano Índico a chamavam de "Estrela de Ouro". Devido ao seu brilho isolado e intenso, Canopus é usada até hoje por naves espaciais da NASA em seus sensores estelares para calibração de atitude no espaço profundo.`,
  },
  {
    id: "6",
    name: "Cão Maior",
    description: "O portador da luz mais forte do firmamento.",
    imageUrl: require("../assets/images/caomaior.jpg"),
    stars: ["Sirius", "Adhara", "Wezen", "Murzim"],
    history: `Canis Major é mundialmente famosa por conter Sirius, a "Estrela do Cão".

SIRIUS E A HISTÓRIA DA HUMANIDADE:
Sirius é tão brilhante que algumas culturas acreditavam que ela tinha seu próprio calor. No Egito antigo, seu surgimento no céu coincidia com as cheias do Nilo. 

NAVEGAÇÃO POLINÉSIA:

Enquanto os europeus olhavam para o Cruzeiro do Sul, os grandes navegadores da Polinésia usavam Sirius como sua 'Estrela de Zênite'. Eles navegavam em direção a Sirius até que ela estivesse exatamente acima de seus barcos (90 graus), o que significava que haviam atingido a latitude das ilhas Fiji ou do Taiti. Na Bahia, Sirius é um farol deslumbrante que domina o céu de verão.`,
  },
];
