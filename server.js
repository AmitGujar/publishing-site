const app = require('./app');

app.set('PORT', process.env.PORT || 5000);



app.listen(app.get('PORT'), () => {
    console.log('Server is running at ' + app.get('PORT'));
});