# SINF

## Final Result

![UML](https://github.com/dolfander/sinf-feup/blob/master/tech4u.png)

### Install Node
```
sudo apt update
sudo apt install nodejs
sudo apt install npm

nodejs -v 

```
### Install Mongodb
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition-using-deb-packages

### Run app
```
cd app
npm install
sudo service mongod start
npm start

```
* localhost:3000

### Manage Mongodb database
```
mongo
use tech4u
db.users.find()
db.users.remove({})
db.dropDatabase()
```

### To Do


- [x] Retificar estrelas de score
- [x] Mudar pagina do historico
- [x] Client Orders - profile page 
- [x] Criar página - Orders
- [x] Client Orders - show products - mostrar produtos de uma encomenda especifica
- [x] Criar Order (encomenda) - no final do processo do carrinho
- [x] Mostrar best sellers - admin, e pagina inicial
- [ ] Navbar - conteudo - bestsellers, etc
- [x] Mostrar Top category  - todos os produtos da categoria
- [x] Pedir mais stock
- [x] Mostrar Orders - listar todas as encomendas na pagina de Admin
- [ ] Criar artigo - criar preço
- [ ] Transformar documento - implementar
- [ ] Mostrar nº vendas de cada produto
- [ ] Criar nova base de dados
- [ ] User sem encomendas - perde o Nome
