# KRR Reparações

Aplicativo mobile para gerenciamento de serviços de reparação automotiva.

## Funcionalidades

- Dashboard com valor total dos serviços
- Listagem de serviços agrupados por mês
- Adição de novos serviços
- Edição de status dos serviços
- Geração de relatórios mensais
- Armazenamento local dos dados

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas em macOS)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd KRR_Reparacoes
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o projeto:
```bash
npm start
# ou
yarn start
```

4. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR code que aparecerá no terminal.

## Estrutura do Projeto

```
KRR_Reparacoes/
├── src/
│   ├── screens/
│   │   ├── Dashboard.js
│   │   └── AddService.js
│   ├── utils/
│   │   └── storage.js
│   └── components/
├── App.js
└── package.json
```

## Tecnologias Utilizadas

- React Native
- Expo
- AsyncStorage
- React Navigation
- Expo File System
- Expo Sharing
- React Native Picker Select

## Como Usar

1. Ao abrir o aplicativo, você será direcionado para o Dashboard
2. Para adicionar um novo serviço, clique no botão "Adicionar Serviço"
3. Preencha todos os campos obrigatórios
4. Para editar o status de um serviço, clique no ícone de caneta ao lado do status
5. Para gerar um relatório mensal, selecione o mês desejado e clique em "Gerar Relatório"

## Suporte

Para suporte ou dúvidas, entre em contato através de [SEU_EMAIL]. 