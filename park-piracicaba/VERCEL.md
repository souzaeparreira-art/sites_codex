# Vercel — Park Piracicaba

## Configuração pronta

- Repositório: `souzaeparreira-art/sites_codex`
- Branch: `main`
- Root Directory no Vercel: `park-piracicaba`
- Framework Preset: `Other`
- Build Command: vazio (desabilitado)
- Install Command: vazio (desabilitado)
- Output Directory: `site`
- Variáveis de ambiente: nenhuma necessária para a landing estática.

`vercel.json` já define framework, comandos e diretório público. Não publique a raiz do repositório como pasta estática. O site só precisa dos arquivos de `site/`.

## Conectar

Importe o repositório no painel Vercel e configure Root Directory como `park-piracicaba`. A integração GitHub deve ter acesso ao repositório `sites_codex`. Depois do primeiro deploy, novos commits na branch de produção podem gerar atualizações automaticamente.

Alternativamente, com Vercel CLI autenticado, execute dentro da pasta `park-piracicaba`:

```sh
vercel link
vercel deploy
```

Confira a URL retornada. Para produção, use `vercel deploy --prod` após a revisão.

## Estado da landing

O formulário ainda aguarda conexão com destino real para receber leads. A configuração de hospedagem não ativa essa integração. Textos legais continuam em revisão e a indexação está bloqueada intencionalmente. A chave OpenRouter não é necessária para hospedar a página e não deve ser adicionada ao frontend.

## Referências oficiais

- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/projects/deploy-from-cli

O endereço solicitado `https://vercel.com/get-started.md` foi tentado, mas a ferramenta web recusou `text/markdown`; o acesso direto pela rede local foi bloqueado. As instruções acima usam a documentação oficial equivalente.
