/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
     })
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',
    }).should((response) =>{
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": faker.person.fullName(),
        "email": faker.internet.email(),
        "password": "teste",
        "administrador": "true"
      }
    }).should((response) =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
        "email": "cristianoronaldo@qa.com",
        "password": "teste"
      },
      failOnStatusCode: false
    }).should((response) =>{
      expect(response.status).equal(401)
      expect(response.body.message).equal('Email e/ou senha inválidos')
    })
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    cy.request({
      method: 'PUT',
      url: 'usuarios' + '/4HKQlhKObUSYSsmO',
      body:  {
        "nome": faker.person.fullName(),
        "email": faker.internet.email(),
        "password": "teste",
        "administrador": "true"
    },
    }).should((response => {
      expect(response.body.message).to.equal('Registro alterado com sucesso')
      expect(response.status).to.equal(200)
    }))
  });

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    cy.cadastrarUsuario(faker.person.fullName(), faker.internet.email(), "teste", "true" )
    .then(response => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).should((response) => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
    })

    })
    
  });


});
