# Documentação de Casos de Testes

Este documento contém os casos de teste funcionais para a aplicação de colecionador de Hot Wheels formatados no estilo BDD Gherkin.

---

### # Autenticação (Auth)

#### /auth/register
**Cenário: Layout da página de cadastro**
    **Dado que** um usuário anônimo acessa a página de cadastro `/auth/register`
    **Então** deve exibir um formulário de cadastro com os campos Nome, Email e Senha, um botão de cadastro e uma mensagem com um link para a página de login.

**Cenário: Campos obrigatórios no cadastro**
    **Dado que** um usuário anônimo está na página de cadastro
    **Quando** tentar enviar o formulário
    **Então** deve confirmar que os campos Nome, Email e Senha são obrigatórios.

**Cenário: Redirecionamento para a página de login via link**
    **Dado que** um usuário anônimo está na página de cadastro
    **Quando** clicar no link "Fazer Login"
    **Então** deve ser redirecionado para a página de login.

**Cenário: Cadastro realizado com sucesso**
    **Dado que** um usuário anônimo preenche os campos Nome, Email e Senha com dados válidos
    **Quando** enviar o formulário
    **Então** deve criar uma conta com sucesso e receber um email de confirmação.

**Cenário: Falha no cadastro por campos vazios**
    **Dado que** um usuário anônimo deixa os campos de cadastro vazios
    **Quando** tentar enviar o formulário
    **Então** não deve criar uma conta.

**Cenário: Falha no cadastro por senha curta**
    **Dado que** um usuário anônimo preenche o formulário de cadastro mas insere uma senha com menos de 8 caracteres
    **Quando** tentar enviar o formulário
    **Então** não deve criar uma conta.

**Cenário: Falha no cadastro por usuário duplicado**
    **Dado que** um usuário anônimo preenche o formulário de cadastro, mas fornece um e-mail que já existe.
    **Quando** tentar enviar o formulário
    **Então** não deve criar uma conta.

#### /auth/login
**Cenário: Layout da página de login**
    **Dado que** um usuário anônimo acessa a página de login `/auth/login`
    **Então** deve exibir um formulário de login com os campos Email e Senha, um botão de login, um link para recuperação de senha e uma mensagem com um link para a página de Cadastro.

**Cenário: Campos obrigatórios no login**
    **Dado que** um usuário anônimo está na página de login
    **Quando** tentar enviar o formulário
    **Então** deve confirmar que os campos Email e Senha são obrigatórios.

**Cenário: Redirecionamento para a página de cadastro via link**
    **Dado que** um usuário anônimo está na página de login
    **Quando** clicar no link "Cadastre-se gratuitamente"
    **Então** deve ser redirecionado para a página de cadastro.

**Cenário: Redirecionamento para a página de recuperação de senha via link**
    **Dado que** um usuário anônimo está na página de login
    **Quando** clicar no link "Esqueceu a senha?"
    **Então** deve ser redirecionado para a página de recuperação de senha.

**Cenário: Login realizado com sucesso**
    **Dado que** um usuário anônimo fornece o email e a senha corretos
    **Quando** clicar no botão de login
    **Então** deve efetuar o login com sucesso e ser redirecionado para `/dashboard`.

**Cenário: Falha no login por credenciais incorretas**
    **Dado que** um usuário anônimo fornece um email ou senha incorretos
    **Quando** clicar no botão de login
    **Então** não deve efetuar o login.

#### /auth/reset-password
**Cenário: Layout da página de recuperação de senha**
    **Dado que** um usuário anônimo acessa a página de recuperação de senha `/auth/reset-password`
    **Então** deve exibir um campo de Email e um botão de envio.

**Cenário: Campo obrigatório para recuperação de senha**
    **Dado que** um usuário anônimo está na página de recuperação de senha
    **Quando** tentar enviar o formulário
    **Então** deve confirmar que o campo Email é obrigatório.

**Cenário: Solicitação de recuperação de senha com sucesso**
    **Dado que** um usuário anônimo fornece um endereço de email válido
    **Quando** clicar no botão de envio
    **Então** deve enviar um email de redefinição de senha.

