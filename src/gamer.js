// Área gamer: catálogo do "Monte seu PC", configurações prontas e galeria de PCs montados.
//
// ATENÇÃO (pendente com o cliente): as peças e os preços abaixo são uma base inicial com valores
// ESTIMADOS de mercado, só para o montador funcionar. Trocar pelos itens e preços reais da Capucho.
// "stock: true" mostra o selo "Em estoque"; sem ele, a peça aparece como "Sob encomenda".

// PCs montados pela Capucho: vídeos verticais em public/assets (.mp4, 432x768, sem áudio) com capa
// .webp de mesmo nome. Para incluir outro, adicione { file, title } aqui.
export const gamerBuilds = [
  { file: "pc-capucho-1", title: "PC gamer com gabinete branco e RGB montado pela Capucho" },
  { file: "pc-capucho-2", title: "Setup gamer completo montado pela Capucho" },
  { file: "pc-capucho-3", title: "PC gamer com GeForce RTX e water cooler montado pela Capucho" },
  { file: "pc-capucho-4", title: "PC gamer com GeForce RTX 5070 e fans ARGB montado pela Capucho" },
  { file: "pc-capucho-5", title: "PC gamer com gabinete branco aquário montado pela Capucho" },
  { file: "pc-capucho-6", title: "PC gamer com GeForce RTX e iluminação rosa montado pela Capucho" },
  { file: "pc-capucho-7", title: "PC gamer com water cooler e iluminação azul e roxa montado pela Capucho" },
  { file: "pc-capucho-8", title: "PC gamer preto com GeForce RTX e water cooler montado pela Capucho" },
  { file: "pc-capucho-9", title: "PC gamer com gabinete branco e RGB colorido montado pela Capucho" },
  { file: "pc-capucho-10", title: "PCs gamer com GeForce RTX e iluminação RGB montados pela Capucho" },
  { file: "pc-capucho-11", title: "PC gamer com water cooler e fans ARGB montado pela Capucho" },
];

export const steps = [
  { id: "cpu", label: "Processador", short: "Processador" },
  { id: "board", label: "Placa-mãe", short: "Placa-mãe" },
  { id: "ram", label: "Memória RAM", short: "Memória" },
  { id: "gpu", label: "Placa de vídeo", short: "Placa de vídeo" },
  { id: "storage", label: "Armazenamento", short: "Armazenamento" },
  { id: "cooler", label: "Cooler", short: "Cooler" },
  { id: "psu", label: "Fonte", short: "Fonte" },
  { id: "case", label: "Gabinete", short: "Gabinete" },
];

