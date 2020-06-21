'use strict';

/**
 * Module dependencies.
 */

const AsyncOption = require('../abstract/AsyncOption');

// /**
//  * modifyTemplate option.
//  */

// function insertHead(inserted, tmpl) {
//   let headEndIndex = tmpl.indexOf('</head>');
//   tmpl.splice(headEndIndex, 0, inserted);
//   return tmpl;
// }

module.exports = class InjectTemplateOption extends AsyncOption {
  async apply(ctx) {
    await super.asyncApply();

    const vals = this.appliedValues;
    let heads = '';
    vals.forEach(val => {
      const { head } = val;
      heads += head;
    });

    ctx.setTmplArgs({ head: heads });
  }
};
