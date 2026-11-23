# V5.2 — Diário de sessão individual voluntário

[Italiano](../SESSION_JOURNAL.md) · [English](../en/SESSION_JOURNAL.md) · [Français](../fr/SESSION_JOURNAL.md) · [Deutsch](../de/SESSION_JOURNAL.md) · [Español](../es/SESSION_JOURNAL.md) · [Português](../pt/SESSION_JOURNAL.md) · [Nederlands](../nl/SESSION_JOURNAL.md)

> Edição linguística V5.4.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em sete línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.


22 Novembro 2026. Implementa o pedido posterior do proprietário para estender a coleta para além dos agregados. A restrição anterior aos dados agregados permanece no dossiê histórico do V5.0. O protocolo Study 02 está inalterado. Esta tradução descreve o mesmo serviço existente, sem estender sua coleção.

## # Evidências disponíveis

Somente após o consentimento de um adulto: um identificador aleatório de sessão de tabulação, versão, canal (produção; beta em registos históricos), linguagem e modo iniciais, dificuldade, caminho selecionado e público; eventos com UUID, sequência, tentativa, caso, fase, tempo declarado pelo cliente, tempo decorrido e tempo de recebimento do servidor. O orçamento de minutos selecionado está incluído; não é tempo de jogo real decorrido. A versão da sessão é a versão no início.

| Acção | Gravar | Limite interpretativo |
|---|---|---|
| Abertura, início, retomar, navegação | Evento e contexto | Abertura não estabelece leitura |
| Exposições | Índice, aberto/citado, adições/remoções e estado de projecto | Nenhuma medida de atenção |
| Comparação | Par de índices exibidos | Não estabelece uma correlação correta |
| Decisões | Classificação, medida, ator, razão, citações, confiança | Os dados declarados pelo cliente podem ser manipulados |
| Incidente | Opção canônica, incluindo seleção de teclado | Não mede uma disposição ética estável |
| Relatório | Escolhas assinadas e resultado interno | Resultado do jogo, competência não validada |
| Caminho guiado | Hipótese salva/revisada, relações adicionadas/removidas, contagem de campo e revisão | Contagens não são qualidade de raciocínio |
| Argumento | Apresentação antes do feedback distinguido da reflexão posterior | Sem pontuação crítica-pensamento |
| Verificação automática | Contagens do exercício opcional pré/pós | Nenhuma validação externa implícita |
| Ajuda, tutorial, feedback, revisão, acessibilidade | Eventos antes da redução pelo adaptador agregado | O uso não estabelece a aprendizagem |
| Actividade | Batimento cardíaco com visibilidade, foco e atividade recente | Uma estimativa, sem acompanhamento ocular |

Um **segundo consentimento**, inicialmente não selecionado, permite instantâneos de escrita guiada salva: hipóteses, avaliações de fonte, razões para relações/revisões, argumento, reflexão e plano de transferência. Não são gravadas nenhumas teclas individuais. Um campo por evento, no máximo 1.200 caracteres; criptografia do servidor AES-GCM. A interface pede às pessoas que evitem dados pessoais ou sensíveis. A escrita não recebe avaliação automática.

Não são adicionados nomes, e-mails, endereços IP de nível de aplicação, agentes de utilizador, impressões digitais, localização, publicidade ou links entre visitas/classes. A revista é **pseudonymous**, não descrito como anônimo.

## # Consentimento e direitos

O convite está disponível em IT/EN/FR/DE/ES/PT-PT. A recusa não remove as funcionalidades do jogo. Antes do consentimento, nenhuma sessão do servidor é criada e nenhum evento do diário está em fila. O histórico de gravação anterior não foi carregado. A mesma aba pode retomar seu diário por 24 horas, inclusive após recarregar; o consentimento não leva para outra visita ou guia. Menores podem jogar e não são convidados a ativar o periódico individual.

A fila, recibo e credencial privada usam a sessão de tabulaçãoStorage. Exportação pessoal distingue eventos recebidos de eventos pendentes locais. O recibo para download contém uma chave de acesso e deve permanecer privado. Ele pode ser reaberto para exportar ou apagar após o fechamento da aba; ele não reinicia a gravação. Sem o recibo após fechar a aba, o controlador pode não ser capaz de encontrar o registo correto porque nenhuma identidade pessoal é mantida.

A retirada imediatamente interrompe a recolha. A rasura off-line é mostrada como **pendente**, não completa; o cliente repete. Desativar estatísticas na barra de jogo também revoga a revista. DNT/GPC previne a ativação; se detectado mais tarde, eles param de gravar e solicitam o apagamento.

Os registos tornam-se inacessíveis 90 dias após o consentimento e são removidos por limpeza diária. A retirada remove todos os eventos e o registo da sessão. Apenas um recibo técnico permanece até o mesmo termo de validade: UUID, hash credencial, datas de revogação e expiração, para rejeitar resubmissões atrasadas.