export const parts = {
  cpu: [
    { id: "r5-5500", brand: "AMD", name: "AMD Ryzen 5 5500", specs: "6 núcleos, 12 threads, até 4,2 GHz, AM4", socket: "AM4", igpu: false, boxCooler: true, tdp: 65, price: 550 },
    { id: "r5-5600", brand: "AMD", name: "AMD Ryzen 5 5600", specs: "6 núcleos, 12 threads, até 4,4 GHz, AM4", socket: "AM4", igpu: false, boxCooler: true, tdp: 65, price: 750 },
    { id: "r5-5600g", brand: "AMD", name: "AMD Ryzen 5 5600G", specs: "6 núcleos, 12 threads, vídeo integrado, AM4", socket: "AM4", igpu: true, boxCooler: true, tdp: 65, price: 850 },
    { id: "r7-5700x", brand: "AMD", name: "AMD Ryzen 7 5700X", specs: "8 núcleos, 16 threads, até 4,6 GHz, AM4", socket: "AM4", igpu: false, boxCooler: false, tdp: 65, price: 1200 },
    { id: "r5-7600", brand: "AMD", name: "AMD Ryzen 5 7600", specs: "6 núcleos, 12 threads, até 5,1 GHz, AM5", socket: "AM5", igpu: true, boxCooler: true, tdp: 65, price: 1300 },
    { id: "r7-7800x3d", brand: "AMD", name: "AMD Ryzen 7 7800X3D", specs: "8 núcleos, 16 threads, 3D V-Cache, AM5", socket: "AM5", igpu: true, boxCooler: false, tdp: 120, price: 2000 },
    { id: "i5-12400f", brand: "Intel", name: "Intel Core i5-12400F", specs: "6 núcleos, 12 threads, até 4,4 GHz, LGA 1700", socket: "LGA1700", igpu: false, boxCooler: true, tdp: 65, price: 700 },
    { id: "i5-14400f", brand: "Intel", name: "Intel Core i5-14400F", specs: "10 núcleos, 16 threads, até 4,7 GHz, LGA 1700", socket: "LGA1700", igpu: false, boxCooler: true, tdp: 65, price: 1200 },
    { id: "i7-14700kf", brand: "Intel", name: "Intel Core i7-14700KF", specs: "20 núcleos, 28 threads, até 5,6 GHz, LGA 1700", socket: "LGA1700", igpu: false, boxCooler: false, tdp: 125, price: 2300 },
  ],
  board: [
    { id: "a520m", brand: "AMD", name: "Placa-mãe A520M", specs: "AM4, DDR4, Micro-ATX", socket: "AM4", memory: "DDR4", form: "mATX", price: 450 },
    { id: "b550m", brand: "AMD", name: "Placa-mãe B550M", specs: "AM4, DDR4, Micro-ATX, M.2 PCIe 4.0", socket: "AM4", memory: "DDR4", form: "mATX", price: 750 },
    { id: "b550", brand: "AMD", name: "Placa-mãe B550 ATX", specs: "AM4, DDR4, ATX, 2x M.2", socket: "AM4", memory: "DDR4", form: "ATX", price: 1000 },
    { id: "a620m", brand: "AMD", name: "Placa-mãe A620M", specs: "AM5, DDR5, Micro-ATX", socket: "AM5", memory: "DDR5", form: "mATX", price: 700 },
    { id: "b650m", brand: "AMD", name: "Placa-mãe B650M", specs: "AM5, DDR5, Micro-ATX, M.2 PCIe 4.0", socket: "AM5", memory: "DDR5", form: "mATX", price: 1100 },
    { id: "b650", brand: "AMD", name: "Placa-mãe B650 ATX", specs: "AM5, DDR5, ATX, 2x M.2, Wi-Fi", socket: "AM5", memory: "DDR5", form: "ATX", price: 1400 },
    { id: "h610m", brand: "Intel", name: "Placa-mãe H610M", specs: "LGA 1700, DDR4, Micro-ATX", socket: "LGA1700", memory: "DDR4", form: "mATX", price: 550 },
    { id: "b760m-d4", brand: "Intel", name: "Placa-mãe B760M DDR4", specs: "LGA 1700, DDR4, Micro-ATX, M.2 PCIe 4.0", socket: "LGA1700", memory: "DDR4", form: "mATX", price: 850 },
    { id: "b760m-d5", brand: "Intel", name: "Placa-mãe B760M DDR5", specs: "LGA 1700, DDR5, Micro-ATX, M.2 PCIe 4.0", socket: "LGA1700", memory: "DDR5", form: "mATX", price: 1000 },
    { id: "z790", brand: "Intel", name: "Placa-mãe Z790 ATX", specs: "LGA 1700, DDR5, ATX, 3x M.2, Wi-Fi", socket: "LGA1700", memory: "DDR5", form: "ATX", price: 1900 },
  ],
  ram: [
    { id: "16-d4", name: "Memória 16 GB DDR4", specs: "2x 8 GB, 3200 MHz, dual channel", memory: "DDR4", price: 400 },
    { id: "32-d4", name: "Memória 32 GB DDR4", specs: "2x 16 GB, 3200 MHz, dual channel", memory: "DDR4", price: 750 },
    { id: "16-d5", name: "Memória 16 GB DDR5", specs: "2x 8 GB, 5600 MHz, dual channel", memory: "DDR5", price: 550 },
    { id: "32-d5", name: "Memória 32 GB DDR5", specs: "2x 16 GB, 6000 MHz, dual channel", memory: "DDR5", price: 1000 },
  ],
  gpu: [
    { id: "rtx3050", brand: "NVIDIA", name: "GeForce RTX 3050 6 GB", specs: "Jogos leves e e-sports em Full HD", psu: 450, price: 1300 },
    { id: "rtx5060", brand: "NVIDIA", name: "GeForce RTX 5060 8 GB", specs: "Full HD no alto, DLSS 4", psu: 550, price: 2200 },
    { id: "rx9060xt", brand: "AMD", name: "Radeon RX 9060 XT 16 GB", specs: "Full HD e 1440p, 16 GB de memória", psu: 550, price: 2700 },
    { id: "rtx5060ti", brand: "NVIDIA", name: "GeForce RTX 5060 Ti 16 GB", specs: "1440p, DLSS 4, 16 GB de memória", psu: 600, price: 3200 },
    { id: "rtx5070", brand: "NVIDIA", name: "GeForce RTX 5070 12 GB", specs: "1440p no ultra, DLSS 4", psu: 650, price: 4000 },
    { id: "rx9070", brand: "AMD", name: "Radeon RX 9070 16 GB", specs: "1440p no ultra, 16 GB de memória", psu: 650, price: 4300 },
    { id: "rtx5070ti", brand: "NVIDIA", name: "GeForce RTX 5070 Ti 16 GB", specs: "1440p e 4K, DLSS 4", psu: 750, price: 6000 },
  ],
  storage: [
    { id: "sata-480", name: "SSD SATA 480 GB", specs: "Até 550 MB/s", price: 220 },
    { id: "nvme-500", name: "SSD NVMe M.2 500 GB", specs: "PCIe, até 3.500 MB/s", price: 280 },
    { id: "nvme-1tb", name: "SSD NVMe M.2 1 TB", specs: "PCIe 4.0, até 5.000 MB/s", price: 450 },
    { id: "nvme-2tb", name: "SSD NVMe M.2 2 TB", specs: "PCIe 4.0, até 7.000 MB/s", price: 850 },
    { id: "hd-1tb", name: "HD 1 TB", specs: "7200 RPM, para guardar arquivos", price: 300 },
  ],
  cooler: [
    { id: "air-single", name: "Cooler de torre simples", specs: "1 ventoinha 120 mm, AM4, AM5 e LGA 1700", maxTdp: 150, price: 130 },
    { id: "air-dual", name: "Cooler de torre dupla", specs: "2 ventoinhas 120 mm, AM4, AM5 e LGA 1700", maxTdp: 220, price: 300 },
    { id: "wc-240", name: "Water cooler 240 mm", specs: "2 ventoinhas ARGB, AM4, AM5 e LGA 1700", maxTdp: 250, radiator: 240, price: 450 },
    { id: "wc-360", name: "Water cooler 360 mm", specs: "3 ventoinhas ARGB, AM4, AM5 e LGA 1700", maxTdp: 300, radiator: 360, price: 650 },
  ],
  psu: [
    { id: "550b", name: "Fonte 550 W 80 Plus Bronze", specs: "PFC ativo", watts: 550, price: 330 },
    { id: "650b", name: "Fonte 650 W 80 Plus Bronze", specs: "PFC ativo", watts: 650, price: 420 },
    { id: "750g", name: "Fonte 750 W 80 Plus Gold", specs: "Modular, PFC ativo", watts: 750, price: 650 },
    { id: "850g", name: "Fonte 850 W 80 Plus Gold", specs: "Modular, ATX 3.1", watts: 850, price: 850 },
  ],
  case: [
    { id: "matx-glass", name: "Gabinete Micro-ATX com vidro lateral", specs: "Compacto, 1 ventoinha inclusa", forms: ["mATX"], radiator: 240, price: 250 },
    { id: "atx-argb", name: "Gabinete ATX mid tower ARGB", specs: "Vidro lateral, 3 ventoinhas ARGB", forms: ["ATX", "mATX"], radiator: 240, price: 400 },
    { id: "atx-aquario", name: "Gabinete ATX aquário", specs: "Vidro frontal e lateral, sem colunas", forms: ["ATX", "mATX"], radiator: 360, price: 550 },
    { id: "atx-airflow", name: "Gabinete ATX airflow premium", specs: "Frente em malha, 4 ventoinhas, radiador 360 mm", forms: ["ATX", "mATX"], radiator: 360, price: 800 },
  ],
};

