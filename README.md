# Homelab monitor API

![GitHub last commit](https://img.shields.io/github/last-commit/anselmosz/homelab-monitor-api)
![GitHub repo size](https://img.shields.io/github/repo-size/anselmosz/homelab-monitor-api)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![Express](https://img.shields.io/badge/express-5.x-blue)
---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivo](#objetivo-do-sistema)
- [Funcionalidades](#funcionalidades-atuais)
- [Arquitetura](#arquitetura-do-projeto)
- [Tecnologias](#tecnologias-utilizadas)
- [Endpoints](#endpoints-da-api)
- [Como rodar o projeto](#como-executar-o-projeto)

---

## Sobre o projeto

API de coleta de métricas de sistema (memória, armazenamento, uptime) do homelab rodando em Termux, servindo como camada de dados para um painel de monitoramento local.

## Objetivo do Sistema

Fornecer, via API REST, dados em tempo real sobre o estado do dispositivo (recursos de sistema e status de serviços), consumidos por um painel visual local, sem exposição fora da rede doméstica.

---

## Funcionalidades atuais

Atualmente a aplicação possui os seguintes recursos implementados:

### System

* Leitura de uso de memória RAM (total, usado, disponível, percentual)
* Leitura de uso de armazenamento (total, usado, disponível, percentual)
* Leitura de tempo de atividade do dispositivo (uptime)

### Services

* Validação do status e atividade do SSH no Termux

---

## Arquitetura do projeto

O projeto segue uma arquitetura em camadas:

```
Controller
↓
Service
↓
Fonte de dados (leitura de arquivo `/proc` ou invocação de comando externo)
```

### Responsabilidade de cada camada

**Controllers**

* Recebem requisições HTTP
* Retornam respostas

**Services**

* Contém a lógica do domínio
* Realiza a execução de comandos no shell do computador

### Estrutura usada no projeto

O sistema é organizado em módulos baseados em domínios com responsabilidade isoladas na aplicação.

```
src
 ├ config
 ├ middlewares
 ├ modules
 │   ├ system
 │   ├ services (será implementado)
 │   └ network (será implementado)
 └ utils 
```

### Responsabilidade de cada domínio

#### System

Responsável por:

* Ler `/proc/meminfo` e `/proc/uptime`, converter valores brutos (segundos, KB) em algo legível (dias/horas, GB)

#### Services

Responsável por:

* Verificar se processos como `sshd` estão rodando, e futuramente se a própria API responde

#### Network

Responsável por:

* Obter o IP local e status de conectividade

---

## Tecnologias utilizadas

#### Linguagens

* Javascript

#### Backend

* Node.js
* Express

#### Banco de dados

* SQLite (será implementado futuramente)

#### Outras dependências

* dotenv
* cors

---

## Endpoints da API

### System

| Método | Endpoint        | Descrição                                              |
| ------ | --------------- | ------------------------------------------------------ |
| GET    | /system/memory  | Realiza a leitura de dados sobre uso de RAM do homelab |
| GET    | /system/storage | coleta dados sobre uso do armazenamento do homelab     |
| GET    | /system/uptime  | Retorna a quanto tempo o dispositivo está em execução  |

### Services

| Método | Endpoint        | Descrição                                    |
| ------ | --------------- | -------------------------------------------- |
| GET    | /services/ssh   | Retorna o status de atividade do serviço SSH |

---

## Como executar o projeto

Para executar este projeto é necessário que seu PC tenha os seguintes recursos:

- Node.js >= 18
- npm

### 1.) Clonar o repositório e instalar dependências

```bash
git clone https://github.com/anselmosz/homelab-monitor-api

cd homelab-monitor-api

npm install
```

### 2.) Configurar variáveis de ambiente

Antes de executar o projeto, crie um arquivo `.env.development` e o edite.

```bash
touch .env.development
nano .env.development
```

Esse arquivo é utilizado pela aplicação Node.js para configurar o ambiente de desenvolvimento, ex:

```
PORT=4000
NODE_ENV=development
STORAGE_PATH=/data
```
#### Descrição das variáveis

| Variável         | Descrição                                                    |
| ---------------- | ------------------------------------------------------------ |
| PORT             | Porta onde a aplicação estará rodando                        |
| NODE_ENV         | Tipo de ambiente que estará sendo executado                   |
| STORAGE_PATH     | Caminho para o disco que seus sistema usa como armazenamento |

#### Executar o projeto chamando o arquivo `.env.development`:

```bash
npm run dev
```

### Problemas comuns

#### Erro de diretório não encontrado ao executar o endpoint GET/system/storage

Verifique se o valor de `STORAGE_PATH` está correto e apontando para o local que sua distro usa como armazenamento.

#### Campo `available: false` no retorno de /system/uptime

Algumas versões do Android restringem, via SELinux, a leitura de `/proc/uptime` por apps sem privilégios elevados (como o Termux). Quando isso ocorre, o endpoint retorna `available: false` em vez de falhar — não há solução sem acesso root ao dispositivo.