# Cobertura operacional do feedback

[Italiano](../COVERAGE_COMPLETION.md) · [English](../en/COVERAGE_COMPLETION.md) · [Français](../fr/COVERAGE_COMPLETION.md) · [Deutsch](../de/COVERAGE_COMPLETION.md) · [Español](../es/COVERAGE_COMPLETION.md) · [Português](../pt/COVERAGE_COMPLETION.md)

> Edição linguística V5.3.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em seis línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.


Incremento solicitado pelo proprietário em 21 de novembro de 2026. Esta lista define o trabalho a implementar antes de iniciar a nova verificação final.

| Requerimento | Execução | Componente verificável |
|---|---|---|
| A1 — compreensão dos principiantes | Mediação caso-específica para todos os 14 casos nas três línguas | questionCases.ts; diálogo, 42 cartões de caso |
| A2 — cenas dentro da sequência | Introdução progressiva, ajuda contextual entre exposições e classificação, orientação reaberta | CaseScene, três paragens curtas; DecisionScene, method |
| A3 — relatório final | Reconstruir razões, comparar com as regras do caso e feedback, síntese no final da sessão | ReportScene; SessionEndScene; feedback e sessão |
| P1 — Exploração de fontes | Reler exposições abertas e avaliar sua proveniência e confiabilidade com razões | fontes e escritaFonte; observação humana separada |
| P2 — Correlação | Pares de código criados pelo jogador, com uma relação e uma explicação | Relate, suportes/desafios/relação incerta, sem correção automática |
| P3 — hipóteses e revisão | Preservar a primeira hipótese e registrar revisões explícitas e fundamentadas | terminarIntrodução; registroRevisão; instantâneo |
| P4 — Argumento autónomo | Reivindicação, evidência, conexão lógica alternativa a uma medida e responsabilidade antes do feedback | argumento, raciocínio; enviar antes de resolver |
| P5 — incerteza | Faltam informações e consequências para as pessoas e os direitos | incerteza; mediação diferente para cada caso |
| P6 — Utilização de feedback | Comparar com o texto anterior, manter ou rever um critério, planejar um novo caso | reflexão, feedbackUse, transferênciaPlano; síntese de sessão |
| P7 — observação e triangulação | Ferramenta local separada para observação estruturada e codificação rubric humana | Study 02: sete linhas de observação, seis dimensões, CEPAJe contexto |
| P8 — Transferência independente | Duas formas completas de TI/EN/FR, documentos originais, resposta livre selada antes do reflexão final, funcionando ferramenta local | pesquisa/estudo02; servidor local GET/HEAD; 12 configurações |
| Limites | Original 14 casos, migrações existentes e pontuação, notas temporárias no jogo, materiais de pesquisa excluídos da construção pública | Catalogar, salvar, privacidade, rede e testes de dist |

A cobertura operacional diz respeito ao conteúdo e às funções. A efetividade e a validade das inferências requerem participantes, revisores e análises sob o protocolo Study 02. O relatório final distingue a execução, a verificação técnica e a verificação humana.

Os testes começaram depois de todas as linhas terem sido implementadas. As correções que surgiram durante a verificação final foram seguidas de novas corridas. TEST_RESULTADOS.md registra 1.509 testes unitários, 45 viagens guiadas, 42 viagens padrão, 12 configurações de modo/linguagem e 12 Study 02 configurações passadas, com os limites reais de verificação.

Esses ID operacionais ampliam o feedback P1–P5 na matriz metodológica A: operacional P1–P5 amplia principalmente sua linha P2; P6 expande P4; P7/P8 implementa P3/P5. Eles não atribuem novas observações às pessoas consultadas. Os critérios educacionais e os limites interpretativos permanecem os das matrizes A/B.