// Configurações prontas: carregam no montador e podem ser alteradas peça por peça.
export const presets = [
  {
    id: "entrada",
    name: "Entrada",
    tagline: "Full HD em e-sports e jogos populares",
    picks: { cpu: "r5-5500", board: "b550m", ram: "16-d4", gpu: "rtx5060", storage: "nvme-1tb", cooler: "box", psu: "550b", case: "matx-glass" },
  },
  {
    id: "intermediario",
    name: "Intermediário",
    tagline: "1440p com qualidade alta",
    picks: { cpu: "r5-7600", board: "b650m", ram: "32-d5", gpu: "rtx5060ti", storage: "nvme-1tb", cooler: "air-dual", psu: "650b", case: "atx-argb" },
  },
  {
    id: "avancado",
    name: "Avançado",
    tagline: "1440p no ultra e 4K",
    picks: { cpu: "r7-7800x3d", board: "b650", ram: "32-d5", gpu: "rtx5070ti", storage: "nvme-2tb", cooler: "wc-360", psu: "850g", case: "atx-airflow" },
  },
];

// Escolhas especiais, válidas em qualquer etapa.
export const HELP = "indicar"; // a Capucho indica a peça
export const OWN = "tenho"; // o cliente já tem a peça
export const BOX = "box"; // cooler que vem com o processador
export const NONE = "sem"; // sem placa de vídeo (processador com vídeo integrado)

