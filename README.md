# HydraOS Game Repository

Este repositório contém somente o port **OpenJK / Star Wars: Jedi Academy** para LG webOS TV ARM32, seu IPK e o catálogo. **Não contém o HydraOS Launcher nem os arquivos de dados originais do jogo.** O launcher está no repositório separado [caiokieran/hydraos-launcher](https://github.com/caiokieran/hydraos-launcher).

## Adicionar ao HydraOS

Na TV, abra **HydraOS → Configurações → Fontes de jogos** e adicione este endereço HTTPS:

```text
https://raw.githubusercontent.com/caiokieran/hydraos-game-ports/main/catalog.json
```

O catálogo lista o IPK do OpenJK. O HydraOS Launcher atual consegue carregar e exibir os jogos do catálogo adicionado; o download e a instalação de IPKs pelo catálogo ainda precisam ser implementados. Depois de instalar o OpenJK, os dados originais devem ser fornecidos pelo usuário em uma unidade USB, na pasta `JediAcademy/data/base/`. O diretório `JediAcademy/` neste repositório é só um guia de estrutura, sem conteúdo proprietário.

## Arquivos

- `catalog.json`: índice do OpenJK e hash SHA-256 do IPK.
- `catalog.template.json`: formato para acrescentar outros ports no futuro.
- `games/openjk012.ipk`: pacote ARM32 do OpenJK.
- `JediAcademy/`: instruções de onde colocar os dados originais no USB; nenhum dado do jogo está incluído.
- `refresh-catalog.cjs`: valida os metadados e atualiza os hashes.

O IPK é um port de terceiros e depende de dados originais de Jedi Academy. Verifique as licenças e as condições de redistribuição do OpenJK antes de redistribuir o pacote.
