module.exports = [
  //codice fiscale
  {
    replaceWith: '[Codice fiscale]',
    regexp: /(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]/
  },
  //carta di credito visa
  {
    replaceWith: '[Carta di credito]',
    regexp: /4[0-9]{12}(?:[0-9]{3})?/
  },
  //carta di credito mastercard
  {
    replaceWith: '[Carta di credito]',
    regexp: /5[1-5][0-9]{14}?/
  },
  //email
  {
    replaceWith: '[Email]',
    regexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  //numero cellulare
  {
    replaceWith: '[Numero di cellulare]',
    regexp: /(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}/
  }
];
