module.exports = {
  /**
   * verifica se a string é vazia ou nula
   * @param {* string a ser verificada } str
   */
  checkStr(str) {
    return str === null || str.match(/^ *$/) !== null;
  },

  /**
   * Verifica se objeto está vazio
   * @param {* Objeto} obj
   */
  isEmptyObject(obj) {
    return obj.constructor === Object && Object.keys(obj).length === 0;
  },
};
