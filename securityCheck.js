module.exports = [
  {
    replaceWith: '[Numero di cellulare privato]',
    regexp: /(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}/g
  },
  {
    replaceWith: '[Codice Fiscale privato]',
    regexp: /(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}/g
  }
];
