import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePaths = ["src/app/App.tsx", "src/app/copy.ts"];
const sources = await Promise.all(
  sourcePaths.map((sourcePath) => readFile(path.join(root, sourcePath), "utf8")),
);
const source = sources.join("\n");

const forbiddenSnippets = [
  "Bloco 2",
  "Responda as perguntas do bloco 2",
  "Agora me fala aqui o que a ShiftLabs ganha contratando você",
  "pipeline interno",
  "perfil alinhado a /{displayArea}",
  "Configuração de backend indisponível",
  "A Shift Labs transforma",
  "A Shift Labs não é",
  "/Para Quem é a Shift Labs",
  "Produto, Tech, Growth e Operações",
  "ownership alto",
  "seuemail@exemplo.com",
  "linkedin.com/in/seu-perfil",
  "Retornamos em alguns dias úteis",
  "Retornaremos em breve",
  "What makes us different",
  "Ready to structure what you’re building?",
  "/Call to Action",
  "Most players optimize pieces. We optimize the system.",
  "IA na mesa.",
  "IA aplicada à experiência de restaurante",
  "Camada de inteligência organizacional.",
];

const requiredSnippets = [
  "A ShiftLabs transforma",
  "A ShiftLabs não é",
  "/Para Quem é a ShiftLabs",
  "Retornaremos em até 2 dias úteis",
  "/Como trabalhamos",
  "Da primeira conversa à entrega.",
  "Da ideia ao primeiro cliente.",
  "Arquitetura de execução",
  "Entrega coordenada",
  "Um time só, da ideia à escala.",
  "ninguém responde pelo resultado",
  "Por onde começamos: pela sua ideia ou pela sua empresa?",
  "iniciar conversa",
  "Uma IA que explica o cardápio em cada mesa.",
  "Atender na régua e provar que atendeu.",
  "Histórias de dormir na voz da família.",
  "Formalização de cessões imobiliárias.",
  "Contato",
  "We get businesses off the ground. ",
  "From idea to first customer.",
  "Business Engineering Framework™",
  "Where do we start: with your idea or with your company?",
];

const forbiddenPatterns = [
  { label: "CTA exato ainda usa ver vaga", pattern: />\s*ver vaga\s*</ },
];

const failures = [];

for (const snippet of forbiddenSnippets) {
  if (source.includes(snippet)) {
    failures.push(`copy proibida ainda presente: ${snippet}`);
  }
}

for (const { label, pattern } of forbiddenPatterns) {
  if (pattern.test(source)) {
    failures.push(label);
  }
}

for (const snippet of requiredSnippets) {
  if (!source.includes(snippet)) {
    failures.push(`copy esperada ausente: ${snippet}`);
  }
}

if (failures.length) {
  console.error("[ux-copy] Falhas encontradas:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[ux-copy] Copy validada.");
