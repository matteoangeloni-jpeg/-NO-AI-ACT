# Plano de verificação do caminho guiado

[Italiano](../METHODOLOGY_TEST_PLAN.md) · [English](../en/METHODOLOGY_TEST_PLAN.md) · [Français](../fr/METHODOLOGY_TEST_PLAN.md) · [Deutsch](../de/METHODOLOGY_TEST_PLAN.md) · [Español](../es/METHODOLOGY_TEST_PLAN.md) · [Português](../pt/METHODOLOGY_TEST_PLAN.md) · [Nederlands](../nl/METHODOLOGY_TEST_PLAN.md)

> Edição linguística V5.4.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em sete línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.


Antes da mudança. As matrizes A, B e C foram escritas em METODOLOGIA.md e LEGAL_LEARNING_MATRIX.md. O código de partida fornece orientação contextual, comparação, relatório com razões predefinidas, reflexão final e revisão. A produção autónoma e uma comparação explícita entre a interpretação inicial e o feedback estão ausentes nessa linha de base.

## # Critérios técnicos

| ID | Cenário | Critérios observáveis |
|---|---|---|
| T1 | Abertura normal da CaseScene | Caminho guiado disponível como uma ação opcional em IT/EN/FR |
| T2 | Compreensão e hipótese | Leia o propósito, escreva uma hipótese antes das exposições, digite Evidência |
| T3 | Revisão durante o inquérito | A hipótese inicial permanece legível; a hipótese atual é editável |
| T4 | Assinatura | Nota autônoma aparece antes do feedback no caminho escolhido; o skipping permanece possível |
| T5 | Após o feedback | Nota assinada pode ser releitura e não é sobrescrita por reflexão posterior |
| T6 | Nova sessão e recarregar | Notas temporárias não entram nem salvas, nem exportações nem telemetria |
| T7 | Escapar e modal | Fechar a janela, restaurar os controles de foco e cena; nenhum sinal chave por trás da janela; os cliques do notebook não alteram a seleção de exibição subjacente |
| T8 | Toque e teclado | Cada ação alcançável, entrada de texto rotulada, foco confinado à janela |
| T9 | Disposição | 320/390 px, área de trabalho, zoom de 200% simulado, viewport curto e 4K com rolagem interna |
| T10 | Catálogo | Todos os 14 casos e línguas permanecem disponíveis; avaliação e migração V1/V2 passam por dispositivos existentes |
| T11 | Recuperação | Fechando o diálogo ou mudando a cena não deixa nenhuma sobreposição presa, ouvinte ou foco |
| T12 | Rede | Texto escrito ausente das cargas úteis da colecção; nenhum novo ponto final |
| T13 | Mediação contextual | Cada caso tem suporte de abertura, fonte, relação, incerteza e debrief em IT/EN/FR; nenhuma solução mostrada antes do feedback |
| T14 | Providência e relações | Reler apenas fontes abertas; anotar cada fonte; conectar fontes distintas com uma explicação livre; sem julgamento automático da relação |
| T15 | Revisão explícita | Primeira hipótese intacta; revisões fundamentadas disponíveis; nota assinada e relações imutáveis após feedback |
| T16 | reflexão final completo | Escolhas, regra, nota anterior, uso de feedback e plano de aplicação; síntese de todos os casos guiados concluídos |
| T17 | Tarefa independente | Dois formulários × três idiomas, quatro novas fontes, sem menu de respostas; texto bloqueado na submissão e debrief indisponível previamente |
| T18 | Observação e rubrica | Sete linhas de observação, seis dimensões codificadas manualmente, ausentes de 0, nenhum total, correção legal separada |
| T19 | Investigação/separação pública | Study 02 materiais e ferramentas excluídos das importações de caça e caça; sem POST ou persistência automática no laboratório |

Comandos planejados: npm execute typecheck, npm test, npm execute build, npm execute audit:seo, npm execute check:dist, npm execute smoke:guided-inquiry, npm execute smoke:release-cases e npm execute smoke:final-modes. Os testes técnicos não constituem certificação de validação educacional ou de acessibilidade.

Ordem de conclusão exigida. Escreva todas as ferramentas de mediação, componentes, materiais de transferência e observação antes de iniciar os testes. Em seguida, execute toda a suíte, cobertura guiada de fumaça de 14 casos × três idiomas e seis perfis de layout, Study 02 cobertura de duas formas × três idiomas × PRE/POST e regressões de catálogo/modo. Uma correcção que surja durante o ensaio requer a repetição dos controlos pertinentes antes da entrega. Os testes utilizam dados sintéticos e não fornecem evidência de aprendizagem humana.

A telemetria existenteMetrics.ts inclui evidências contraditóriasReconhecidas, derivadas da abertura de certas categorias de exposição. O seu nome pode implicar mais do que o comportamento demonstra. Em Study 02, tratá-lo como um proxy de exposição técnica; não inferir o reconhecimento de contradição sem a explicação do participante. Este incremento não altera o esquema de telemetria.

## # Protocolo humano ainda para conduzir

Recrutar iniciantes e participantes experientes com consentimento para observação e anotações. Uma iteração inicial com 5-8 participantes por perfil pode revelar obstáculos sem estimar a efetividade. Registre CEPAJe contexto, linguagem, dispositivo, assistência, interrupções e dificuldades de leitura.

Tarefas: explicar o propósito da classificação, formar uma hipótese, encontrar e conectar duas fontes, identificar uma alternativa, escrever antes de assinar, reler após feedback e justificar revisão ou confirmação. O facilitador registra sucesso independente, sucesso com assistência, não completação, erro grave e o motivo indicado. Não classificá-lo conta como pensamento crítico.

Critérios de concepção-revisão. Incapacidade de sair de um diálogo, assinatura acidental, perda de texto dentro de uma sessão ou um prompt que revele a solução requer correção antes de expandir o protótipo. Para compreensão, estabelecer um limiar piloto operacional, como pelo menos quatro de cinco iniciantes explicando a tarefa em suas próprias palavras. Relate casos discordantes também. Esta é uma decisão do produto, não um teste de eficácia.

Teste leitores de ecrã real, ditado ou transcrição mediada, navegação de teclado e toque com um teclado na ecrã. Fornecer uma rota de resposta oral equivalente para as pessoas que enfrentam barreiras de escrita. Todas as três línguas requerem revisão humana antes do recrutamento para Study 02.

Este é o plano de verificação metodológica original. Traduzindo-o não repete seus testes de fumaça: a correção de localização V5.0.1 é verificada com verificações de linguagem estática, testes unitários e construção apenas, conforme solicitado pelo proprietário.
