const path = require('path')
const routers = require('../src/models/routers')

test('test recursive files directory.',  function(done ) {
    routers.getSrcRouter(path.join(__dirname, 'pages'),function(element){
        return Object.assign(element,{
            path: element.path.replace(__dirname, '')
        })
    }).then(function(files){
        expect(files).toMatchSnapshot();
        done()
    })
})