**Cenário: Falha na solicitação de recuperação por campo vazio**
    **Dado que** um usuário anônimo deixa o campo de email vazio
    **Quando** clicar no botão de envio
    **Então** não deve enviar um email de redefinição de senha.

#### /auth/update-password
**Cenário: Layout da página de atualização de senha**
    **Dado que** um usuário acessa a página de atualização de senha `/auth/update-password`
    **Então** deve exibir um campo de Senha e um botão de envio.

**Cenário: Campo obrigatório para atualização de senha**
    **Dado que** um usuário está na página de atualização de senha
    **Quando** tentar enviar o formulário
    **Então** deve confirmar que o campo Senha é obrigatório.

**Cenário: Aceitar senhas com mais de 8 caracteres**
    **Dado que** um usuário insere uma senha com mais de 8 caracteres
    **Quando** tentar atualizar a senha
    **Então** a página deve aceitar o valor inserido.

**Cenário: Rejeitar senhas com menos de 8 caracteres**
    **Dado que** um usuário insere uma senha com menos de 8 caracteres
    **Quando** tentar atualizar a senha
    **Então** não deve aceitar a senha.

**Cenário: Atualização de senha com sucesso**
    **Dado que** um token de usuário válido e uma senha válida são fornecidos
    **Quando** o usuário clicar no botão de envio
    **Então** deve atualizar a Senha com sucesso.

**Cenário: Falha na atualização de senha por token inválido**
    **Dado que** um token de usuário inválido é fornecido
    **Quando** o usuário tentar atualizar a senha com uma senha válida
    **Então** não deve atualizar a Senha.

---

### # Dashboard

#### /dashboard
**Cenário: Layout dos elementos principais do painel**
    **Dado que** um usuário autenticado está em `/dashboard`
    **Então** deve exibir o contador de coleção
    **E** deve exibir o link de logout "[Sair da Garagem]"
    **E** deve exibir a caixa de pesquisa no topo
    **E** deve exibir o botão "Adicionar" no topo.

**Cenário: Layout em grade para os cards de carros**
    **Dado que** um usuário autenticado visualiza o dashboard com múltiplos carros
    **Então** deve exibir no máximo 3 cards por linha.

**Cenário: Layout e dados do card de carro**
    **Dado que** um usuário autenticado visualiza sua coleção no dashboard
    **Então** cada card de carro deve exibir os seguintes dados: *Código do Modelo, Número na Coleção, Série, Nome do Modelo, Cor, Ano de Lançamento, Número na Série* e o link *Editar Registro*.

**Cenário: Exibição de imagem no card do carro**
    **Dado que** um carro possui uma imagem associada
    **Quando** o usuário visualizar o dashboard
    **Então** deve exibir a imagem do carro no card.

**Cenário: Exibição de ícone padrão no card do carro**
    **Dado que** um carro não possui uma imagem associada
    **Quando** o usuário visualizar o dashboard
    **Então** deve exibir um ícone de carro.

**Cenário: Abrir modal para adicionar um novo carro**
    **Dado que** um usuário autenticado está no dashboard
    **Quando** clicar no botão "Adicionar" no topo
    **Então** deve abrir um modal com os campos vazios
    **E** o modal deve exibir os campos: *Nome do Modelo, Código do Modelo, Ano de Lançamento, Série, Cor, Número Anual, Número na Série* e *URL da Imagem*
    **E** deve exibir os botões *Close [X]*, *Cancelar* e *Adicionar à Coleção*.

**Cenário: Abrir modal para editar um carro**
    **Dado que** um usuário autenticado está no dashboard
    **Quando** clicar no link "Editar Registro" em um card de carro
    **Então** deve abrir um modal preenchido com as informações corretas
    **E** deve exibir o *Nome do Modelo* do carro no título do modal
    **E** o modal deve exibir os campos: *Nome do Modelo, Código do Modelo, Ano de Lançamento, Série, Cor, Número Anual, Número na Série* e *URL da Imagem*
    **E** deve exibir os botões *Close [X]*, *Cancelar*, *Remover da Garagem* e *Adicionar à Coleção*.