export const find = (step, id) => parts[step].find((p) => p.id === id);

// Potência mínima da fonte para a combinação escolhida.
export function minWatts(pick) {
  const cpu = find("cpu", pick.cpu);
  const gpu = find("gpu", pick.gpu);
  const base = gpu?.psu ?? 450;
  return base + (cpu && cpu.tdp > 100 ? 100 : 0);
}

export const FORM_LABEL = { mITX: "Mini-ITX", mATX: "Micro-ATX", ATX: "ATX", EATX: "E-ATX" };

// Diz se a peça combina com as já escolhidas; devolve o motivo quando não combina.
// Só bloqueia com dado conhecido dos dois lados: o que falta aparece em unverified().
export function incompatibility(step, part, pick) {
  const cpu = find("cpu", pick.cpu);
  const board = find("board", pick.board);
  const gpu = find("gpu", pick.gpu);
  const cooler = find("cooler", pick.cooler);
  const psu = find("psu", pick.psu);
  const pcCase = find("case", pick.case);
  if (step === "board" && cpu && part.socket !== cpu.socket)
    return `Soquete ${part.socket}, o processador usa ${cpu.socket}`;
  if (step === "ram" && board && part.memory !== board.memory)
    return `A placa-mãe usa ${board.memory}`;
  if (step === "ram" && board?.memSlots != null && part.modules > board.memSlots)
    return `A placa-mãe tem ${board.memSlots} slots de memória`;
  if (step === "ram" && board?.memMax != null && part.gb > board.memMax)
    return `A placa-mãe aceita até ${board.memMax} GB`;
  if (step === "storage" && board && part.iface && part.iface !== "sata" && board.m2Slots === 0)
    return "A placa-mãe não tem slot M.2";
  if (step === "storage" && board && part.iface === "sata" && board.sataPorts === 0)
    return "A placa-mãe não tem porta SATA";
  if (step === "gpu" && pcCase?.maxGpu != null && part.length != null && part.length > pcCase.maxGpu)
    return `O gabinete aceita placa de vídeo de até ${pcCase.maxGpu} mm`;
  if (step === "cooler" && cpu && part.maxTdp < cpu.tdp)
    return "Não dá conta do calor desse processador";
  if (step === "cooler" && cpu && part.sockets && !part.sockets.includes(cpu.socket))
    return `Não encaixa no soquete ${cpu.socket}`;
  if (step === "cooler" && part.radiator && pcCase && part.radiator > pcCase.radiator)
    return `O gabinete aceita radiador de até ${pcCase.radiator} mm`;
  if (step === "cooler" && !part.radiator && pcCase?.maxCooler != null && part.height != null && part.height > pcCase.maxCooler)
    return `O gabinete aceita cooler de até ${pcCase.maxCooler} mm de altura`;
  if (step === "psu" && part.watts < minWatts(pick))
    return `Recomendado a partir de ${minWatts(pick)} W`;
  if (step === "psu" && gpu?.pcie8 != null && part.pcie8 != null && part.pcie8 < gpu.pcie8)
    return `A placa de vídeo usa ${gpu.pcie8} conectores PCIe`;
  if (step === "psu" && pcCase?.psuForms && part.psuForm && !pcCase.psuForms.includes(part.psuForm))
    return `O gabinete aceita fonte ${pcCase.psuForms.join(", ")}`;
  if (step === "case" && board && !part.forms.includes(board.form))
    return `Não comporta placa ${FORM_LABEL[board.form] ?? board.form}`;
  if (step === "case" && cooler?.radiator && cooler.radiator > part.radiator)
    return `Aceita radiador de até ${part.radiator} mm`;
  if (step === "case" && gpu?.length != null && part.maxGpu != null && gpu.length > part.maxGpu)
    return `Aceita placa de vídeo de até ${part.maxGpu} mm`;
  if (step === "case" && cooler && !cooler.radiator && cooler.height != null && part.maxCooler != null && cooler.height > part.maxCooler)
    return `Aceita cooler de até ${part.maxCooler} mm de altura`;
  if (step === "case" && psu?.psuForm && part.psuForms && !part.psuForms.includes(psu.psuForm))
    return `Aceita fonte ${part.psuForms.join(", ")}`;
  return null;
}

