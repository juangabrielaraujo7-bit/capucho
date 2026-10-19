import { asset } from "./config";

// Conteúdo da primeira versão do Sobre. Preencher quando os materiais finais chegarem.
export const aboutMedia = {
  introductionVideo: asset("capucho-apresentacao.mp4"), // apresentação com áudio, encerrada antes do banner final
  introductionPoster: asset("capucho-apresentacao-capa.webp"),
  henriqueVideo: asset("henrique-trabalhando.mp4"), // vertical 540x960, sem áudio, 45 s
  henriquePoster: asset("henrique-trabalhando-capa.webp"),
  branchesIllustration: null, // PNG/WebP transparente; composição horizontal.
  tiktok: "https://www.tiktok.com/@capucho_informatica", // perfil oficial
};

// Mesmos números já apresentados na home; atualização manual.
export const googleReputation = { rating: "5,0", count: 368 };
