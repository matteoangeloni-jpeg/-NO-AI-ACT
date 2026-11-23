# Incremento metodológico V5 — cobertura completa

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](../fr/METHODOLOGY_IMPLEMENTATION.md) · [Deutsch](../de/METHODOLOGY_IMPLEMENTATION.md) · [Español](../es/METHODOLOGY_IMPLEMENTATION.md) · [Português](../pt/METHODOLOGY_IMPLEMENTATION.md) · [Nederlands](../nl/METHODOLOGY_IMPLEMENTATION.md)

> Edição linguística V5.4.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em sete línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.


Ramo de trabalho `codex/v5-methodology-guided-path`, linha de base principal `527fde5`. Revisão de 21 de novembro de 2026. Este relatório registra a conclusão local antes do lançamento. O proprietário posteriormente autorizou a publicação como V5.0.0; status de lançamento e notas estão disponíveis no GitHub e em [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md).

## # Mudanças implementadas

| Componente | Comportamento |
|---|---|
| CasosCena e inquéritoProcessos | Três paragens introdutórias e cinco suportes específicos para cada um dos 14 casos, em IT/EN/FR |
| EvidenceScene e notebook | Reler documentos abertos, avaliar proveniência, conectar livremente duas fontes com uma razão |
| Sessão Guiada | Preservar a primeira hipótese, registrar explicitamente revisões fundamentadas, selar uma cópia de argumento, fontes e relações antes de feedback |
| Cena da Decisão | Recordação contextual, apoio reaberto e nota autónoma que cobre a alegação, a prova, o raciocínio, a alternativa e a incerteza antes da assinatura |
| ReportScene | Escolhas de caso e regra, nota anterior, reflexão, verificação de feedback e plano de aplicação mantido distinto |
| SessionEndScene | Relatório de todos os casos guiados concluídos, síntese de casos cruzados e estratégia para novos contextos |
| Janela acessível | HTML semântico, etiquetas, seleções/detalhes nativos, Escape, foco confinado e restaurado, rolagem interna; isole ponteiro e teclado da cena |
| Local Study 02 | Dois novos formulários com quatro fontes originais cada um em três idiomas, texto livre bloqueado na submissão, sem correção automática |
| Observação e rubrica | CEPAJe contexto, sete linhas de observação, seis dimensões codificadas pelo homem, a exatidão legal separada |
| Separação de dados | Notas de jogo mantidas apenas na memória; laboratório fora dist, loopback GET/HEAD servidor, download local explícito apenas |

O caminho preserva a narrativa, 14 casos, razões predefinidas, resultados originais e escores. Escrever ou propor uma relação não dá pontos e não produz nenhuma avaliação crítico-pensamento. A mediação pergunta sobre evidências e circunstâncias sem revelar uma solução legal antes do feedback. Os documentos da Matrix C estão alinhados com a consolidação da UE de 27 de julho de 2026, verificada em EUR-Lex.

## # Rastreabilidade e materiais

As matrizes A/B, o mapa LM–GM, a análise CEPAJe e a bibliografia estão em METODOLOGIA.md; a matriz C está em LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md liga os comportamentos solicitados aos componentes. ARGUMENTAÇÃO_ESTUDO02.md contém rubricas, design, triangulação e o plano de análise. Os e-mails originais foram lidos; as referências e a rastreabilidade privada permanecem no dossiê do proprietário, fora da construção pública. Nenhum feedback é apresentado como endosso.

## # Verificação final

A implementação foi concluída antes de iniciar os novos testes, conforme solicitado. Os resultados da versão parcial anterior não certificam este incremento. A verificação final e seus resultados são registrados em TEST_RESULTADOS.md após a execução. Testes automatizados usam apenas materiais sintéticos e acessórios explícitos.

Comandos: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## # Uso local

Jogo: `npm run dev`, abrir `/play/?lang=en`, selecione um caso e GUIDED PATH. A mediação precede as exposições. Notas são opcionais e desaparecem ao recarregar ou um novo jogo; texto escrito não entra em nenhum jogo salva, exportações ou telemetria.

