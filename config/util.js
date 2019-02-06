module.exports = {
  /**
   * verifica se a string é vazia ou nula
   * @param {* string a ser verificada } str
   */
  checkStr(str) {
    return str === null || str.match(/^ *$/) !== null;
  },

  /**
   * verifica se é numero
   * @param {* var to check} num
   */
  checkNum(num) {
    // eslint-disable-next-line no-restricted-globals
    return isNaN(num);
  },

  /**
   * Verifica se objeto está vazio
   * @param {* Objeto} obj
   */
  isEmptyObject(obj) {
    return obj.constructor === Object && Object.keys(obj).length === 0;
  },
};
