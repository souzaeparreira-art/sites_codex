# Park Piracicaba — prévia local

## Usar após clonar do GitHub

O site pronto, com todas as fontes e imagens, fica em `site/`. Não precisa de Node, instalação de dependências, chave de API ou geração de imagens para abrir.

Dentro da pasta clonada, execute `python -m http.server 4173 --bind 127.0.0.1 --directory site` e abra http://127.0.0.1:4173.

Para recriar o HTML, execute `python build.py` e depois `python check.py`. O build reutiliza os assets versionados quando os materiais originais da estação de trabalho não estão disponíveis.

Página principal refeita como landing de captura para Aula Experimental. A direção atual usa fundo escuro, azul Park, composição institucional no hero, seções para carreira/viagens/filhos, faixa animada e entradas discretas ao rolar. Os CTAs levam ao bloco de cadastro com apenas nome, WhatsApp e e-mail. O mobile tem CTA fixo que desaparece quando o formulário está visível. Movimento reduzido é respeitado. As páginas institucionais anteriores permanecem disponíveis, mas não participam da navegação principal. Nenhuma publicação foi feita.

Fonte da landing: `landing.html`. CSS e comportamento: `site/landing.css`, `site/modern.css`, `site/light.css`, `site/responsive.css` e `site/landing.js`. A paleta atual é clara; `light.css` preserva a composição aprovada. `responsive.css` ajusta celular e tablet, com pontos de quebra em 1000, 900, 700 e 360px, controles de toque com pelo menos 44px, campos de 16px para evitar zoom automático no iOS e respeito à área segura inferior. O CTA fixo se oculta quando o cadastro aparece ou recebe foco. O hero usa a fotografia inédita `site/assets/img/aula-experimental-original.png`, gerada com a ferramenta integrada image_gen e identificada como ilustrativa. Prompt em `IMAGE-PROMPT.md`. O build copia a landing para `/` e `/aula-experimental/`. Alterações no conteúdo da landing devem ser feitas no arquivo-fonte para não serem perdidas ao reconstruir.

O destino dos contatos continua pendente. O formulário não transmite dados nem simula sucesso enquanto `leadEndpoint` não for configurado. O contrato da landing envia `nome`, `whatsapp`, `email`, `consentimento`, `finalidade`, `versao_privacidade`, `atribuicao`, `pagina_origem` e `data_envio`; campos de curso, investimento e pontuação não fazem parte desta landing. As notas de qualificação abaixo se referem às páginas anteriores, caso sejam retomadas.

## Abrir

Na pasta `C:\Users\wyler\sites-gpt`, execute:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory park-piracicaba/site
```

Acesse http://127.0.0.1:4173. As rotas usam diretórios com `index.html`; abra pelo servidor, não diretamente pelo arquivo. A pasta pública é exclusivamente `site/`. Nunca sirva a raiz do workspace, que contém `.env`.

## Estado e pendências

- A identidade foi extraída da referência fornecida: logos Park, fontes Syncopate e Karla, azul #41AFFF.
- A imagem institucional da rede é identificada como tal. Não há fotos da unidade nem depoimentos fictícios.
- A abertura atual anima elementos gráficos e três momentos de texto. Não é ainda o vídeo gerado: o OpenRouter está inacessível pela rede do executor e FFmpeg não está disponível no PATH.
- Não houve gasto no OpenRouter. A chave fica fora da pasta pública e não é lida pelo site.
- WhatsApp, e-mail, domínio, horários, faixas etárias e detalhes metodológicos estão pendentes. O botão flutuante leva à Aula Experimental enquanto não há WhatsApp confirmado.
- O formulário valida os campos, mas não envia nem guarda dados sem configuração de backend. A interface deixa essa condição explícita. Nenhum horário fictício é oferecido.
- Não há Pixel, GA4 ou GTM ativo. Parâmetros UTM acompanham links internos sem armazenamento local. A integração futura deve considerar as regras de privacidade revisadas.
- As páginas legais são minutas e precisam de revisão. O projeto permanece com `noindex,nofollow` e `robots.txt` bloqueado até aprovação para publicação.
- Canonical, sitemap com URLs absolutas e dados estruturados finais dependem do domínio e dos dados comerciais verificados. Não foi inventado domínio de produção.

## Integração de leads

Defina `leadEndpoint` em `site/config.js` como uma URL relativa para um backend do mesmo domínio. O backend deve validar o esquema e consentimento, limitar requisições, aplicar proteção contra spam e enviar os dados ao destino aprovado. Segredos de Make, CRM, agenda e OpenRouter pertencem às variáveis do servidor.

Contrato: `POST` JSON; retornar status 2xx e `{ "accepted": true }` somente após o destino real aceitar o registro. A interface interpreta isso como solicitação recebida, nunca como agendamento confirmado. O cálculo de pontuação infantil deve acontecer exclusivamente no backend, após confirmação das faixas etárias: 30 pontos pela faixa cadastrada mais 70/35/0 por possibilidade de investimento. Frio 0–39, morno 40–69, quente 70–100. Pontuação adulta ainda pendente. Idade numérica do formulário é provisória; não habilitar pontuação de faixa sem validação comercial.

Google Calendar deve ser consultado pelo servidor antes de exibir horários. Agendamento e evento Schedule dependem da confirmação real do calendário. Lead depende de aceite real do destino. Clique em CTA não é conversão de agendamento.

Se adotar FormSubmit em vez do backend, o primeiro envio exige ativação pelo e-mail do destinatário. Esta prévia não usa FormSubmit automaticamente.

## Desenvolvimento e validação

`python park-piracicaba/build.py` recria o HTML usando os materiais locais enviados, preservando CSS, JavaScript e configuração existentes. O pacote de referência deve continuar disponível no caminho registrado em `brief.json`.

```powershell
node --check park-piracicaba/site/app.js
node --check park-piracicaba/site/config.js
python park-piracicaba/check.py
$env:PYTHONUTF8='1'
python config-codex/skills/site-cinematografico/site-cinematografico/scripts/verificar.py park-piracicaba/site
```

O verificador da skill deve continuar falhando por WhatsApp, e-mail e frames até essas pendências serem resolvidas. Não preencher com dados inventados para fazê-lo passar.

## Checklist antes de publicar

- [ ] Revisar desktop, tablet e celular a 390px; verificar menu, teclado, foco, contraste e largura.
- [ ] Revisar a abertura nos dois sentidos e com movimento reduzido.
- [ ] Substituir a abertura pelos frames do vídeo aprovado e conferir os quadros.
- [ ] Informar WhatsApp/e-mail oficiais; validar todos os destinos.
- [ ] Integrar e testar envio real, erros, timeout, consentimento e proteção contra spam.
- [ ] Configurar pontuação no servidor, Make/CRM e disponibilidade real de agenda.
- [ ] Validar textos comerciais, faixas etárias, fotos e autorizações.
- [ ] Revisar documentos legais com dados finais da operação.
- [ ] Configurar domínio, canonical, sitemap, HTTPS e Search Console.
- [ ] Configurar rastreamento autorizado; verificar que Schedule ocorre só após agendamento real.
- [ ] Medir Core Web Vitals e acessibilidade no ambiente publicado de homologação.
- [ ] Retirar a barra de prévia e liberar indexação apenas após validação.

A tentativa de captura automática no Chrome foi bloqueada pelas permissões do ambiente. Não há screenshots nem resultados de Core Web Vitals verificados nesta entrega.

Crédito e assinatura Labrego IA preservados.
