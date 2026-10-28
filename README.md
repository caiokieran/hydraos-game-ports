# HydraOS Game Repository

Este repositório publica cinco ports para LG webOS TV ARM32 e seus IPKs: OpenJK / Jedi Academy, DevilutionX, Half-Life, OpenLara e OpenMoHAA / Medal of Honor: Allied Assault. O HydraOS Launcher fica no repositório separado [caiokieran/hydraos-launcher](https://github.com/caiokieran/hydraos-launcher).

## Adicionar ao HydraOS

Na TV, abra **Configurações → Fontes de jogos** e adicione:

```text
https://github.com/caiokieran/hydraos-game-ports
```

O catálogo traz metadados de capa, imagem de fundo, descrição, gênero, desenvolvedor e ano, além de versão, IPK e SHA-256. O Hydra possui uma lista integrada e habilita downloads quando uma fonte com os arquivos necessários é adicionada.

O Jedi Academy inclui quatro arquivos PK3 no Git LFS. Os demais ports ainda dependem de dados originais separados. O app dos IPKs é preparado como `visible: false`, então não cria um tile na tela inicial do webOS; o Hydra ainda o inicia por ID.

As imagens são vinculadas às fontes originais: Steam para Half-Life e Tomb Raider; LaunchBox Games Database para Medal of Honor: Allied Assault; SteamGridDB (AdventureDarkest e LeeLevLiveath) para as capas de Jedi Academy e Diablo; Igromania e Blizzard Press Center para as respectivas imagens de fundo.

## Arquivos e manutenção

- `repo.json`: o catálogo principal, com metadados, caminhos e hashes. `catalog.json` permanece como cópia de compatibilidade.
- `games/*.ipk`: pacotes ARM32, separados do Launcher.
- `scripts/hide-launchpoints.py`: oculta o launchpoint do webOS, normaliza os cabeçalhos ar e o marcador IPK e atualiza hashes dos pacotes.
- `refresh-catalog.cjs`: verifica hashes e compatibilidade ARM do catálogo.
- `JediAcademy/data/base/`: os dados de Jedi Academy distribuídos via Git LFS.

Verifique as licenças dos ports e as condições de redistribuição dos respectivos projetos antes de redistribuir os IPKs.
