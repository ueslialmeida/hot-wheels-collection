describe('Tests for the dashboard module', () => {
  
    const baseUrl = Cypress.expose('baseUrl')

    const testCar = {
        model: `Test Car ${Date.now()}`,
        modelCode: 'HKND-1234',
        year: '2024',
        series: 'J-Imports',
        color: 'Black',
        numInCollection: '42',
        yearCollectionTotal: '250',
        numInSeries: '2',
        seriesCollectionTotal: '5',
    }

    const testCarWithImage = {
        ...testCar,
        imageUrl: 'https://www.escalaminiaturas.com.br/media/catalog/product/cache/3/image/9df78eab33525d08d6e5fb8d27136e95/f/y/fyc52_01.jpg'
    }

    beforeEach(() => {
        cy.login()
    })

    it('should display the dashboard main element controls', () => {
        cy.get('h2').contains('Minha Garagem').should('be.visible')
        cy.contains(/Você tem \d+ carrinhos na coleção/).should('be.visible')
        cy.get('button').contains('Sair da Garagem').should('be.visible')
        cy.get('#search').should('be.visible')
        cy.get('#add-new-car').should('be.visible')
        cy.get('#car-list').should('be.visible')
    })

    it('should open the add new car form when the "Adicionar" button is clicked', () => {
        cy.wait(500)
        cy.get('#add-new-car').click()
        cy.get('h2').should('contain', 'Novo na Garagem')
        cy.get('form').should('be.visible')
    })

    it('should add a car to the collection successfully and display the car details in a card', () => {
        cy.wait(500)
        cy.addNewCar(testCarWithImage)

        cy.get('h2').should('contain', testCarWithImage.model)
        cy.get('span').should('contain', testCarWithImage.modelCode)
        cy.get('span').should('contain', testCarWithImage.year)
        cy.get('div').should('contain', 'SERIE: ' + testCarWithImage.series.toUpperCase())
        cy.get('span').should('contain', testCarWithImage.color)
        cy.get('span').should('contain', testCarWithImage.numInCollection)
        cy.get('span').should('contain', testCarWithImage.numInSeries)
        cy.get('div')
            .find('img')
            .should('have.attr', 'src', testCarWithImage.imageUrl)
            .and('be.visible')

        cy.deleteCarFromCollection()
    })

    it('should display a default image when no image URL is provided', () => {
        cy.wait(500)
        cy.addNewCar(testCar)

        cy.get('div')
            .find('svg')
            .should('have.class', 'lucide-car')
            .and('be.visible')

        cy.deleteCarFromCollection()
    })

    it('should update a car in the collection successfully', () => {
        cy.wait(500)
        cy.addNewCar(testCar)

        cy.get('#car-list').find('button').contains('Editar Registro').click()
        cy.wait(500)
        cy.get('#model-name').clear().type(testCar.model + ' Updated')
        cy.get('#save').click()

        cy.get('h2').should('contain', testCar.model + ' Updated')

        cy.deleteCarFromCollection()
    })

    it('should delete a car from the collection successfully', () => {
        cy.wait(500)
        cy.addNewCar(testCar)

        cy.get('h2').should('contain', testCar.model)
        
        cy.deleteCarFromCollection()
        
        cy.get('h2').contains(testCar.model).should('not.exist')
        cy.get('p').should('contain', 'Sua garagem está vazia. Adicione seu primeiro carrinho!')
    })

    it('should search for a car in the collection successfully', () => {
        cy.wait(500)
        cy.addNewCar(testCar)
        cy.get('#search').type(testCar.model)

        cy.get('h2').should('contain', testCar.model)

        cy.deleteCarFromCollection()
    })

    it('should display a message when no cars are found for a search term', () => {
        cy.wait(500)
        cy.addNewCar(testCar)
        cy.get('#search').type('Honda Civic')

        cy.get('p').should('contain', 'Nenhum carrinho encontrado para "Honda Civic".')

        cy.deleteCarFromCollection()
    })

    it('should clear the search and display all cars when the search term is cleared', () => {
        cy.wait(500)
        cy.addNewCar(testCar)
        cy.get('#search').type(testCar.model)
        cy.get('#btn-clear-search').click()

        cy.get('h2').should('contain', testCar.model)

        cy.deleteCarFromCollection()
    })

    it('should not save a car when model name is not provided', () => {
        cy.wait(500)
        cy.get('#add-new-car').click()
        cy.get('#save').click()
        cy.get('span').should('contain', 'Este campo é obrigatório.')
    })

    it('should not update a car when model name is not provided', () => {
        cy.wait(500)
        cy.addNewCar(testCar)

        cy.get('#car-list').find('button').contains('Editar Registro').click()
        cy.wait(500)
        cy.get('#model-name').clear()
        cy.get('#save').click()

        cy.get('span').should('contain', 'Este campo é obrigatório.')

        cy.deleteCarFromCollection()
    })

    it('should not accept value under "1900" or over "current year" in collection year field', () => {
        const nextYear = new Date().getFullYear() + 1

        cy.wait(500)
        cy.get('#add-new-car').click()
        cy.get('#model-name').type(testCar.model)
        cy.get('#collection-year').type('1899')
        cy.get('#save').click()

        cy.get('p').should('contain', 'O ano da coleção é inválido. Valores permitidos: 1900 até o ano atual.')

        cy.get('#collection-year').clear().type(nextYear)
        cy.get('#save').click()
        
        cy.get('p').should('contain', 'O ano da coleção é inválido. Valores permitidos: 1900 até o ano atual.')
    })

    it('should not accept value under "1" or over "300" in yearly collection number fields', () => {

        cy.wait(500)
        cy.get('#add-new-car').click()
        cy.removeBounderyAttributes(['#number-in-year-collection', '#year-collection-total'])
        cy.get('#model-name').type(testCar.model)
        cy.get('#number-in-year-collection').type('0')
        cy.get('#save').click()

        cy.get('p').should('contain', 'O número na coleção do ano é inválido. Valores permitidos: 1 até 300.')

        cy.get('#number-in-year-collection').clear().type('1')
        cy.get('#year-collection-total').type('301')
        cy.get('#save').click()
        
        cy.get('p').should('contain', 'O total da coleção do ano é inválido. Valores permitidos: 1 até 300.')
    })

    it('should not accept value under "1" or over "99" in series collection number fields', () => {

        cy.wait(500)
        cy.get('#add-new-car').click()
        cy.removeBounderyAttributes(['#number-in-series', '#series-collection-total'])
        cy.get('#model-name').type(testCar.model)
        cy.get('#number-in-series').type('0')
        cy.get('#save').click()

        cy.get('p').should('contain', 'O número na série é inválido. Valores permitidos: 1 até 99.')

        cy.get('#number-in-series').clear().type('1')
        cy.get('#series-collection-total').type('100')
        cy.get('#save').click()
        
        cy.get('p').should('contain', 'O total da coleção da série é inválido. Valores permitidos: 1 até 99.')
    })

    it('should log out the user and redirect to login page when "Sair da Garagem" button is clicked', () => {
        cy.get('button').contains('Sair da Garagem').click()
        cy.wait(500)
        cy.url().should('include', '/login')
    })
})
