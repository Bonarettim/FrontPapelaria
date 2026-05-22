# 🛒 Frontend: Sistema de Gestão de Papelaria

Interface desenvolvida para consumir a API de gestão de vendas e comissões, focada em uma experiência de usuário fluida, componentização e tratamento de estado eficiente.

## 🚀 Tecnologias e Ferramentas
* **Framework:** React/Next.js (ajuste conforme o que você usou)
* **Linguagem:** TypeScript
* **Gerenciamento de Estado:** (ex: Redux Toolkit / React Query / Context API)
* **Estilização:** (ex: Tailwind CSS / Styled Components)
* **Consumo de API:** Axios

## 🛠️ Critérios de Avaliação Implementados
* **Componentização:** Interfaces divididas em componentes reutilizáveis e desacoplados.
* **State Management:** Gerenciamento centralizado de estado para evitar prop-drilling e otimizar re-renderizações.
* **API Handling:** Camada de serviço isolada para chamadas HTTP com tratamento de erros centralizado.
* **Navegação:** Roteamento eficiente mantendo o estado da aplicação.
* **TypeScript:** Tipagem estrita de todas as entidades (Vendedores, Vendas, Produtos) para garantir robustez.

## ⚙️ Como rodar o projeto
1. Clone o repositório: `git clone https://github.com/Bonarettim/FrontPapelaria.git`
2. Instale as dependências: `npm install` (ou `yarn install`)
3. Configure as variáveis de ambiente (ex: URL da API): Crie um arquivo `.env` baseado no `.env.example`
4. Inicie a aplicação: `npm run dev`

## 📝 Relatório de Desenvolvimento

### O que foi feito:
- Implementação da listagem de vendas e vendedores.
- Integração com o endpoint de relatório de comissões.
- Criação de hooks customizados para chamadas de API.
- Padronização de tipos com TypeScript.

### Plano de Melhorias (Roadmap):
- [ ] Implementação de testes unitários com Jest/React Testing Library.
- [ ] Adição de filtros avançados por data e vendedor no dashboard.
- [ ] Implementação de paginação infinita para listas extensas.
- [ ] Adição de Dark Mode e melhorias de UX/UI.

## 👨‍💻 Autor
Matheus Bonaretti Simões