/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'mongooseConnector', ($mongoose, logger, config) => {

    return {
        connect
    };

    function connect() {
        const db = $mongoose.connection;
        db.on('error', () => logger.error('Cannot connect to MongoDB'));
        db.once('open', () => logger.info('Connected to MongoDB'));
        $mongoose.connect(config.MONGODB_URL);
    }
});