**Cenário: Adicionar um novo carro com sucesso**
    **Dado que** o usuário abriu o modal "Adicionar"
    **Quando** preencher todos os dados obrigatórios e clicar em "Adicionar à Coleção"
    **Then** deve adicionar o novo carro à coleção
    **E** o dashboard deve ser atualizado para incluir o novo carro.

**Cenário: Impedir adição de carro sem nome do modelo**
    **Dado que** o usuário abriu o modal "Adicionar"
    **E** deixou o campo *Nome do Modelo* vazio
    **Quando** clicar em "Adicionar à Coleção"
    **Então** não deve adicionar o novo carro à coleção.

**Cenário: Validar números inteiros positivos para o ano de lançamento**
    **Dado que** o usuário está dentro do modal de um carro
    **Quando** tentar inserir valores no campo *Ano de Lançamento*
    **Então** deve ser possível adicionar apenas números inteiros positivos.

**Cenário: Atualizar um carro existente com sucesso**
    **Dado que** o usuário abriu o modal "Editar Registro" de um carro
    **Quando** alterar as informações e clicar em "Adicionar à Coleção"
    **Então** deve atualizar o carro existente
    **E** o dashboard deve ser atualizado para exibir os dados modificados.

**Cenário: Impedir salvar alterações sem nome do modelo**
    **Dado que** o usuário abriu o modal "Editar Registro" de um carro
    **E** limpou o campo *Nome do Modelo*
    **Quando** clicar em "Adicionar à Coleção"
    **Então** não deve salvar o carro editado.

**Cenário: Remoção de carro com sucesso**
    **Dado que** o usuário abriu o modal "Editar Registro" de um carro
    **Quando** clicar no botão "Remover da Garagem"
    **Então** deve exibir uma mensagem de confirmação antes de remover o carro
    **E** assim que confirmar a ação, o carro deve ser removido, o dashboard atualizado e o carro removido não deve estar presente.

**Cenário: Filtrar carros via busca**
    **Dado que** um usuário autenticado está no dashboard com uma coleção preenchida
    **Quando** caracteres forem digitados na caixa de pesquisa no topo
    **Então** deve filtrar os carros por *Nome do Modelo* ou *Código do Modelo*
    **E** o dashboard deve ser atualizado, exibindo apenas os carros que correspondem aos parâmetros de busca.

**Cenário: Nenhum resultado encontrado na busca**
    **Dado que** um usuário autenticado está no dashboard
    **Quando** digitar parâmetros na caixa de pesquisa que não correspondam a nenhum carro
    **Então** deve exibir uma mensagem informando que nada foi retornado na pesquisa.

**Cenário: Logout do usuário**
    **Dado que** um usuário autenticado está no dashboard
    **Quando** clicar no link "[Sair da Garagem]"
    **Então** deve efetuar o logout do usuário e redirecioná-lo para `/auth/login`.

---

### # Geral (Rotas e Redirecionamentos)

**Cenário: Redirecionar usuário autenticado da página de login**
    **Dado que** um usuário já está logado na aplicação
    **Quando** tentar acessar a rota `/auth/login`
    **Então** deve ser redirecionado para `/dashboard`.

**Cenário: Redirecionar usuário autenticado da página de cadastro**
    **Dado que** um usuário já está logado na aplicação
    **Quando** tentar acessar a rota `/auth/register`
    **Então** deve ser redirecionado para `/dashboard`.

**Cenário: Redirecionar usuário autenticado da página de recuperação de senha**
    **Dado que** um usuário já está logado na aplicação
    **Quando** tentar acessar a rota `/auth/reset-password`
    **Então** deve ser redirecionado para `/dashboard`.

**Cenário: Proteger o dashboard de usuários anônimos**
    **Dado que** um usuário é anônimo (não está logado)
    **Quando** tentar acessar a rota `/dashboard`
    **Então** deve ser redirecionado para `/auth/login`.