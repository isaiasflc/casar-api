<p align="center">
  <a href="https://www.casar.com/">
    <img src="https://s3-sa-east-1.amazonaws.com/casarpontocom-inspiracoes/wp-content/uploads/2016/11/casar.com_.png" height="343" width="647" alt="Unform" />
  </a>
</p>

## Descrição do Projeto
<p>A Casar APi é uma API RESTful construída utilizando o framework NestJS. Ela simula uma rede social simples, similar ao Twitter, onde os usuários podem criar postagens, realizar re-postagens e interagir com postagens de outros usuários. Além disso, a API faz uma integração com um serviço de análise de sentimentos para classificar as postagens como positivas, negativas ou neutras.</p>
<p>🚀 Usei a linguagem de programação Typescript e o framework NestJS para desenvolver a API. Separei as camadas Controller, Services, Repository e provider para APIs externas.</p>
<p>🚀 Usei jest para teste unitario.</p>
<p>🚀 Usei Docker-Compose para Dockerizar a aplicação.</p>
<p>🚀 Usei banco de Dados PostgreSQL e o seu ORM para Typescript chamado typeorm, fiz com ele mapeamento de tabela e execução de querys.</p>

Tabela de conteúdos
=================
<!--ts-->
   * [Pre Requisitos](#pre-requisitos)
   * [Rodando o Back End](#-rodando-o-back-end)
   * [Rodando os Testes](#-rodando-os-testes)
   * [Tecnologias](#tecnologias)
   * [Lista de Rotas](#lista-de-rotas)
   * [O que poderia Melhorar ](#o-que-poderia-melhorar)
<!--te-->

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Docker](https://www.docker.com/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone <https://github.com/isaiasflc/casar-api>

# Acesse a pasta do projeto no terminal/cmd
$ cd casar-api

# Instale as dependências
$ npm install

# Execute a aplicação pelo docker
$ docker-compose build
$ docker-compose up

# O servidor inciará na porta:3000 - acesse <http://localhost:3000/>
```

### 🎲 Rodando os Testes 

```bash
# Acesse a pasta do projeto no terminal/cmd
$ cd casar-api

# Instale as dependências caso nao tenha instalado ainda
$ npm install

# Execute os teste como o comando 
$ npm run test

```

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/pt-BR/)
- [Docker](https://www.docker.com/)

### Lista de Rotas

<p>Criar um post</p>

     curl --location --request POST 'http://localhost:3000/post/{userId}' \
      --header 'Content-Type: application/json' \
      --data-raw '{
          "content": "string",
          "comment": "string",
          "originalPostId": 0
      }' 

<p>Obter postagens de um usuario. Usado quando algum usuario for visitar o perfil de outro usuario. O userId fornecido como parametro corresponde ao usuario visitado.</p>
    <span>O userId fornecido como parametro corresponde ao usuario visitado, limit é a quantidade de posts que serão retornada e o page indica a pagina que queremos buscar.</span>

    curl --location 'http://localhost:3000/post/:userId?limit=5&page=1' \

<p>Obter todas as postagens. Usado quando algum usuario está em seu feed.</p> 
    <span>**userId** fornecido como parametro corresponde ao usuario do feed</span><br> 
    <span>**limit** é a quantidade de posts que serão retornada;</span><br>
    <span>**page** indica a pagina que queremos buscar.</span><br>
    <span>**following** um booleano para controlar a busca de postagens, se true retornar só postagens dos usuarios que sigo, se false retornar todas as postagens existentes.</span><br>
    
    curl --location 'http://localhost:3000/post/:userId?limit=5&page=1' \

### O que poderia melhorar
    
    1- Adiconar mais logs a aplicação.
    2- Documentar a api com swagger.
    3- Fazer os teste de Stress e cobertura.
