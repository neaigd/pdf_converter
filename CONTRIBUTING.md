# Contribuindo com este projeto

Obrigado por contribuir! Siga este fluxo de trabalho para garantir qualidade e organização do código.

## Fluxo de Branches

- `main`: branch estável, recebe apenas código testado e aprovado.
- `development`: branch de integração. Aqui entram Pull Requests (PRs) de features, bugs e melhorias.
- Para cada nova feature, bug ou ajuste, crie um novo branch a partir de `development`:
  - Exemplo: `feature/nome-da-feature`, `fix/corrige-bug`.

## Pull Requests

- Sempre abra PRs para `development`, nunca diretamente para `main`.
- Garanta que o workflow de CI (lint, testes e build) passe sem erros antes do merge.
- Descreva claramente o que foi alterado no PR.

## Workflows automatizados

- Todo push e PR para `main` ou `development` executa:
  - Lint (`npm run lint`)
  - Testes (`npm test`)
  - Build (`npm run build`)
- Se algum desses passos falhar, corrija antes de solicitar revisão.

## Dicas

- Use nomes descritivos e padronizados para seus branches.
- Commits pequenos e frequentes facilitam a revisão.
- Consulte o README para instruções de instalação e uso.

Se tiver dúvidas, abra uma issue!