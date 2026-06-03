# Test Cases Documentation

This document contains the functional test cases for the Hot Wheels Collector application formatted in BDD Gherkin style.

---

## # Auth

### /auth/register
**Scenario: Layout of the registration page**  
    **Given** an anonymous user accesses the registration page `/auth/register`  
    **Then** it should display a registration form with Name, Email, and Password fields, a registration button, and a message containing a login page link.

**Scenario: Mandatory registration fields**  
    **Given** an anonymous user is on the registration page  
    **When** they attempt to submit the form  
    **Then** it should confirm that Name, Email, and Password fields are mandatory.

**Scenario: Redirect to login page via link**  
    **Given** an anonymous user is on the registration page  
    **When** they click on the "Fazer Login" link  
    **Then** they should be redirected to the login page.

**Scenario: Successful registration**  
    **Given** an anonymous user fills in the Name, Email, and Password fields with valid data  
    **When** they submit the form  
    **Then** it should successfully create an account and receive a confirmation email.

**Scenario: Registration failed due to empty fields**  
    **Given** an anonymous user leaves the registration fields empty  
    **When** they attempt to submit the form  
    **Then** it should not create an account.

**Scenario: Registration failed due to short password**  
    **Given** an anonymous user fills in the registration form but provides a password with less than 8 characters  
    **When** they attempt to submit the form  
    **Then** it should not create an account.

**Scenario: Registration failed due to duplicated user**  
    **Given** an anonymous user fills in the registration form but provides an email that already exists  
    **When** they attempt to submit the form  
    **Then** it should not create an account.

### /auth/login
**Scenario: Layout of the login page**  
    **Given** an anonymous user accesses the login page `/auth/login`  
    **Then** it should display a login form with Email and Password fields, a login button, a password recovery link, and a message containing a Registration page link.

**Scenario: Mandatory login fields**  
    **Given** an anonymous user is on the login page  
    **When** they attempt to submit the form  
    **Then** it should confirm that the Email and Password fields are mandatory.

**Scenario: Redirect to registration page via link**  
    **Given** an anonymous user is on the login page  
    **When** they click on the "Cadastre-se gratuitamente" link  
    **Then** they should be redirected to the registration page.

**Scenario: Redirect to password recovery page via link**  
    **Given** an anonymous user is on the login page  
    **When** they click on the "Esqueceu a senha?" link  
    **Then** they should be redirected to the password recovery page.

**Scenario: Successful login**  
    **Given** an anonymous user provides the correct email and password  
    **When** they click the login button  
    **Then** they should be successfully logged in and redirected to `/dashboard`.

**Scenario: Login failed due to incorrect credentials**  
    **Given** an anonymous user provides an incorrect email or password  
    **When** they click the login button  
    **Then** it should not log the user in.

### /auth/reset-password
**Scenario: Layout of the reset password page**  
    **Given** an anonymous user accesses the password reset page `/auth/reset-password`  
    **Then** it should display an Email field and a submit button.

**Scenario: Mandatory email field for password reset**  
    **Given** an anonymous user is on the password reset page  
    **When** they attempt to submit the form  
    **Then** it should confirm that the Email field is mandatory.

**Scenario: Successful password reset request**  
    **Given** an anonymous user provides a valid email address  
    **When** they click the submit button  
    **Then** it should send a reset password email.

**Scenario: Password reset request failed due to empty field**  
    **Given** an anonymous user leaves the email field empty  
    **When** they click the submit button  
    **Then** it should not send a reset password email.

### /auth/update-password
**Scenario: Layout of the update password page**  
    **Given** a user accesses the password update page `/auth/update-password`  
    **Then** it should display a Password field and a submit button.

**Scenario: Mandatory password field for update**  
    **Given** a user is on the password update page  
    **When** they attempt to submit the form  
    **Then** it should confirm that the Password field is mandatory.

**Scenario: Accept passwords with more than 8 characters**  
    **Given** a user enters a password with more than 8 characters  
    **When** they attempt to update the password  
    **Then** the page should accept the entry.

**Scenario: Reject passwords with less than 8 characters**  
    **Given** a user enters a password with less than 8 characters  
    **When** they attempt to update the password  
    **Then** it should not accept the password.

**Scenario: Successful password update**  
    **Given** a valid user token and a valid password are provided  
    **When** the user clicks the submit button  
    **Then** it should successfully update the Password.

**Scenario: Password update failed due to invalid token**  
    **Given** an invalid user token is provided  
    **When** the user attempts to update the password with a valid password  
    **Then** it should not update the Password.

---

## # Dashboard

### /dashboard
**Scenario: Layout of the main dashboard elements**  
    **Given** an authenticated user is on `/dashboard`  
    **Then** it should display the collection counter  
    **And** it should display the logout link "[Sair da Garagem]"  
    **And** it should display a search box at the top  
    **And** it should display the "Adicionar" button at the top.