// Conferências que o montador não consegue fazer porque falta informação nas peças escolhidas.
// Aparecem na revisão: a Capucho confirma esses pontos na montagem, e a compatibilidade nunca é
// apresentada como completa quando há dado ausente.
export function unverified(pick) {
  const cpu = find("cpu", pick.cpu);
  const board = find("board", pick.board);
  const ram = find("ram", pick.ram);
  const gpu = find("gpu", pick.gpu);
  const storage = find("storage", pick.storage);
  const cooler = find("cooler", pick.cooler);
  const psu = find("psu", pick.psu);
  const pcCase = find("case", pick.case);
  // Só peças importadas do fornecedor (campo "imported") entram aqui: a lista fixa antiga tem outro nível de detalhe.
  const any = (...list) => list.some((p) => p?.imported);
  const notes = [];
  if (cpu && board && any(cpu, board)) {
    if (cpu.chipsets && board.chipset && !cpu.chipsets.includes(board.chipset))
      notes.push(`O chipset ${board.chipset} não consta na lista de placas do fabricante do processador.`);
    else notes.push("Suporte do processador e versão de BIOS da placa-mãe: a Capucho confirma antes de montar.");
  }
  if (board && ram && any(board, ram) && (board.memSlots == null || board.memMax == null))
    notes.push("Slots e capacidade máxima de memória da placa-mãe não informados.");
  if (board && storage && any(board, storage) && storage.iface && storage.iface !== "sata" && board.m2Slots == null)
    notes.push("Quantidade de slots M.2 da placa-mãe não informada.");
  if (gpu && pcCase && any(gpu, pcCase) && (gpu.length == null || pcCase.maxGpu == null))
    notes.push("Espaço para a placa de vídeo no gabinete: comprimento não informado.");
  if (cooler && pcCase && any(cooler, pcCase)) {
    if (cooler.radiator && pcCase.radiator == null) notes.push("Suporte do gabinete ao radiador não informado.");
    if (!cooler.radiator && (cooler.height == null || pcCase.maxCooler == null))
      notes.push("Altura do cooler ou espaço do gabinete não informado.");
  }
  if (cooler && cpu && any(cooler) && cooler.maxTdp == null) notes.push("Capacidade de refrigeração do cooler não informada.");
  if (psu && gpu && any(psu, gpu) && (psu.pcie8 == null || gpu.pcie8 == null))
    notes.push("Conectores de energia da fonte e da placa de vídeo não informados.");
  if (gpu?.p16 && psu && !psu.p16) notes.push("A placa de vídeo usa conector de 16 pinos: confira o cabo ou adaptador.");
  return notes;
}

// Etapas que podem ficar sem peça do catálogo.
export function skipOption(step, pick) {
  const cpu = find("cpu", pick.cpu);
  if (step === "gpu" && cpu?.igpu) return { id: NONE, label: "Sem placa de vídeo", note: "Usar o vídeo integrado do processador" };
  if (step === "cooler" && cpu?.boxCooler) return { id: BOX, label: "Cooler do processador", note: "O processador já vem com cooler na caixa" };
  return null;
}

export function describe(step, id) {
  if (!id) return null;
  if (id === HELP) return "Quero indicação da Capucho";
  if (id === OWN) return "Já tenho essa peça";
  if (id === NONE) return "Sem placa de vídeo (vídeo integrado)";
  if (id === BOX) return "Cooler que vem com o processador";
  return find(step, id)?.name ?? null;
}

export const brl = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
