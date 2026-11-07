export type Locale = "pt" | "en";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt";
}

const pt = {
  htmlLang: "pt-BR",
  ogLocale: "pt_BR",
  homePath: "/",
  switchTo: {
    href: "/en",
    lang: "en",
    label: "EN",
    ariaLabel: "Read this page in English",
  },
  seo: {
    title: "ShiftLabs | Da Ideia ao Primeiro Cliente e Estrutura para Empresas",
    description:
      "A ShiftLabs leva sua ideia até a entrega ao primeiro cliente e estrutura empresas prontas para crescer com previsibilidade e execução coordenada.",
  },
  ids: {
    hero: "inicio",
    problem: "problema",
    paths: "caminhos",
    approach: "abordagem",
    services: "servicos",
    method: "como-trabalhamos",
    cases: "cases",
    contact: "contato",
  },
  nav: {
    sectionsLabel: "Seções da home",
    footerLabel: "Rodapé",
    sections: [
      ["problem", "Problema"],
      ["paths", "Caminhos"],
      ["services", "Serviços"],
      ["method", "Método"],
      ["cases", "Cases"],
    ],
    contact: "Contato",
  },
  hero: {
    label: "/Engenharia de negócios, da ideia à escala",
    titleLines: ["Tiramos negócios do papel. ", "Estruturamos os que já existem."],
    text: "A ShiftLabs transforma ideias em negócios reais, até a entrega ao primeiro cliente, e organiza empresas prontas para crescer com previsibilidade.",
    cta: "conversar com a ShiftLabs",
    timeline: [
      {
        title: "validação",
        label:
          "Um terreno de sondagem com uma grade de estacas; com o mouse, as estacas sobem onde o solo cede, e no ponto fraco sobem mais.",
      },
      {
        title: "arquitetura",
        label:
          "A maquete de um prédio de quatro andares; com o mouse, os andares se afastam e um deles mostra a laje e os pilares.",
      },
      {
        title: "execução",
        label:
          "Um motor de quatro cilindros rodando em compasso; com o mouse, ele acelera e os quatro pistões seguem juntos, presos ao mesmo eixo.",
      },
      {
        title: "escala",
        label:
          "Uma balança romana; com o mouse, entra carga no prato e o contrapeso corre sozinho pela escala até nivelar de novo.",
      },
    ],
  },
  ecosystem: {
    label: "/Feitos do zero",
    title:
      "Plataformas e sistemas feitos do zero com a engenharia e o framework da ShiftLabs.",
    openSite: (name: string) => `Abrir site da ${name} em nova aba`,
  },
  problem: {
    label: "/problema",
    title: "Negócios travam em dois momentos: antes de nascer e depois de crescer.",
    text: "Ideias param por falta de método, validação e time. Empresas prontas perdem força quando a estrutura não acompanha o crescimento.",
    cards: [
      {
        text: "Ideia e mercado que nunca se encontram.",
        figureLabel:
          "Duas metades de uma ponte, feitas de margens opostas; com o mouse, elas crescem e passam uma ao lado da outra, sem se encontrar.",
      },
      {
        text: "Decisões no palpite, sem validação real.",
        figureLabel:
          "Um painel com três mostradores cujos ponteiros oscilam no palpite; com o mouse, a medição liga e os ponteiros vão para bem longe do palpite.",
      },
      {
        text: "Marketing gera demanda que a operação não absorve.",
        figureLabel:
          "Pedidos caem numa bandeja mais rápido do que um carimbo despacha; com o mouse, a pilha transborda.",
      },
      {
        text: "Tecnologia acumula decisões sem arquitetura clara.",
        figureLabel:
          "Um arquivo com gavetas abarrotadas; com o mouse, a gaveta é empurrada e volta a abrir, cuspindo papel.",
      },
    ],
    quote:
      "Antes do primeiro cliente, o risco é construir a coisa errada. Depois dele, é crescer sobre uma base que não aguenta. A ShiftLabs atua nos dois momentos.",
  },
  paths: {
    label: "/Dois caminhos",
    title: "Do zero ou do que já existe, cuidamos do caminho inteiro.",
    tracks: [
      {
        label: "/Do zero",
        title: "Da ideia ao primeiro cliente.",
        desc: "Para quem tem uma ideia e precisa transformá-la em um negócio real.",
        steps: [
          "Validamos a ideia e o mercado.",
          "Desenhamos o modelo de negócio e o produto.",
          "Construímos e lançamos a primeira versão.",
          "Acompanhamos a entrega ao primeiro cliente.",
        ],
      },
      {
        label: "/Empresa pronta",
        title: "Estrutura para o que já existe.",
        desc: "Para empresas em operação que cresceram mais rápido do que a própria estrutura.",
        steps: [
          "Mapeamos onde a operação trava.",
          "Organizamos produto, tecnologia e comercial.",
          "Implementamos processos e indicadores.",
          "Preparamos a empresa para crescer com previsibilidade.",
        ],
      },
    ],
  },
  audience: {
    label: "/Para Quem é a ShiftLabs",
    title: "Da primeira ideia à próxima fase.",
    items: [
      "Fundadores com uma ideia para tirar do papel.",
      "Empresas que querem lançar um novo produto.",
      "Negócios que cresceram rápido demais.",
      "Empresas prontas que precisam de estrutura.",
    ],
  },
  approach: {
    label: "/Abordagem ShiftLabs",
    title: "Da ideia ou do caos a sistemas coordenados.",
    parts: [
      ["A ShiftLabs não é ", "agência. "],
      ["Não é ", "consultoria tradicional."],
      [" Não é ", "software factory."],
    ],
  },
  services: {
    label: "/O QUE FAZEMOS",
    titleLines: ["Como construímos e ", "estruturamos negócios."],
    lead: "Somos a engenharia estrutural do negócio.",
    text: "Da ideia à operação, trabalhamos na interseção de produto, tecnologia, comercial, growth e inteligência artificial.",
    items: [
      {
        title: "Produto & Estratégia",
        desc: "Validamos a ideia e definimos proposta de valor, arquitetura e roadmap com base em pesquisa.",
        figureLabel:
          "Uma trilha de pedras até uma bandeira; com o mouse em cima, o caminho se constrói em degraus até o marco escolhido.",
      },
      {
        title: "Tecnologia & Arquitetura",
        desc: "Construímos o produto do zero ou reorganizamos o que já existe, com arquitetura escalável e stack bem definida.",
        figureLabel:
          "Uma torre de blocos empilhados sem prumo; com o mouse em cima, as camadas entram no prumo.",
      },
      {
        title: "Growth & Comercial",
        desc: "Definimos posicionamento, pricing e funis para conquistar o primeiro cliente e crescer com margem.",
        figureLabel:
          "Um funil em degraus por onde descem bolinhas; as das bordas caem pelo caminho e só as do centro chegam ao cofre.",
      },
      {
        title: "Inteligência & Operação",
        desc: "Montamos a operação, modelamos indicadores e automatizamos processos para reduzir fricção.",
        figureLabel:
          "Um chip numa placa recebendo sinais sem parar; com o mouse em cima, o chip sobe, e a trilha sob o mouse recebe todo o fluxo.",
      },
    ],
  },
  framework: {
    label: "/Crescimento previsível",
    title: "Framework de Engenharia de Negócios™",
    intro: "Do zero ou de uma empresa pronta, cada projeto segue camadas:",
    layers: [
      "Identidade",
      "Fundamentos",
      "Arquitetura",
      "Sistema Operacional",
      "Camada de Inteligência",
    ],
    outcome: "Decisão deixa de ser opinião e passa a ser engenharia.",
  },
  method: {
    label: "/Como trabalhamos",
    title: "Da primeira conversa à entrega.",
    text: "Antes de sair construindo, entendemos em que fase o negócio está, desenhamos a arquitetura de execução e colocamos produto, tecnologia, crescimento e operação para trabalhar no mesmo sistema.",
    steps: [
      {
        title: "Diagnóstico",
        desc: "Entendemos a ideia ou a operação atual: mercado, produto, tecnologia e crescimento, para encontrar riscos reais e prioridades.",
      },
      {
        title: "Arquitetura de execução",
        desc: "Transformamos o diagnóstico em um plano claro: prioridades, fluxos, indicadores, responsáveis e sequência de implementação.",
      },
      {
        title: "Entrega coordenada",
        desc: "Executamos com frentes integradas até o resultado combinado: o primeiro cliente atendido ou a operação funcionando com previsibilidade.",
      },
    ],
  },
  cases: {
    label: "/cases",
    title: "Plataformas feitas do zero com a nossa engenharia.",
    newTab: " (abre em nova aba)",
    contextLabel: "Contexto: ",
    effectLabel: "Efeito: ",
    capabilityLabel: "Capacidade: ",
    items: [
      {
        title: "Uma IA que explica o cardápio em cada mesa.",
        context:
          "dúvidas travam o salão, os adicionais saem sem padrão e a gestão fica sem leitura do que acontece na mesa.",
        effect:
          "pelo QR Code da mesa, sem instalar app, o cliente tira dúvidas sobre pratos, porções e restrições e recebe sugestões de adicionais. O garçom segue no atendimento.",
        capability:
          "IA no navegador e o Maestro no backoffice, que organiza comportamento, dúvidas e aceitação em sinais para ajustar cardápio, oferta e operação.",
      },
      {
        title: "Atender na régua e provar que atendeu.",
        context:
          "operadores regulados costumam atender em um sistema e provar em outro, e a prova só é montada depois do pedido.",
        effect:
          "a Atena atende no WebChat dentro da régua do operador, leva casos de julgamento ao time humano e registra cada decisão na hora.",
        capability:
          "quatro agentes de IA para atendimento, eventos de pagamento, jogo responsável e governança de evidências.",
      },
      {
        title: "Histórias de dormir na voz da família.",
        context:
          "a hora de dormir depende de quem está por perto para contar a história.",
        effect:
          "um adulto grava a própria voz com autorização, ou usa a Voz do Contto, e as histórias nascem em conversa para crianças de 3 a 8 anos.",
        capability:
          "livro de seis noites escrito por IA, sem anúncios, com o adulto no controle da conta e da retirada da voz.",
      },
      {
        title: "Formalização de cessões imobiliárias.",
        context:
          "quem precisa sair de um contrato imobiliário nem sempre encontra um caminho seguro.",
        effect:
          "a plataforma conecta quem quer sair do contrato a quem busca oportunidade abaixo da tabela, com comissão apenas no fechamento.",
        capability:
          "verificação documental, conta escrow e módulos para cedente, cessionário e administração.",
      },
    ],
  },
  why: {
    label: "/Por que a ShiftLabs",
    title: "Um time só, da ideia à escala.",
    text: "Quando design, código e marketing são contratados separados, ninguém responde pelo resultado. Na ShiftLabs, as três frentes andam juntas.",
    items: [
      {
        before: "Design isolado.",
        after: "Marca, produto e experiência decididos junto com o negócio.",
      },
      {
        before: "Código isolado.",
        after: "Sistemas feitos do zero, com a nossa engenharia e o nosso framework.",
      },
      {
        before: "Marketing isolado.",
        after: "Oferta e comercial prontos para chegar ao primeiro cliente.",
      },
    ],
  },
  cta: {
    label: "/Próximo passo",
    title: "Por onde começamos: pela sua ideia ou pela sua empresa?",
    text: "A primeira conversa serve para entender em que fase você está e qual é o caminho até o próximo resultado: o primeiro cliente ou uma operação que cresce com previsibilidade.",
    button: "iniciar conversa",
  },
  footer: {
    text: "Tiramos negócios do papel e estruturamos empresas prontas, com produto, tecnologia, comercial e operação coordenados.",
    rights: " Todos os direitos reservados.",
    homeLabel: "/home",
    companyLabel: "/empresa",
    socialLabel: "/redes",
  },
  contact: {
    dialogLabel: "Formulário de contato",
    label: "/contato",
    close: "fechar",
    title: "Fale com a ShiftLabs",
    successTitle: "Mensagem pronta",
    successLabel: "/falta um passo",
    successHeading: "Sua mensagem está pronta no e-mail.",
    successStatus: "STATUS: PRONTA",
    successFallback: (email: string) =>
      `Se o seu e-mail não abrir, escreva direto para ${email}.`,
    steps: [
      ["/passo 01", "Abrimos seu app de e-mail com tudo preenchido."],
      ["/passo 02", "Confira a mensagem e clique em enviar."],
      ["/passo 03", "Retornaremos em até 2 dias úteis."],
    ],
    backToForm: "voltar ao formulário",
    fields: {
      name: "Nome",
      whatsapp: "WhatsApp",
      email: "E-mail",
      company: "Empresa",
      subject: "Assunto",
    },
    notice:
      "Ao continuar, abrimos seu e-mail com a mensagem pronta. Usaremos seus dados apenas para responder seu contato.",
    cancel: "cancelar",
    submit: "continuar no e-mail",
    missingFields: "Preencha todos os campos para continuar.",
    mailSubject: (company: string) => `Contato pelo site - ${company}`,
  },
};

