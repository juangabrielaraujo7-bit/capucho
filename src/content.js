// Serviços com página própria (/servicos/<slug>). Cada página segue a lógica:
// sinais percebidos → verificações e soluções → informação importante (opcional) → dúvidas.
// Textos curtos e específicos; condições comerciais só as confirmadas no briefing.
// Imagens recortadas com transparência são compartilhadas pelos cards e páginas de serviço.
export const services = [
  {
    slug: "diagnostico-e-solucao-de-problemas",
    seoTitle: "Diagnóstico de PC e notebook na Freguesia do Ó | Capucho",
    seoDescription:
      "Computador que não liga, reinicia, trava ou fica sem imagem? Diagnóstico para encontrar a causa antes do reparo, na Freguesia do Ó, em São Paulo.",
    title: "Diagnóstico e solução de problemas",
    short: "Diagnóstico",
    image: "conserto-foto.webp",
    alt: "Notebook aberto com multímetro e chave de precisão",
    description:
      "Não liga, reinicia, trava ou perde imagem? A causa é investigada antes de qualquer reparo.",
    intro:
      "O mesmo sintoma pode ter causas bem diferentes. O diagnóstico identifica onde está a falha antes de trocar qualquer peça.",
    message:
      "Olá, Capucho! Meu computador está com um problema e preciso de um diagnóstico.",
    signsTitle: "Problemas que investigamos",
    signs: [
      [
        "Não liga",
        "Sem luz, sem ventoinha ou sem resposta ao botão. Pode ser fonte, carregador, bateria, placa ou outro componente.",
      ],
      [
        "Liga, mas não dá imagem",
        "A ventoinha gira e a tela fica preta. A falha pode estar na memória, no vídeo, na tela ou na placa.",
      ],
      [
        "Reinicia ou desliga sozinho",
        "Pode envolver temperatura, alimentação de energia ou erro de sistema.",
      ],
      [
        "Trava durante o uso",
        "Travamentos podem vir de software, memória, armazenamento ou aquecimento.",
      ],
      [
        "Tela azul e mensagens de erro",
        "O código do erro ajuda a direcionar os testes. Fotografe a mensagem quando ela aparecer.",
      ],
    ],
    checksTitle: "Como as causas são separadas",
    checks: [
      [
        "Software",
        "Erros de sistema e de drivers são descartados antes de suspeitar das peças.",
      ],
      [
        "Alimentação",
        "Carregador, fonte, bateria e entrada de energia entram nos testes quando o equipamento não liga ou desliga.",
      ],
      [
        "Memória e armazenamento",
        "Testes mostram se a memória RAM ou o disco estão por trás de travamentos e erros.",
      ],
      [
        "Temperatura",
        "O aquecimento é observado durante o uso para confirmar ou descartar uma falha térmica.",
      ],
      [
        "Placa e demais componentes",
        "Descartadas as causas anteriores, a investigação segue para a placa e os outros componentes.",
      ],
    ],
    note: "O diagnóstico e o orçamento são apresentados antes de qualquer reparo. Se houver cobrança pela avaliação, o valor é informado no primeiro contato.",
    faqTitle: "Dúvidas sobre diagnóstico",
    local:
      "Diagnóstico de notebooks e PCs na Vila Palmeiras, Freguesia do Ó.",
    faq: [
      [
        "Meu computador não liga. Tem conserto?",
        "Muitas vezes tem, mas só os testes mostram a causa. Depois deles, você recebe a explicação e o orçamento antes de aprovar.",
      ],
      [
        "Dá para resolver sem levar o computador?",
        "Erros de sistema e de programas podem ser atendidos pelo suporte remoto. Falhas em peças precisam de avaliação presencial.",
      ],
      [
        "O que devo informar no primeiro contato?",
        "Marca e modelo, o que acontece e quando começou. Se aparecer uma mensagem de erro, envie uma foto dela.",
      ],
    ],
    related: ["reparo-de-placa", "troca-de-hardware", "suporte-e-atendimento"],
  },
  {
    slug: "troca-de-tela-de-notebook",
    seoTitle: "Troca de tela de notebook na Freguesia do Ó | Capucho",
    seoDescription:
      "Tela de notebook trincada, com manchas, linhas, piscando ou sem imagem. Identificamos a causa e indicamos o painel compatível com o seu modelo.",
    title: "Troca de tela de notebook",
    short: "Troca de tela",
    image: "troca-de-tela-foto.webp",
    alt: "Notebook com painel de tela e moldura separados para substituição",
    description:
      "Trincas, manchas, linhas ou tela sem imagem, com peça compatível com o seu modelo.",
    intro:
      "Trincas, manchas e linhas na imagem costumam exigir a troca do painel. Antes, confirmamos se a falha está mesmo na tela.",
    message:
      "Olá, Capucho! Quero um orçamento para troca de tela de notebook. Marca e modelo: ",
    signsTitle: "Sinais na tela",
    signs: [
      [
        "Tela trincada",
        "A trinca costuma se espalhar e pode gerar manchas ou áreas sem imagem.",
      ],
      [
        "Manchas na imagem",
        "Manchas escuras ou coloridas geralmente vêm de dano no painel.",
      ],
      [
        "Linhas na tela",
        "Linhas fixas apontam para o painel. Linhas que mudam ao mexer na tampa podem indicar o cabo de vídeo.",
      ],
      [
        "Imagem piscando",
        "A cintilação pode vir do painel, do cabo, da iluminação da tela ou do driver de vídeo.",
      ],
      [
        "Tela sem imagem",
        "A falha pode estar no painel, no cabo ou em outro componente. É preciso identificar a origem antes de indicar a troca.",
      ],
    ],
    checksTitle: "Antes de trocar o painel",
    checks: [
      [
        "Teste com monitor externo",
        "Se a imagem aparece em um monitor externo, o vídeo do notebook funciona e a suspeita recai sobre a tela ou o cabo.",
      ],
      [
        "Cabo e conexão",
        "Um cabo de vídeo danificado ou mal encaixado causa sintomas parecidos com os de uma tela quebrada.",
      ],
      [
        "Peça compatível",
        "Tamanho, resolução, conector e fixação variam entre modelos. O painel novo precisa ser compatível com o seu notebook.",
      ],
    ],
    note: "Envie a marca e o modelo do notebook pelo WhatsApp. Eles costumam estar na etiqueta embaixo do aparelho e agilizam a consulta da peça.",
    faqTitle: "Dúvidas sobre troca de tela",
    local: "Troca de tela de notebook na Freguesia do Ó, em São Paulo.",
    faq: [
      [
        "Dá para trocar só o vidro?",
        "Na maioria dos notebooks, não. O vidro e a parte que forma a imagem são uma peça só, por isso a troca é do painel.",
      ],
      [
        "Perco meus arquivos trocando a tela?",
        "Não. A troca da tela não mexe no armazenamento do notebook.",
      ],
      [
        "Quanto tempo demora?",
        "Depende da disponibilidade da peça para o modelo. O prazo é informado junto com o orçamento.",
      ],
    ],
    related: ["diagnostico-e-solucao-de-problemas", "troca-de-hardware", "reparo-de-placa"],
  },
  {
    slug: "troca-de-hardware",
    seoTitle: "Troca de peças de PC e notebook na Freguesia do Ó | Capucho",
    seoDescription:
      "Substituição de teclado, bateria, fonte, disco, ventoinha e placa-mãe com defeito. O defeito é confirmado antes da troca. Fale com a Capucho pelo WhatsApp.",
    title: "Troca de hardware",
    short: "Troca de hardware",
    image: "troca-de-hardware-foto.webp",
    alt: "Notebook aberto com bateria removida e ventoinha de reposição",
    description:
      "Substituição de peças com defeito, depois de confirmar qual componente falhou.",
    intro:
      "Quando um componente falha, ele pode ser substituído por outro compatível. Primeiro confirmamos qual peça está com defeito.",
    message:
      "Olá, Capucho! Preciso trocar uma peça do meu computador ou notebook.",
    signsTitle: "Peças que costumam precisar de troca",
    signs: [
      [
        "Teclado falhando",
        "Teclas que não respondem ou digitam sozinhas. Em notebooks, a troca depende da peça para o modelo.",
      ],
      [
        "Bateria que não segura carga",
        "Descarrega rápido, não carrega ou está estufada. Bateria estufada não deve continuar em uso.",
      ],
      [
        "Fonte com defeito",
        "No computador de mesa, a fonte com falha pode impedir que ele ligue ou causar desligamentos.",
      ],
      [
        "HD ou SSD com falha",
        "Erros de leitura, travamentos e ruídos no disco. Com o disco novo, o sistema precisa ser reinstalado.",
      ],
      [
        "Ventoinha com ruído ou parada",
        "Ventoinha barulhenta, presa ou parada compromete a refrigeração do equipamento.",
      ],
      [
        "Placa-mãe danificada",
        "Quando o reparo não é viável, a placa pode ser substituída por uma compatível.",
      ],
    ],
    checksTitle: "Troca por defeito",
    checks: [
      [
        "Confirmação do defeito",
        "Testes indicam se o problema está mesmo na peça. Um sintoma como não ligar pode ter outras causas.",
      ],
      [
        "Peça compatível",
        "A peça nova precisa ser compatível com o modelo e com a configuração do equipamento.",
      ],
      [
        "Defeito ou desempenho",
        "Trocar uma peça para ganhar velocidade, e não para corrigir uma falha, é upgrade. Veja o upgrade de SSD e memória.",
      ],
    ],
    faqTitle: "Dúvidas sobre troca de peças",
    local: "Troca de peças de notebooks e PCs na Freguesia do Ó.",
    faq: [
      [
        "Vale trocar a peça ou o computador?",
        "Depende do defeito, da idade do equipamento e do custo da peça. Se a troca não compensar, você fica sabendo antes de aprovar.",
      ],
      [
        "Vocês têm a peça para o meu modelo?",
        "A disponibilidade varia. Envie a marca e o modelo pelo WhatsApp para consultarmos a peça, o valor e o prazo.",
      ],
      [
        "A bateria estufou. É perigoso?",
        "Pode ser. A bateria estufada pode deformar a carcaça e danificar outros componentes. Tire o equipamento da tomada e evite usá-lo até a avaliação.",
      ],
    ],
    related: ["diagnostico-e-solucao-de-problemas", "upgrade-de-ssd-e-memoria", "reparo-de-placa"],
  },
  {
    slug: "reparo-de-placa",
    seoTitle: "Reparo de placa de notebook e PC na Freguesia do Ó | Capucho",
    seoDescription:
      "Placa com defeito nem sempre precisa ser trocada inteira. Avaliação da viabilidade do reparo ou da substituição, na Freguesia do Ó, em São Paulo.",
    title: "Reparo de placa",
    short: "Reparo de placa",
    image: "reparo-de-placa-foto.webp",
    alt: "Placa-mãe com ferro de solda e pinça de precisão para reparo eletrônico",
    description:
      "Avaliação da placa para saber se o defeito tem reparo antes de substituí-la.",
    intro:
      "Quando a falha está na placa, nem sempre é preciso trocá-la inteira. A viabilidade do reparo depende do defeito e do estado da placa.",
    message:
      "Olá, Capucho! Quero uma avaliação para reparo de placa do meu computador ou notebook.",
    signsTitle: "Quando a placa pode ser a causa",
    signs: [
      [
        "Não liga depois de queda de energia",
        "Picos e oscilações de energia podem danificar componentes da placa ou da fonte.",
      ],
      [
        "Contato com líquido",
        "O líquido pode causar curto-circuito e oxidação. Desligue o equipamento e não tente ligá-lo de novo até a avaliação.",
      ],
      [
        "Não carrega",
        "Se o carregador e a bateria estão bons, a falha pode estar no circuito de carga da placa.",
      ],
      [
        "Portas sem funcionar",
        "USB, vídeo ou áudio que pararam de funcionar podem indicar defeito no conector ou no circuito ligado a ele.",
      ],
    ],
    checksTitle: "Reparo ou substituição",
    checks: [
      [
        "Reparo eletrônico",
        "Corrige o componente ou o trecho do circuito com defeito e mantém a placa original.",
      ],
      [
        "Substituição da placa",
        "Troca a placa inteira por uma compatível. Indicada quando o dano é extenso ou o reparo não compensa.",
      ],
      [
        "Viabilidade",
        "Oxidação avançada ou danos em vários pontos podem inviabilizar o reparo. Isso é informado antes da aprovação.",
      ],
    ],
    faqTitle: "Dúvidas sobre reparo de placa",
    local: "Reparo de placa de notebooks e PCs na Freguesia do Ó.",
    faq: [
      [
        "É melhor reparar ou trocar a placa?",
        "Depende do defeito, do custo e da disponibilidade de uma placa compatível. As opções aparecem no orçamento.",
      ],
      [
        "Meu notebook molhou. O que eu faço?",
        "Desligue, tire da tomada e não tente ligar para testar. Quanto antes a avaliação, maiores as chances de reparo.",
      ],
      [
        "Meus arquivos ficam salvos?",
        "O reparo da placa não mexe no armazenamento, mas o defeito pode ter afetado o disco. Avise se há arquivos importantes.",
      ],
    ],
    related: ["diagnostico-e-solucao-de-problemas", "troca-de-hardware", "troca-de-tela-de-notebook"],
  },
  {
    slug: "resinagem",
    seoTitle: "Resinagem de notebook na Freguesia do Ó | Capucho",
    seoDescription:
      "Reforço estrutural para carcaça rachada, quebrada ou pontos de fixação danificados em notebooks, como parafusos e dobradiças. Avaliação antes do reparo.",
    title: "Resinagem",
    short: "Resinagem",
    image: "resinagem-foto.webp",
    alt: "Carcaça de notebook com dobradiça e reforço de resina nos pontos de fixação",
    description:
      "Reforço estrutural para carcaça rachada ou pontos de fixação danificados, como parafusos e dobradiças.",
    intro:
      "Rachaduras na carcaça e pontos de fixação danificados comprometem a estrutura do notebook. A resinagem reforça essas áreas depois de avaliar o dano.",
    message:
      "Olá, Capucho! Quero um orçamento para resinagem do meu notebook.",
    signsTitle: "Sinais de dano estrutural",
    signs: [
      [
        "Carcaça rachada",
        "Trincas na base ou na tampa, principalmente perto dos parafusos e das dobradiças.",
      ],
      [
        "Dobradiça com folga ou solta",
        "A tela balança ou o suporte da dobradiça está rachado ou quebrado.",
      ],
      [
        "Parafuso que não segura mais",
        "O encaixe plástico ao redor do parafuso quebrou, e ele gira sem fixar.",
      ],
      [
        "Peças se soltando ao abrir e fechar",
        "Partes da carcaça se movem ou rangem ao manusear o notebook.",
      ],
      [
        "Quebra perto de dobradiças ou encaixes",
        "São pontos que recebem mais força no dia a dia e costumam rachar primeiro.",
      ],
    ],
    checksTitle: "Avaliação e reforço",
    checks: [
      [
        "Avaliação do dano",
        "O tamanho e o local da rachadura ou quebra definem se a resinagem resolve o problema.",
      ],
      [
        "Reforço estrutural",
        "A resina reconstrói e reforça o ponto danificado, devolvendo fixação à área quebrada.",
      ],
      [
        "Resinagem ou troca de peça",
        "Em danos muito extensos na carcaça, a troca da peça pode ser indicada no lugar do reforço.",
      ],
    ],
    faqTitle: "Dúvidas sobre resinagem",
    local: "Resinagem de notebooks na Freguesia do Ó, em São Paulo.",
    faq: [
      [
        "O que é resinagem?",
        "É o reforço estrutural de carcaça rachada, quebrada ou de pontos de fixação danificados, como onde ficam parafusos e dobradiças.",
      ],
      [
        "A resinagem serve para qualquer rachadura ou quebra?",
        "Depende do tamanho e do local do dano. A avaliação mostra se a resinagem resolve ou se é necessária a troca da peça.",
      ],
      [
        "A dobradiça da minha tela está solta. É resinagem?",
        "Pode ser, quando a folga vem de um ponto de fixação rachado ou quebrado na carcaça. A causa é confirmada na avaliação.",
      ],
    ],
    related: ["troca-de-tela-de-notebook", "troca-de-hardware", "diagnostico-e-solucao-de-problemas"],
  },
  {
    slug: "upgrade-de-ssd-e-memoria",
    seoTitle: "Upgrade de SSD e memória RAM na Freguesia do Ó | Capucho",
    seoDescription:
      "SSD para iniciar e abrir programas mais rápido, memória RAM para usar mais aplicativos ao mesmo tempo. Avaliação de compatibilidade antes do upgrade.",
    title: "Upgrade de SSD e memória RAM",
    short: "Upgrade de SSD e RAM",
    image: "upgrade-foto.webp",
    alt: "Computador aberto com pentes de memória RAM e SSD",
    description:
      "SSD e memória RAM resolvem limitações diferentes. Indicamos o que faz sentido para o seu uso.",
    intro:
      "SSD e memória RAM resolvem limitações diferentes. Avaliamos o seu uso e o que o equipamento aceita antes de indicar a peça.",
    message:
      "Olá, Capucho! Quero um orçamento de upgrade de SSD ou memória RAM. Meu computador é: ",
    signsTitle: "Sinais de que o equipamento está no limite",
    signs: [
      [
        "Demora para iniciar",
        "Em equipamentos com HD, um SSD compatível pode reduzir o tempo de inicialização e de abertura de programas. A indicação depende da causa da lentidão.",
      ],
      [
        "Disco sempre em 100%",
        "No Gerenciador de Tarefas, o disco no máximo durante o uso comum costuma indicar HD lento ou desgastado.",
      ],
      [
        "Trava com vários programas abertos",
        "Falta de memória RAM pode limitar o uso simultâneo de aplicativos. A possibilidade de expansão depende do modelo e da configuração.",
      ],
      [
        "Pouco espaço livre",
        "Disco cheio atrapalha atualizações e o uso diário. Um SSD maior ou um segundo disco pode resolver, se houver espaço no equipamento.",
      ],
    ],
    checksTitle: "Armazenamento e memória são coisas diferentes",
    checks: [
      [
        "SSD: armazenamento",
        "Guarda o sistema, os programas e os arquivos. Lê e grava dados muito mais rápido que um HD.",
      ],
      [
        "RAM: memória de trabalho",
        "Mantém abertos os programas em uso. Mais memória permite usar mais aplicativos ao mesmo tempo, mas não acelera um disco lento.",
      ],
      [
        "Compatibilidade",
        "O tipo de memória, os slots livres e a conexão do SSD (SATA ou M.2) variam por modelo. Alguns notebooks têm memória soldada na placa.",
      ],
    ],
    note: "Já comprou a peça? Você pode trazê-la. Antes da instalação, verificamos a compatibilidade e as condições do componente.",
    faqTitle: "Dúvidas sobre upgrade",
    local: "Upgrade de SSD e memória em notebooks e PCs na Freguesia do Ó.",
    faq: [
      [
        "O upgrade aumenta o FPS nos jogos?",
        "Nem sempre. Nos jogos, o desempenho depende mais da placa de vídeo e do processador. SSD e RAM ajudam no carregamento e quando a memória está no limite.",
      ],
      [
        "Meu notebook aceita upgrade?",
        "Depende do modelo. Envie a marca e o modelo pelo WhatsApp para verificarmos os slots, o tipo de memória e a conexão do SSD.",
      ],
      [
        "Quanta memória RAM eu preciso?",
        "Depende dos programas que você usa. Navegação e escritório pedem menos que edição de vídeo ou jogos. Conte o seu uso que indicamos a capacidade.",
      ],
      [
        "Meus arquivos passam para o SSD novo?",
        "Isso é combinado antes do serviço. A cópia depende do estado do disco antigo.",
      ],
    ],
    related: ["formatacao-e-backup", "troca-de-hardware", "manutencao-preventiva"],
  },
  {
    slug: "formatacao-e-backup",
    seoTitle: "Formatação e backup de PC e notebook | Capucho Informática",
    seoDescription:
      "Reinstalação de Windows, macOS e Linux quando o problema é de sistema, com backup combinado antes. Formatação na Freguesia do Ó, em São Paulo.",
    title: "Formatação e backup",
    short: "Formatação e backup",
    image: "formatacao-foto.webp",
    alt: "Notebook instalando o sistema, com pendrive e HD externo conectados",
    description:
      "Reinstalação do sistema quando a falha é de software, com backup combinado antes.",
    intro:
      "Reinstalação do Windows, macOS ou Linux para computadores com falhas de sistema. Antes de apagar o disco, combinamos o que precisa ser copiado.",
    message:
      "Olá, Capucho! Quero um orçamento para formatação. Tenho arquivos importantes para salvar.",
    signsTitle: "Quando a formatação pode ser indicada",
    signs: [
      [
        "Erros ao iniciar o sistema",
        "Reparo automático, reinícios em sequência ou mensagens de arquivo corrompido podem indicar falha no sistema operacional.",
      ],
      [
        "Lentidão que piora com o tempo",
        "Programas na inicialização e restos de instalações antigas pesam no uso. Antes, vale descartar disco com defeito ou falta de memória.",
      ],
      [
        "Vírus e anúncios aparecendo sozinhos",
        "Janelas que abrem sozinhas, navegador alterado e programas que você não instalou são sinais de infecção.",
      ],
      [
        "Disco novo",
        "Um SSD ou HD novo precisa receber o sistema e os programas antes do uso.",
      ],
      [
        "Venda ou repasse do computador",
        "Apagar os dados pessoais antes de entregar o equipamento a outra pessoa.",
      ],
    ],
    checksTitle: "Software ou defeito físico?",
    checks: [
      [
        "Estado do disco",
        "Um HD ou SSD com falha pode corromper o sistema de novo depois da formatação. Se o disco estiver com defeito, a troca vem antes.",
      ],
      [
        "Remoção de vírus",
        "Em alguns casos, a limpeza do sistema resolve sem apagar o disco. Depende do tipo de infecção.",
      ],
      [
        "Reinstalação completa",
        "Sistema instalado do zero, com os drivers do equipamento. Os programas que você usa são instalados em seguida.",
      ],
    ],
    note: "A formatação apaga o conteúdo do disco. Avise no primeiro contato quais arquivos são importantes: o backup é combinado antes e depende do acesso e do estado do armazenamento.",
    faqTitle: "Dúvidas sobre formatação",
    local:
      "Formatação de notebooks e PCs na Freguesia do Ó. Problemas só de sistema também podem ser atendidos pelo suporte remoto, conforme o caso.",
    faq: [
      [
        "Formatar resolve a lentidão?",
        "Só quando a causa está no sistema. Se o HD estiver no limite ou faltar memória, a lentidão volta, e um upgrade pode fazer mais diferença.",
      ],
      [
        "Meus programas continuam instalados?",
        "Não. A formatação remove os programas junto com o sistema. Eles precisam ser reinstalados, e os pagos exigem a licença ou o acesso à sua conta.",
      ],
      [
        "Dá para salvar arquivos de um disco com defeito?",
        "Depende do estado do disco. Se ele não permitir a leitura, a cópia pode não ser possível. A avaliação mostra o que dá para fazer.",
      ],
      [
        "Quais sistemas vocês instalam?",
        "Windows, macOS e Linux, conforme a compatibilidade do equipamento.",
      ],
    ],
    related: ["instalacao-de-softwares", "upgrade-de-ssd-e-memoria", "suporte-e-atendimento"],
  },
  {
    slug: "instalacao-de-softwares",
    seoTitle: "Instalação de programas e drivers | Capucho Informática",
    seoDescription:
      "Instalação e configuração de programas e drivers, com checagem de requisitos e compatibilidade. Na loja, na Freguesia do Ó, ou pelo suporte remoto.",
    title: "Instalação de softwares",
    short: "Instalação de softwares",
    image: "instalacao-de-softwares-foto.webp",
    alt: "Notebook com instalação de programas na tela e pendrive ao lado",
    description:
      "Programas, drivers e configurações, com checagem de requisitos e compatibilidade.",
    intro:
      "Instalação e configuração dos programas que você usa, sem formatar o computador. Antes, verificamos se o equipamento atende aos requisitos.",
    message:
      "Olá, Capucho! Preciso instalar ou configurar um programa. O programa é: ",
    signsTitle: "Quando pedir ajuda",
    signs: [
      [
        "Programa que não instala ou não abre",
        "Pode faltar um requisito, um componente do sistema ou uma permissão.",
      ],
      [
        "Impressora ou dispositivo parado",
        "Muitas vezes falta o driver correto ou a configuração do aparelho.",
      ],
      [
        "Computador novo",
        "Programas de trabalho e estudo instalados e configurados para a sua rotina.",
      ],
      [
        "Erro depois de uma atualização",
        "Atualizações do sistema podem causar incompatibilidade com programas ou drivers.",
      ],
    ],
    checksTitle: "O que é verificado",
    checks: [
      [
        "Requisitos",
        "Versão do sistema, memória e espaço em disco precisam atender ao que o programa exige.",
      ],
      [
        "Drivers",
        "Vídeo, áudio, rede e periféricos precisam dos drivers corretos para funcionar bem.",
      ],
      [
        "Configuração",
        "Contas, pastas e preferências ajustadas conforme o seu uso.",
      ],
    ],
    note: "Programas pagos exigem licença. Ela precisa ser fornecida por você ou adquirida antes da instalação.",
    faqTitle: "Dúvidas sobre instalação",
    local:
      "Instalação de programas na loja, na Freguesia do Ó, ou pelo suporte remoto, para todo o Brasil.",
    faq: [
      [
        "Instalar um programa é o mesmo que formatar?",
        "Não. A instalação acrescenta programas ao sistema atual, sem apagar seus arquivos. A formatação reinstala o sistema do zero.",
      ],
      [
        "Dá para instalar remotamente?",
        "Em muitos casos, sim, pelo suporte remoto, com o seu acompanhamento pela tela.",
      ],
      [
        "O programa vai funcionar no meu computador?",
        "Depende dos requisitos. Envie o nome do programa e o modelo do computador pelo WhatsApp para verificarmos.",
      ],
    ],
    related: ["formatacao-e-backup", "suporte-e-atendimento", "upgrade-de-ssd-e-memoria"],
  },
  {
    slug: "manutencao-preventiva",
    seoTitle: "Limpeza e manutenção preventiva de PC | Capucho Informática",
    seoDescription:
      "Notebook ou PC esquentando ou com ventoinha alta? Limpeza da refrigeração, avaliação da pasta térmica e testes de temperatura, na Freguesia do Ó.",
    title: "Manutenção preventiva",
    short: "Manutenção preventiva",
    image: "limpeza-foto.webp",
    alt: "Ventoinha de notebook sendo limpa com pincel, soprador e pasta térmica ao lado",
    description:
      "Limpeza da refrigeração e avaliação dos materiais térmicos para controlar temperatura e ruído.",
    intro:
      "A poeira acumulada dificulta a ventilação e faz o equipamento esquentar. A manutenção limpa a refrigeração e avalia os materiais térmicos.",
    message:
      "Olá, Capucho! Quero um orçamento para manutenção preventiva e limpeza do meu computador ou notebook.",
    signsTitle: "Sinais de que a refrigeração precisa de atenção",
    signs: [
      [
        "Ventoinha alta o tempo todo",
        "Ruído constante, mesmo em tarefas leves, pode indicar poeira acumulada ou ventoinha desgastada.",
      ],
      [
        "Aquecimento excessivo",
        "Calor forte no teclado, na base ou na saída de ar durante o uso comum.",
      ],
      [
        "Perde desempenho depois de um tempo",
        "Quando esquenta demais, o processador reduz a velocidade para se proteger.",
      ],
      [
        "Desliga em uso pesado",
        "O sistema pode desligar para se proteger da temperatura. A causa também pode ser fonte ou outro defeito.",
      ],
    ],
    checksTitle: "O que a manutenção inclui",
    checks: [
      [
        "Inspeção",
        "Verificação da poeira, das ventoinhas e das saídas de ar.",
      ],
      [
        "Limpeza da refrigeração",
        "Remoção da poeira de dissipadores, ventoinhas e áreas de ventilação, além da limpeza externa.",
      ],
      [
        "Materiais térmicos",
        "A pasta térmica é avaliada e trocada quando necessário. Em alguns equipamentos, os thermal pads também podem precisar de troca.",
      ],
      [
        "Teste de temperatura",
        "Temperaturas e funcionamento são observados depois da manutenção.",
      ],
    ],
    note: "Nem todo aquecimento vem da poeira. Se a temperatura continuar alta depois da limpeza, a causa é investigada no diagnóstico.",
    faqTitle: "Dúvidas sobre manutenção",
    local: "Limpeza e manutenção preventiva de notebooks e PCs na Freguesia do Ó.",
    faq: [
      [
        "Com que frequência devo fazer?",
        "Depende do ambiente e do uso. Poeira, pelos de animais e uso intenso, como jogos, aceleram o acúmulo.",
      ],
      [
        "Notebook gamer precisa de mais atenção?",
        "Sim. Ele trabalha com temperaturas mais altas, e o uso intenso acelera o acúmulo de poeira.",
      ],
      [
        "A manutenção mexe nos meus arquivos?",
        "Não. A limpeza é física e não altera o sistema nem os arquivos.",
      ],
    ],
    related: ["diagnostico-e-solucao-de-problemas", "troca-de-hardware", "upgrade-de-ssd-e-memoria"],
  },
  {
    slug: "suporte-e-atendimento",
    seoTitle: "Suporte técnico remoto e em domicílio | Capucho Informática",
    seoDescription:
      "Suporte técnico remoto para todo o Brasil e atendimento em casa na Freguesia do Ó e região, em São Paulo. Programas, erros, lentidão e vírus.",
    title: "Suporte remoto e atendimento em casa",
    short: "Suporte e atendimento",
    image: "suporte-foto.webp",
    alt: "Imagem ilustrativa de computador com headset e roteador para suporte remoto",
    description:
      "Ajuda à distância em todo o Brasil ou uma visita combinada na sua casa.",
    intro:
      "Conte o que está acontecendo. A gente verifica se dá para resolver à distância ou se uma visita faz mais sentido.",
    message:
      "Olá, Capucho! Preciso de suporte e gostaria de saber qual atendimento é indicado para o meu caso.",
    heading: "Escolha como prefere ser atendido.",
    groups: [],
    note: "O atendimento remoto depende do problema e das condições de acesso ao computador. Para visitas, confirme a cobertura, os valores e a disponibilidade no WhatsApp.",
    faqTitle: "Dúvidas sobre suporte",
    local:
      "Suporte técnico remoto para clientes de todo o Brasil e atendimento em casa na Freguesia do Ó e região, em São Paulo. Conte o que está acontecendo que a gente indica o melhor caminho.",
    faq: [
      [
        "Como funciona o suporte remoto?",
        "Você explica o problema pelo WhatsApp. Se der para resolver à distância, a gente combina o acesso ao seu computador com a sua autorização, e você acompanha tudo pela tela.",
      ],
      [
        "Preciso morar em São Paulo para ter suporte remoto?",
        "Não. O suporte remoto atende clientes de todo o Brasil.",
      ],
      [
        "O que dá para resolver remotamente?",
        "Instalação e configuração de programas, erros do Windows e de aplicativos, lentidão, remoção de vírus e orientação de uso. Problemas em peças, como tela ou placa, precisam de avaliação presencial.",
      ],
      [
        "Quais bairros recebem atendimento em casa?",
        "A Freguesia do Ó e arredores. Envie seu CEP pelo WhatsApp para confirmar a cobertura, o valor da visita e a disponibilidade de dia e horário.",
      ],
    ],
    related: ["diagnostico-e-solucao-de-problemas", "instalacao-de-softwares", "formatacao-e-backup"],
  },
];