Estudo: `npm run study02:local`, abrir `http://127.0.0.1:4262/` e selecionar Inglês. O PRE/POST utiliza tabulações separadas e formas contrabalanceadas. A ferramenta não gere identidade, consentimento, randomização, recrutamento ou retenção institucional: pertencem ao protocolo autorizado externamente. O relatório permanece desactivado antes da apresentação. O download explícito salva o texto enviado e notas humanas no dispositivo.

Referência do fumo: `CHROMIUM_PATH` pode selecionar o Chrome instalado. `INQUIRY_PORT` escolhe o porto. `INQUIRY_ONLY` limita um perfil para o diagnóstico; a verificação metodológica completa original utilizou todos os perfis. A cobertura guiada compreende 14 casos × três idiomas mais três perfis de layout: 45 viagens. Study 02 compreende dois formulários × três idiomas × PRE/POST: 12 configurações. Estes comandos documentam que a verificação; eles não são regravados para a correção de localização.

Nesta máquina Windows, `INQUIRY_4K_GPU=d3d11` solicita Direct3D apenas para o perfil 3840×2160; outros perfis usam o renderizador de software do teste. Cada resultado registra a infra-estrutura real, e as reproduções devem revelar essa diferença. A inicialização somente de software 4K excedeu o tempo limite de 90 segundos no Pré-carregamento existente. O diagnóstico de GPU atingiu o título em cerca de 5,6 segundos. Esta não é uma estimativa de desempenho generalizável.

## # Limites abertos

- A cobertura conteúdo/função é distinta da validade educacional. São necessários pilotos iniciantes, observação, produções e uma tarefa independente; não foi realizado nenhum estudo humano.
- Rubric, equivalência de formulários e traduções são preliminares: revisão bilíngue, entrevistas cognitivas, âncoras e concordância interobservadores permanecem necessárias.
- A mediação é textual. Densidade, ritmo e autonomia devem ser verificados no contexto CEPAJe; respostas orais equivalentes requerem mediação autorizada.
- Leitores de ecrã real, ditado, teclados na ecrã e dispositivos físicos precisam de testes humanos. Os controlos automatizados não certificam a acessibilidade universal.
- A nota autónoma segue as alternativas do relatório, cujo possível efeito indicativo é abordado metodologicamente através da tarefa externa.
- A primeira nota é a declaração do jogador. A exposição anterior a um caso pode influenciá-lo; a linha de base da pesquisa é um PRE independente antes do jogo em uma nova sessão.
- As notas do jogo não são de rastreamento individual. Uma abertura ou revisão não demonstra compreensão: a triangulação depende de explicações e observação humana externa.
- Os novos materiais requerem revisão legal humana antes da administração. As respostas dos 14 casos não foram alteradas.
- A bibliografia é uma pesquisa direcionada; cada entrada divulga limites de acesso a texto completo.
- O relatório técnico original precede a publicação; o status de liberação é registrado separadamente em V5.0.0.

## # Entregas

| Pedido | Resultado |
|---|---|
| Método e bibliografia europeia | METODOLOGIA. md |
| Matriz de feedback | Matrix A e COVERAGE_ COMPLETION.md; dossiê privado separado |
| LM–GM | METODOLOGIA. md |
| CEPAJe | METODOLOGIA.md; contexto laboratorial |
| Caminho guiado | inquéritoCasos, Consulta GuiadaDialog e cenas de jogo |
| Ciclo de investigação e feedback | Revisões, notas seladas e reflexão separada |
| Rubric | ARGUMENTAÇÃO_ESTUDO02.md e laboratório manual |
| Study 02 transferência | Dois formulários completos em pesquisa/estudo02 |
| Ensaios | METODOLOGIA_TEST_PLAN.md e TEST_RESULTADOS.md |
| Alterações e limites | Este documento |
