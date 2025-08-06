# 🎬 Golden Raspberry Awards API

API RESTful desenvolvida para leitura da lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards, conforme desafio técnico da Outsera.
Ao iniciar, o CSV Movielist.csv será automaticamente lido e os dados carregados no banco em memória via SQLite.

---

## 📦 Tecnologias utilizadas

- [Node.js](https://nodejs.org/) (v20.11.1)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/) com banco **SQLite** (em memória)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest) (para testes de integração)

---

## 🚀 Como rodar o projeto

1. **Clone o repositório**

˜˜˜bash
git clone https://github.com/seu-usuario/golden-raspberry-awards-api.git
cd golden-raspberry-awards-api
˜˜˜

2. **Instale as dependências**

˜˜˜bash
npm install
˜˜˜

3. **Execute a aplicação**

˜˜bash
npm run start:dev
˜˜˜