// Páginas antigas que agrupavam vários serviços. Continuam no ar (links e buscas antigas) como
// índice para as páginas específicas; ficam fora do sitemap e com "noindex, follow".
// /servicos/limpeza-preventiva virou /servicos/manutencao-preventiva (redirecionamento em vercel.json).
export const redirects = { "limpeza-preventiva": "manutencao-preventiva" };

export const legacyHubs = [
  {
    slug: "conserto",
    title: "Conserto de computadores e notebooks",
    intro:
      "Os serviços de conserto agora têm páginas próprias. Escolha o que mais se aproxima do seu problema.",
    message: "Olá, Capucho! Preciso de um orçamento para conserto de computador ou notebook.",
    links: [
      "diagnostico-e-solucao-de-problemas",
      "troca-de-tela-de-notebook",
      "troca-de-hardware",
      "reparo-de-placa",
      "resinagem",
      "manutencao-preventiva",
    ],
  },
  {
    slug: "formatacao-e-programas",
    title: "Formatação e programas",
    intro:
      "Formatação e instalação de programas agora têm páginas próprias. Escolha o serviço que você procura.",
    message: "Olá, Capucho! Quero atendimento para formatação ou instalação de programas.",
    links: ["formatacao-e-backup", "instalacao-de-softwares", "suporte-e-atendimento"],
  },
  {
    slug: "upgrade-e-montagem",
    title: "Upgrade e montagem de computadores",
    intro:
      "Upgrade, troca de peças e montagem agora têm páginas próprias. Escolha o que você procura.",
    message: "Olá, Capucho! Quero conversar sobre upgrade ou montagem de computador.",
    links: ["upgrade-de-ssd-e-memoria", "troca-de-hardware"],
    gamer: true,
  },
];

