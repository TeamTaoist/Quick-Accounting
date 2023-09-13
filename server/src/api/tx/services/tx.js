'use strict';

/**
 * tx service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tx.tx');
