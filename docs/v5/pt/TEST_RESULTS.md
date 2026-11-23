# Verificação final da cobertura metodológica V5

[Italiano](../TEST_RESULTS.md) · [English](../en/TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md) · [Deutsch](../de/TEST_RESULTS.md) · [Español](../es/TEST_RESULTS.md) · [Português](../pt/TEST_RESULTS.md) · [Nederlands](../nl/TEST_RESULTS.md)

> Edição linguística V5.4.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em sete línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.


21 Novembro 2026. Relatório de protótipos anterior ao lançamento do V5.0.0. Os testes começaram após a implementação de toda a lista operacional em COVERAGE_COMPLETION.md; as correções foram seguidas por novas execuções. Estes resultados dizem respeito ao clone local. As verificações de publicação são documentadas separadamente na versão. Esta tradução registra as execuções anteriores; não é uma nova execução de teste de fumaça para V5.0.1.

| Verificar | Resultado observado |
|---|---|
| TipoScript | PASS, incluindo a compilação após a correção da janela |
| Conjunto de Vitest | 1.509 testes em 95 arquivos, todos passaram |
| Vite build | Aviso PASS; tamanho do jogo, aproximadamente 1,83 MB minimizado |
| Auditoria de SEO | 155 rotas, sem defeitos críticos ou advertências |
| Verificação da distância | 155/155 rotas, sem caracteres corrompidos no HTML e sem formulário externo de recolha |
| Caminho guiado | Passaram 45 viagens: todos os 14 casos × IT/EN/FR mais três perfis de layout |
| Regressão por catálogo | 42 viagens padrão passaram, resultados corretos e relatórios restaurados após recarga |
| Modos | Shift, Livre, Surpresa, Revisão × três idiomas: 12 configurações passadas |
| Study 02 | Dois formulários × três idiomas × PRE/POST: 12 configurações passadas |
| Dados do jogo | Marcadores sintéticos em hipóteses, fontes, relações e reflexões ausentes do localArmazenamento e telemetria; recarga limpa notas |
| Study 02 dados | Sem cookies ou armazenamento do navegador; cópia local explícita somente; POST rejeitado com 405; materiais excluídos da construção pública |

## # O que a viagem guiada cobre

Cada viagem começa a partir do caso, completa três paradas introdutórias, preserva a primeira hipótese, abre documentos com as chaves reais do jogo e cita evidências. No caderno, reler uma fonte, anotar proveniência e limites, registrar duas revisões fundamentadas e uma relação explicada. Clicar e digitar dentro da janela não deve alterar a seleção de exibição subjacente.

O teste continua através do lembrete metodológico, quatro decisões e assinatura. Introduzir uma nova linha na nota não deverá assinar. Confirmação corrige o texto antes do relatório; tentativas posteriores não podem alterá- lo. Debrief distingue nota anterior, regra, reflexão, uso de feedback e um novo plano de caso. A síntese da sessão inclui todos os casos guiados. Recarregar limpa o novo estado temporário. Nenhuma solicitação externa ou POST é permitida durante o teste de fumaça.

Perfis: IT 1920×1080 e 320×800; EN 390×844 e 640×360; FR 390×844 e 3840×2160. Verifica o foco da capa, Tab, Escape, entrada multilinha e ausência de transbordamento de diálogo. O teste 4K final usa Direct3D11 na Intel Iris Xe; a infra-estrutura detectada é registrada em JSON. Os outros cinco perfis usam SwiftShader. Isto não constitui testes com dispositivos físicos, teclados na ecrã ou leitores de ecrã reais.

Os 14 casos são selecionados por fixture; exposições, decisões e assinatura usam a interface real. Isto confirma os resultados do motor existentes, não a compreensão participante ou a precisão jurídica independente da chave de resposta.

## # Correcções e limites técnicos

1. Vite's watcher poderia observar um download de teste ainda bloqueado pelo Windows, causando EBUSY. As pastas de artefactos e de imagens locais estão agora excluídas. O catálogo completo e o caminho guiado passaram pela nova execução.
2. Phaser também ouve os eventos do mouse na janela: clicar no diálogo nativo pode alterar uma citação. A janela desactiva temporariamente a entrada da cena e pára a propagação do ponteiro, do rato e do toque. O teste reproduz a caixa de crédito e verifica a seleção da exposição inalterada em todas as 45 viagens finais.
3. A verificação de formulários externos escaneou a pasta crescente de artefato sintético e cronometrou. Ele agora exclui exatamente scripts/smoke/out, que não é enviado fonte. Verificações de fonte pública e dist permanecem ativas; a suíte final passou por 1.509 testes.
4. A inicialização 4K somente de software nativo ultrapassou 90 segundos no Pré-carregamento existente. O diagnóstico Direct3D11 atingiu o título em aproximadamente 5,6 segundos, e toda a jornada final de 4K, incluindo a recarga, passou. O tempo limite de software continua a ser uma limitação dessa configuração e não é reivindicado fixo. O motor de renderização não foi alterado.

## Study 02

As doze configurações verificam quatro fontes por formulário, ausência de opções de resposta, argumento livre, bloqueio de submissão, debrief indisponível antes da submissão, sete linhas de observação e seis dimensões codificadas por humanos. Não observado permanece distinto de 0. Não há nenhuma correção total ou automática. A cópia do JSON inclui texto submetido e notas explícitas sem identificadores de participante. Os testes usam apenas texto sintético.

## # Reprodução

No clone local, use os comandos listados em METODOLOGIA_IMPLEMENTATION.md. Para reproduzir 4K nesta máquina Windows, defina CROMIUM_PATH para Chrome instalado e INQUÉRITO_4K_GPU=d3d11. INQUÉRITO_ONly e INQUÉRITO_CASE são filtros de diagnóstico; a verificação original completa não os usou. JSON relata viewport de registo, idioma, caso e renderizador real.

## # A validação humana ainda é necessária

A cobertura funcional de feedback é implementada e verificada nas configurações indicadas. Eficácia educacional, qualidade do argumento, equivalência de formulários, traduções, precisão legal para administração e acessibilidade de tecnologias assistivas exigem os controles humanos do protocolo. Não foi realizado nenhum estudo participante. Nenhum resultado do jogo se torna uma pontuação de pensamento crítico automático. Na fase registrada aqui, este incremento ainda não tinha sido publicado para a produção.
