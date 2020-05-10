module.exports = {
    development: {
        db: 'mongodb://database/elecart',
        app: {
            name: 'elecart-api'
        }
    },
    testing: {
        db: 'mongodb://localhost/elecart',
        app: {
            name: 'elecart-api'
        }
    }
};