const en: typeof pt = {
  htmlLang: "en",
  ogLocale: "en_US",
  homePath: "/en",
  switchTo: {
    href: "/",
    lang: "pt-BR",
    label: "PT",
    ariaLabel: "Ler esta página em português",
  },
  seo: {
    title: "ShiftLabs | From Idea to First Customer, and Structure for Companies",
    description:
      "ShiftLabs takes your idea all the way to the first customer and structures established companies for predictable growth and coordinated execution.",
  },
  ids: {
    hero: "home",
    problem: "problem",
    paths: "paths",
    approach: "approach",
    services: "services",
    method: "how-we-work",
    cases: "cases",
    contact: "contact",
  },
  nav: {
    sectionsLabel: "Home sections",
    footerLabel: "Footer",
    sections: [
      ["problem", "Problem"],
      ["paths", "Paths"],
      ["services", "Services"],
      ["method", "Method"],
      ["cases", "Cases"],
    ],
    contact: "Contact",
  },
  hero: {
    label: "/Business engineering, from idea to scale",
    titleLines: ["We get businesses off the ground. ", "We structure the ones already running."],
    text: "ShiftLabs turns ideas into real businesses, all the way to delivery to the first customer, and organizes established companies to grow predictably.",
    cta: "talk to ShiftLabs",
    timeline: [
      {
        title: "validation",
        label:
          "A survey site with a grid of stakes; with the mouse, the stakes rise where the ground gives way, and rise most at the weak spot.",
      },
      {
        title: "architecture",
        label:
          "A scale model of a four-story building; with the mouse, the floors separate and one of them reveals its slab and columns.",
      },
      {
        title: "execution",
        label:
          "A four-cylinder engine running in time; with the mouse, it speeds up and the four pistons keep moving together, fixed to the same shaft.",
      },
      {
        title: "scale",
        label:
          "A steelyard balance; with the mouse, load lands on the pan and the counterweight slides along the scale on its own until it levels again.",
      },
    ],
  },
  ecosystem: {
    label: "/Built from scratch",
    title:
      "Platforms and systems built from scratch with ShiftLabs engineering and framework.",
    openSite: (name: string) => `Open the ${name} website in a new tab`,
  },
  problem: {
    label: "/problem",
    title: "Businesses stall at two moments: before they are born and after they grow.",
    text: "Ideas stop for lack of method, validation and team. Established companies lose momentum when structure doesn't keep up with growth.",
    cards: [
      {
        text: "Ideas and markets that never meet.",
        figureLabel:
          "Two halves of a bridge, built from opposite banks; with the mouse, they grow and pass side by side without ever meeting.",
      },
      {
        text: "Decisions made on hunches, with no real validation.",
        figureLabel:
          "A panel with three dials whose needles waver on a hunch; with the mouse, measurement turns on and the needles swing far from the guess.",
      },
      {
        text: "Marketing creates demand that operations can't absorb.",
        figureLabel:
          "Orders drop into a tray faster than a stamp can clear them; with the mouse, the pile overflows.",
      },
      {
        text: "Technology piles up decisions with no clear architecture.",
        figureLabel:
          "A filing cabinet with overstuffed drawers; with the mouse, a drawer is pushed in and springs back open, spitting out paper.",
      },
    ],
    quote:
      "Before the first customer, the risk is building the wrong thing. After it, the risk is growing on a base that can't hold. ShiftLabs works at both moments.",
  },
  paths: {
    label: "/Two paths",
    title: "From scratch or from what already exists, we take care of the whole path.",
    tracks: [
      {
        label: "/From scratch",
        title: "From idea to first customer.",
        desc: "For those with an idea who need to turn it into a real business.",
        steps: [
          "We validate the idea and the market.",
          "We design the business model and the product.",
          "We build and launch the first version.",
          "We see delivery through to the first customer.",
        ],
      },
      {
        label: "/Established company",
        title: "Structure for what already exists.",
        desc: "For operating companies that grew faster than their own structure.",
        steps: [
          "We map where operations get stuck.",
          "We organize product, technology and sales.",
          "We put processes and metrics in place.",
          "We prepare the company to grow predictably.",
        ],
      },
    ],
  },
  audience: {
    label: "/Who ShiftLabs is for",
    title: "From the first idea to the next stage.",
    items: [
      "Founders with an idea to get off the ground.",
      "Companies that want to launch a new product.",
      "Businesses that grew too fast.",
      "Established companies that need structure.",
    ],
  },
  approach: {
    label: "/The ShiftLabs approach",
    title: "From an idea or from chaos to coordinated systems.",
    parts: [
      ["ShiftLabs is not an ", "agency. "],
      ["Not a ", "traditional consultancy."],
      [" Not a ", "software factory."],
    ],
  },
  services: {
    label: "/WHAT WE DO",
    titleLines: ["How we build and ", "structure businesses."],
    lead: "We are the structural engineering of the business.",
    text: "From idea to operations, we work at the intersection of product, technology, sales, growth and artificial intelligence.",
    items: [
      {
        title: "Product & Strategy",
        desc: "We validate the idea and define the value proposition, architecture and roadmap based on research.",
        figureLabel:
          "A trail of stones leading to a flag; with the mouse over it, the path builds itself step by step up to the chosen milestone.",
      },
      {
        title: "Technology & Architecture",
        desc: "We build the product from scratch or reorganize what already exists, with scalable architecture and a well-defined stack.",
        figureLabel:
          "A tower of blocks stacked out of plumb; with the mouse over it, the layers fall into alignment.",
      },
      {
        title: "Growth & Sales",
        desc: "We define positioning, pricing and funnels to win the first customer and grow with margin.",
        figureLabel:
          "A stepped funnel with small balls rolling down; those at the edges drop along the way and only those in the center reach the safe.",
      },
      {
        title: "Intelligence & Operations",
        desc: "We set up operations, model metrics and automate processes to reduce friction.",
        figureLabel:
          "A chip on a board receiving a constant stream of signals; with the mouse over it, the chip rises and the trace under the mouse takes the full flow.",
      },
    ],
  },
  framework: {
    label: "/Predictable growth",
    title: "Business Engineering Framework™",
    intro: "From scratch or from an established company, every project follows layers:",
    layers: [
      "Identity",
      "Fundamentals",
      "Architecture",
      "Operating System",
      "Intelligence Layer",
    ],
    outcome: "Decisions stop being opinion and become engineering.",
  },
  method: {
    label: "/How we work",
    title: "From the first conversation to delivery.",
    text: "Before building anything, we understand what stage the business is in, design the execution architecture and get product, technology, growth and operations working in the same system.",
    steps: [
      {
        title: "Diagnosis",
        desc: "We study the idea or the current operation (market, product, technology and growth) to find the real risks and priorities.",
      },
      {
        title: "Execution architecture",
        desc: "We turn the diagnosis into a clear plan: priorities, flows, metrics, owners and implementation sequence.",
      },
      {
        title: "Coordinated delivery",
        desc: "We execute with integrated workstreams until the agreed result: the first customer served or the operation running predictably.",
      },
    ],
  },
  cases: {
    label: "/cases",
    title: "Platforms built from scratch with our engineering.",
    newTab: " (opens in a new tab)",
    contextLabel: "Context: ",
    effectLabel: "Effect: ",
    capabilityLabel: "Capability: ",
    items: [
      {
        title: "An AI that explains the menu at every table.",
        context:
          "questions slow down the dining room, add-ons go out with no standard and management can't see what happens at the table.",
        effect:
          "through the table's QR code, with no app to install, guests ask about dishes, portions and dietary restrictions and get add-on suggestions. The waiter stays on service.",
        capability:
          "AI in the browser and Maestro in the back office, which turns behavior, questions and acceptance into signals to adjust the menu, the offer and operations.",
      },
      {
        title: "Serve by the rules and prove you did.",
        context:
          "regulated operators usually serve customers in one system and prove it in another, and the proof is only put together after someone asks for it.",
        effect:
          "Atena serves customers on WebChat within the operator's rules, takes judgment calls to the human team and records every decision on the spot.",
        capability:
          "four AI agents for customer service, payment events, responsible gaming and evidence governance.",
      },
      {
        title: "Bedtime stories in the family's voice.",
        context: "bedtime depends on who is around to tell the story.",
        effect:
          "an adult records their own voice with authorization, or uses the Contto Voice, and stories unfold in conversation for children ages 3 to 8.",
        capability:
          "a six-night book written by AI, with no ads, and the adult in control of the account and of removing the voice.",
      },
      {
        title: "Formalizing real estate contract assignments.",
        context:
          "people who need to exit a real estate contract don't always find a safe way out.",
        effect:
          "the platform connects those who want out of a contract with those looking for below-market opportunities, with commission only at closing.",
        capability:
          "document verification, an escrow account and modules for assignor, assignee and administration.",
      },
    ],
  },
  why: {
    label: "/Why ShiftLabs",
    title: "One team, from idea to scale.",
    text: "When design, code and marketing are hired separately, no one answers for the result. At ShiftLabs, all three move together.",
    items: [
      {
        before: "Isolated design.",
        after: "Brand, product and experience decided together with the business.",
      },
      {
        before: "Isolated code.",
        after: "Systems built from scratch, with our engineering and our framework.",
      },
      {
        before: "Isolated marketing.",
        after: "Offer and sales ready to reach the first customer.",
      },
    ],
  },
  cta: {
    label: "/Next step",
    title: "Where do we start: with your idea or with your company?",
    text: "The first conversation is about understanding what stage you are in and the path to the next result: the first customer or an operation that grows predictably.",
    button: "start a conversation",
  },
  footer: {
    text: "We get businesses off the ground and structure established companies, with product, technology, sales and operations coordinated.",
    rights: " All rights reserved.",
    homeLabel: "/home",
    companyLabel: "/company",
    socialLabel: "/social",
  },
  contact: {
    dialogLabel: "Contact form",
    label: "/contact",
    close: "close",
    title: "Talk to ShiftLabs",
    successTitle: "Message ready",
    successLabel: "/one step left",
    successHeading: "Your message is ready in your email.",
    successStatus: "STATUS: READY",
    successFallback: (email: string) =>
      `If your email doesn't open, write directly to ${email}.`,
    steps: [
      ["/step 01", "We open your email app with everything filled in."],
      ["/step 02", "Review the message and hit send."],
      ["/step 03", "We'll get back to you within 2 business days."],
    ],
    backToForm: "back to the form",
    fields: {
      name: "Name",
      whatsapp: "WhatsApp",
      email: "Email",
      company: "Company",
      subject: "Subject",
    },
    notice:
      "By continuing, we open your email with the message ready. We'll use your details only to respond to you.",
    cancel: "cancel",
    submit: "continue in email",
    missingFields: "Fill in all fields to continue.",
    mailSubject: (company: string) => `Website contact - ${company}`,
  },
};

export const copy: Record<Locale, typeof pt> = { pt, en };