export const faqs = [
  [
    "A avaliação é cobrada?",
    "Depende do problema e do equipamento. Se houver cobrança, o valor é informado no primeiro contato, antes de recebermos o aparelho. O serviço só começa depois que você aprova o orçamento.",
  ],
  [
    "Quanto tempo leva o serviço?",
    "O prazo é informado junto com o orçamento, depois da avaliação do computador. Você pode acompanhar o atendimento pelo WhatsApp.",
  ],
  [
    "Os serviços têm garantia?",
    "A garantia informada para os serviços é de 90 dias. Consulte a cobertura e as condições aplicáveis ao seu atendimento antes de aprovar o orçamento.",
  ],
  [
    "Vocês fazem retirada, entrega e visita?",
    "A retirada e a entrega são gratuitas na região atendida. Envie seu CEP ou endereço pelo WhatsApp para confirmar a cobertura. Visitas são combinadas por dia e horário; consulte o valor no primeiro contato.",
  ],
  [
    "E os meus arquivos?",
    "Conte quais arquivos são importantes antes de entregar o equipamento. Os cuidados com os dados e a possibilidade de backup precisam ser combinados antes do serviço.",
  ],
  [
    "Quais são as formas de pagamento?",
    "Consulte as formas de pagamento disponíveis pelo WhatsApp, junto com o seu orçamento.",
  ],
  [
    "Onde a Capucho atende?",
    "A loja fica na Rua Antônio de Couros, 461, Vila Palmeiras, São Paulo. Atendemos presencialmente a Freguesia do Ó e arredores. O suporte remoto atende clientes de todo o Brasil.",
  ],
];

