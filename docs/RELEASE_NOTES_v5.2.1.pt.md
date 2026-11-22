# NO AI ACT v5.2.1 — registo detalhado com consentimento

[Italiano](RELEASE_NOTES_v5.2.1.md) · [English](RELEASE_NOTES_v5.2.1.en.md) · [Français](RELEASE_NOTES_v5.2.1.fr.md) · [Deutsch](RELEASE_NOTES_v5.2.1.de.md) · [Español](RELEASE_NOTES_v5.2.1.es.md) · [Português](RELEASE_NOTES_v5.2.1.pt.md)

2026-11-22

Correção V5.2.1: repõe o doctype e os metadados no cabeçalho do documento do jogo, removendo um BOM serializado no corpo. Novos controlos DOM estáticos asseguram o modo padrão e a localização dos metadados. A publicação beta usa o ramo de produção beta e verifica versão e commit.

O jogo acrescenta um registo facultativo por sessão de adultos que consentem: ações, provas, escolhas, comparações, revisões, ajudas e comentários. Partilhar textos guardados no percurso guiado exige consentimento adicional.

Fila por separador, novas tentativas idempotentes, confirmação explícita de eventos recebidos, retirada e apagamento, exportação pessoal e comprovativo privado. Conservação de 90 dias; registo até 24 horas no mesmo separador.

O painel privado mostra sessões e eventos ordenados, com filtros combinados e exportações JSON/CSV. Os agregados históricos mantêm-se separados; corrigem-se os nomes que ocultavam casos concluídos.

Mantêm-se os seis idiomas, 14 casos, gravações v1/v2 e textos acessíveis. Controlos de consentimento e informação de privacidade traduzidos nos seis idiomas.

Os percursos individuais antigos não podem ser reconstruídos a partir dos agregados. Sem garantia de entrega completa, pontuação automática do pensamento crítico, identificação entre visitas ou ativação de Study 02. Sem smoke tests, como solicitado; resultados efetivos no registo da publicação.

[Technical contract / Contratto](v5/SESSION_JOURNAL.md) · [Play](https://www.no-ai-act.eu/play/?lang=pt)