**Scenario: Grid layout for car cards**  
    **Given** an authenticated user views the dashboard with multiple cars  
    **Then** it should display a maximum of 3 cards per row.

**Scenario: Car card layout and data**  
    **Given** an authenticated user views their collection on the dashboard  
    **Then** each car card should display the following data: *Código do Modelo, Número na Coleção, Série, Nome do Modelo, Cor, Ano de Lançamento, Número na Série*, and an *Editar Registro* link.

**Scenario: Car card image display**  
    **Given** a car has an associated image  
    **When** the user views the dashboard  
    **Then** it should display the car image on the card.

**Scenario: Car card placeholder display**  
    **Given** a car does not have an associated image  
    **When** the user views the dashboard  
    **Then** it should display a car icon instead.

**Scenario: Open modal for adding a new car**  
    **Given** an authenticated user is on the dashboard  
    **When** they click the "Adicionar" button at the top  
    **Then** it should open a modal with empty fields  
    **And** the modal should display the fields: *Nome do Modelo, Código do Modelo, Ano de Lançamento, Série, Cor, Número Anual, Número na Série*, and *URL da Imagem*  
    **And** it should display the *Close [X]*, *Cancelar*, and *Adicionar à Coleção* buttons.

**Scenario: Open modal for editing a car**  
    **Given** an authenticated user is on the dashboard  
    **When** they click the "Editar Registro" link on a car card  
    **Then** it should open a modal pre-filled with the correct information  
    **And** it should display the car's *Nome do Modelo* in the modal's title  
    **And** the modal should display the fields: *Nome do Modelo, Código do Modelo, Ano de Lançamento, Série, Cor, Número Anual, Número na Série*, and *URL da Imagem*  
    **And** it should display the *Close [X]*, *Cancelar*, *Remover da Garagem*, and *Adicionar à Coleção* buttons.

**Scenario: Successfully adding a new car**  
    **Given** the user opened the "Adicionar" modal  
    **When** they fill out all required details and click "Adicionar à Coleção"  
    **Then** it should add the new car to the collection  
    **And** the dashboard is refreshed to include the new car.

**Scenario: Prevent adding a car without a model name**  
    **Given** the user opened the "Adicionar" modal  
    **And** they leave the *Nome do Modelo* field empty  
    **When** they click "Adicionar à Coleção"  
    **Then** it should not add the new car to the collection.

**Scenario: Validate positive integers for release year**  
    **Given** the user is inside a car modal  
    **When** they attempt to enter values into the *Ano de Lançamento* field  
    **Then** it should only be possible to add positive integer numbers.

**Scenario: Successfully updating an existing car**  
    **Given** the user opened the "Editar Registro" modal for a car  
    **When** they update the information and click "Adicionar à Coleção"  
    **Then** it should update the existing car  
    **And** the dashboard is refreshed to display the updated data.

**Scenario: Prevent saving updates without a model name**  
    **Given** the user opened the "Editar Registro" modal for a car  
    **And** they clear the *Nome do Modelo* field  
    **When** they click "Adicionar à Coleção"  
    **Then** it should not save the edited car.

**Scenario: Successful removal of a car**  
    **Given** the user opened the "Editar Registro" modal for a car  
    **When** they click on the "Remover da Garagem" button  
    **Then** it should display a confirmation message before removing the car  
    **And** once they confirm the action, the car is removed, the dashboard refreshes, and the car is no longer present.

**Scenario: Filtering cars via search**  
    **Given** an authenticated user is on the dashboard with a populated collection  
    **When** characters are typed into the search box at the top  
    **Then** it should filter cars by *Nome do Modelo* or *Código do Modelo*  
    **And** the dashboard is refreshed, displaying only cars that match the search parameters.

**Scenario: No search results found**  
    **Given** an authenticated user is on the dashboard  
    **When** they type parameters into the search box that do not match any car  
    **Then** it should display a message when nothing is returned on the search.

**Scenario: User log out**  
    **Given** an authenticated user is on the dashboard  
    **When** they click the "[Sair da Garagem]" link  
    **Then** it should log the user out and redirect them to `/auth/login`.

---

## # General (Routes & Redirects)

**Scenario: Redirect authenticated user from login page**  
    **Given** a user is already logged into the application  
    **When** they attempt to access `/auth/login`  
    **Then** they should be redirected to `/dashboard`.

**Scenario: Redirect authenticated user from registration page**  
    **Given** a user is already logged into the application  
    **When** they attempt to access `/auth/register`  
    **Then** they should be redirected to `/dashboard`.

**Scenario: Redirect authenticated user from password reset page**  
    **Given** a user is already logged into the application  
    **When** they attempt to access `/auth/reset-password`  
    **Then** they should be redirected to `/dashboard`.

**Scenario: Protect dashboard from anonymous users**  
    **Given** a user is anonymous (not logged in)  
    **When** they attempt to access `/dashboard`  
    **Then** they should be redirected to `/auth/login`.