// Trechos fiéis de avaliações públicas no Google (5 estrelas), conferidas em 25/09/2026.
// "[…]" marca partes omitidas; a grafia original foi mantida.
export const reviews = [
  {
    name: "Naiwan Feitosa de Oliveira",
    initials: "NF",
    text: "Serviço excelente!! 100% confiável. Levei meu notebook que estava com o teclado sem funcionar, touchpad e a bateria..Trocaram tudo pra mim, ficou ótimo, na verdade só o touchpad que não tinha mais jeito, mas o rapaz foi honesto comigo […]",
  },
  {
    name: "Messias Castro",
    initials: "MC",
    text: "Nos dias de hoje, é difícil acreditar que ainda existam profissionais como o Henrique. […] fiquei impressionado com a atenção, cordialidade, paciência e profissionalismo que demonstrou durante todo o atendimento.",
  },
  {
    name: "Bruno Campos Martins",
    initials: "BM",
    text: "Excelente profissional ! Atencioso, explicativo e sabe o que está fazendo. Serviços feitos : Trocado pasta térmica e limpeza de notebook. Atualização de hardware para o Pc.",
  },
  {
    name: "Lucas Alexandre",
    initials: "LA",
    text: "Henrique é, realmente, uma pessoa inacreditável na prestação de serviço. Não só conseguiu descobrir a causa do problema, mas ele ainda teve a preocupação de ir duas vezes no fornecedor de peças para fazer isso acontecer. […] Serviço fantástico e indico sem medo nenhum.",
  },
  {
    name: "Sérgio Silveira",
    initials: "SS",
    text: "Trabalho excelente! Atendimento personalizado que levou em conta as necessidades do cliente além de serem muito atenciosos. E o mais importante, foi o resultado, meu notebook, de vários anos, após a manutenção, ficou como novo!",
  },
  {
    name: "Eduarda Nonemacher",
    initials: "EN",
    text: "Henrique foi maravilhoso, chegamos la morrendo de medo com o PC molhado imaginando o pior, Henrique nos tranquilizou e resolveu nosso problema rapidamente.",
  },
];

