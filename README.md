# HydraOS Game Repository

Este repositório publica cinco ports para LG webOS TV ARM32 e seus IPKs: OpenJK / Jedi Academy, DevilutionX, Half-Life, OpenLara e OpenMoHAA / Medal of Honor: Allied Assault. O HydraOS Launcher fica no repositório separado [caiokieran/hydraos-launcher](https://github.com/caiokieran/hydraos-launcher).

## Adicionar ao HydraOS

Na TV, abra **Configurações → Fontes de jogos** e adicione:

```text
https://raw.githubusercontent.com/caiokieran/hydraos-game-ports/main/catalog.json
```

O catálogo traz metadados de capa, descrição, gênero, desenvolvedor e ano, além de versão, IPK e SHA-256. O Hydra mostra somente jogos publicados em fontes que você adicionou, com **Download** quando não instalado, e **Jogar** e **Remover** quando instalado. A opção de atalho na biblioteca do Hydra é independente.

Os cinco ports atuais precisam de arquivos de dados originais, fornecidos pelo usuário. Nenhum dado comercial está incluído. O app dos IPKs é preparado como `visible: false`, então não cria um tile na tela inicial do webOS; o Hydra ainda o inicia por ID.

## Arquivos e manutenção

- `catalog.json`: os cinco ports, capas, descrições, caminhos e hashes.
- `games/*.ipk`: pacotes ARM32, separados do Launcher.
- `scripts/hide-launchpoints.py`: oculta o launchpoint do webOS e atualiza hashes dos pacotes.
- `refresh-catalog.cjs`: verifica hashes e compatibilidade ARM do catálogo.
- `JediAcademy/`: exemplo da estrutura USB para os dados do Jedi Academy.

Verifique as licenças dos ports e as condições de redistribuição dos respectivos projetos antes de redistribuir os IPKs.
