/**
 * Форматирует AST в JSON формате
 * @param {Array} diff - Внутреннее представление различий
 * @returns {string} JSON строка
 */
const formatJson = ( diff ) => JSON.stringify(diff, null, 2)

export default formatJson