// Seção "Quem cuida do seu PC mostra como faz": vídeos reais do trabalho na loja.
export const workVideos = [
  {
    file: "troca-tela",
    title: "Troca de tela de notebook",
    text: "Tela trincada, com manchas ou listras? A troca é feita com a peça compatível com o modelo do seu notebook.",
    link: "/servicos/troca-de-tela-de-notebook",
  },
  {
    file: "limpeza",
    title: "Limpeza e manutenção de notebook",
    text: "Poeira acumulada nas ventoinhas faz o notebook esquentar. Na manutenção, a limpeza é feita por dentro, com cuidado em cada componente.",
    link: "/servicos/manutencao-preventiva",
  },
  {
    file: "montagem",
    title: "Reparo de componentes e montagem",
    text: "Atenção aos detalhes do diagnóstico ao reparo de componentes, até a montagem completa do computador.",
    link: "/servicos/reparo-de-placa",
  },
  {
    file: "reparo-placa",
    title: "Reparo de placa",
    text: "Diagnóstico de componentes na placa-mãe, com testes e reparo do que for identificado como a causa do problema.",
    link: "/servicos/reparo-de-placa",
  },
  {
    file: "resinagem",
    title: "Resinagem",
    text: "Reforço estrutural em rachaduras da carcaça ou em pontos de fixação danificados, como parafusos e dobradiças.",
    link: "/servicos/resinagem",
  },
  {
    file: "manutencao-gamer",
    title: "Manutenção preventiva em PC gamer",
    text: "Limpeza interna e revisão dos componentes, cuidando das ventoinhas e do fluxo de ar do PC gamer.",
    link: "/servicos/manutencao-preventiva",
  },
];
