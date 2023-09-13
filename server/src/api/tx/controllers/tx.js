'use strict';

/**
 * tx controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tx.tx');