Base jurídica: autorização nos termos do n.º 1, alínea a), do artigo 6.º do RGPD. Controlador: Matteo Angeloni; os contatos aparecem nas páginas do autor. O Cloudflare fornece aos trabalhadores/D1 e processa metadados de conexão para entrega e segurança. A base de dados existente está configurada na jurisdição da UE, o que não garante o anonimato nem a ausência de transferências em toda a infra-estrutura. [Notificação de privacidade em sete línguas](https://www.no-ai-act.eu/game-statistics.html).

O objetivo é corrigir e melhorar os suportes de jogabilidade e aprendizagem. A janela de 90 dias suporta comparações entre iterações sem um arquivo individual indefinido. O consentimento não autoriza uma recolha independente ou desproporcionada: as Orientações da EDB 05/2020, ponto 5, mantêm a necessidade, a proporcionalidade e os princípios do artigo 5.º do RGPD. A coleção não se estende à navegação externa, chamada identificação, impressão digital ou pedidos de dados sensíveis do jogador.

## # Contrato técnico

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` usam o mesmo coletor de produção. O host anterior `beta.no-ai-act.eu` retém API e apenas a compatibilidade de recebimento baixado; o jogo beta é aposentado e redirecionado para estável. Sem migração ou eliminação de dados.

Origem estável e histórica, solicitações limitadas do JSON POST, sem credenciais em URLs, sem cookies, loging de carga útil desabilitado. Migração 0007 acrescenta quatro quadros sem reescrever contadores anteriores. Apenas um hash da credencial privada é armazenado no banco de dados. `JOURNAL_TEXT_KEY` permanece fora do código e idêntico em ambos os Trabalhadores; é necessário criptografar/ler escrita. Perdê-lo torna a escrita ilegível. Não exclua ou gire sem preservar as chaves ainda necessárias. Esta criptografia não é de ponta a ponta: o servidor pode descriptografar as exportações autorizadas.

IDs imutáveis, reconhecimento explícito de eventos individuais, tentativas idempotentes e uma fila que sobrevive ao reload da aba. Limites: 30.000 bytes por pedido, 40 eventos por lote, 10.000 eventos por sessão, 1.4 MB fila de clientes; 5.000 novas sessões e 50.000 eventos por dia. Os limites da taxa de ingestão por sessão aplicam-se. As quotas podem tornar a cobertura incompleta. Keepalive não pode garantir a entrega quando o navegador fecha, a rede falha, o armazenamento é negado ou a janela de 24 horas expira.

O painel privado Cloudflare Access-protegido mostra **sessões individuais** primeiro: filtros combinados, canal, versão, recebeu contagem e consentimento de escrita. Linguagem/modo filtrar o contexto inicial; o caso seleciona as sessões que contêm um evento para esse caso. Páginas contêm 50 sessões, timelines progressivos carregar 200 eventos, exportação JSON/CSV está disponível. A revista privada não tem limite de 10. Ele mostra lacunas antes da última sequência, mas não pode revelar uma fila final nunca recebida.

## # Registros históricos e valores indisponível

`usage_case_completed`, `usage_case_left`, `usage_session_completed` são reconciliados com nomes canônicos na visão histórica. Foram removidas as solicitações de dimensões ausentes da infraestrutura. Registros históricos retêm agregação e limiares: sequências, resultados e timings descartados pelo adaptador **não podem ser reconstruídos**. Os dados em falta não são substituídos por zeros, estimativas ou eventos inventados.

## # Verificação e limites abertos

A verificação do cliente/servidor gravado V5.2 com SQLite real para consentimento, seis idiomas, todos os 14 IDs de caso, propriedades exatas, repetições, conflitos de sequência, recarga, expiração, criptografia, acesso não autorizado, exportação, raças de retirada e ingestão offline, quotas e retenção. Também cobriu regressão, tipos cliente/trabalhador, compilação, SEO e distribuição. Essas execuções são históricas; esta tradução não relata novas execuções de testes.

Não foram realizados testes de fumaça ou navegador para essa versão, conforme solicitado. Por conseguinte, a verificação visual e assistiva em dispositivos reais permanece limitada. A revisão linguística especializada, a revisão de privacidade específica do contexto, qualquer caminho futuro para menores e a pesquisa educacional com instrumentos validados permanecem abertas. Nenhum endosso de Alvarez/Pelizzari e nenhuma ativação de Study 02.

## # Fontes consultadas na pesquisa anterior

- [GDPR consolidado](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [Orientações de consentimento do EDPB](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB ePrivacy n.º 3 do artigo 5.º](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Orientações do Garante sobre rastreamento](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1 localização de dados](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Limitação da taxa de Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: inspiração semântica sem alegar conformidade com xAPI.
