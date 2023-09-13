'use strict';

/**
 * tx router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::tx.tx');
