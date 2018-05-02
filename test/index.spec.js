process.env.NODE_ENV = 'test';
var http = require('http');
var assert = require('assert');
var app = require('../app');
// use zombie.js as headless browser
var Browser = require('zombie');
browser = new Browser();

describe('Index page', function() {
    before(function() {
        this.server = http.createServer(app).listen(3000);
        browser = new Browser({ site: 'http://localhost:3030' });
    });
    

    describe('contactForm', function() {
        before(function(done) {
            browser.visit('/', done);
        });

        it('should see welcome page', function(done) {
            browser.assert.text('title', 'GIG Test: Benjamín Peña');
            done();
        });
        it('should show form', function(done) {
            browser.assert.success();
            browser.assert.text('h1', 'Agenda');
            browser.assert.attribute('form', 'id', 'contactForm');
            browser.assert.attribute('form input[name=FirstName]','id','txtFirstName');
            browser.assert.attribute('form input[name=Surname]','id','txtSurname');
            browser.assert.attribute('form input[name=Email]','id','txtEmail');
            browser.assert.attribute('form select[name=Country]','id','selectCountry');
            browser.assert.attribute('form input[type=submit]','id','btnSave');
            browser.assert.attribute('form input[type=button]','id','btnClear');
        done();
        });

        it('should show a Table tableList', function(done) {
            browser.assert.attribute('table','id','tableList');
        done();
        });
    });

    describe('submits form success', function() {
        it('should accept complete submissions, should display success message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email',    'dos@pasos.com')
                browser.select('Country', 'ES');
                
                return browser.pressButton('Add');
              });
            
            browser.assert.style('.ui.success.message', 'display', '');
            done();
        });
    });

    describe('Reset button', function() {
        it('should clear  the form field', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email',    'dos@pasos.com')
                browser.select('Country', 'ES');
                
                browser.pressButton('Reset');
            });
            assert(browser.field('FirstName').value === '');
            assert(browser.field('Surname').value === '');
            assert(browser.field('Email').value === '');
            assert(browser.field('Country').value === '');
            done();
        });

        it('should clear hide the success message', function(done) {
            browser.pressButton('Reset').then(function() {
                browser.assert.style('div.ui.success.message.hidden', 'display', '');
              });
           
            done();
        });
    });

    describe('should refuse empty FirstName', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', '')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email', 'dospasos.com')
                browser.select('Country', 'ES');
                return browser.pressButton('Add');
              });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('should refuse empty surname', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', '')
                browser.fill('Email', 'dospasos.com')
                browser.select('Country', 'ES');
                return browser.pressButton('Add');
              });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('should refuse empty email', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email', '')
                browser.select('Country', 'ES');
                
                return browser.pressButton('Add');
            });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('should refuse invalid emails', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email', 'dospasos.com')
                browser.select('Country', 'ES');
                
                return browser.pressButton('Add');
            });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('should refuse duplicate emails', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email',    'dos@pasos.com')
                browser.select('Country', 'ES');
                
                return browser.pressButton('Add');
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email', 'dos@pasos.com')
                browser.select('Country', 'ES');
                
                return browser.pressButton('Add');
            });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('should refuse empty country', function() {
        it('should display error message', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email','dos@pasos.com')
                browser.select('Country', '');
                
                return browser.pressButton('Add');
            });
            browser.assert.style('.ui.error.message', 'display', '');
            done();
        });
    });

    describe('setCounter should be display after save contact', function() {
        it('should return null', function(done) {
            before(function() {
                browser.fill('FirstName', 'John')
                browser.fill('Surname', 'Dos Pasos')
                browser.fill('Email', 'dos@pasos.com')
                browser.select('Country', 'ES');
                return browser.pressButton('Add');
            });
            browser.assert.style('#counterContacts', 'display', '');
            done();
        });
    });

    describe('localstorage should be null at first', function() {
        it('should return null', function(done) {
            before(function() {
                assert.equal(browser.localStorage("localhost:3030").getItem("agendaGIG"),'eeeeeeeeeeee');
            });
            assert.equal(browser.localStorage("localhost:3030").getItem("agendaGIG"),null);
            done();
        });
    });

    
});