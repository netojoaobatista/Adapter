/**
 * Interface que permite ao menu dropdown utilizar uma biblioteca sem depender
 * de uma biblioteca específica.
 * @constructor
 */
function JavascriptLibrary() {}
JavascriptLibrary.prototype = {
	/**
	 * Dispara um evento qualquer
	 * @param {String} event O evento que será disparado.
	 * @return {JavascriptLibrary}
	 */
	fire: function(event){},
	
	/**
	 * Anexa um manipulador de eventos para um evento específico.
	 * @param {String} event Nome do evento.
	 * @param {Function} callback Função que será executada quando o evento for
	 * 		   disparado. 
	 * @return {JavascriptLibrary}
	 */
	on: function(event,callback){},
	
	/**
	 * Busca por determinado selector a partir do ponto atual.
	 * @param {String} selector
	 * @return {JavascriptLibrary}
	 */
	find: function(selector){},
	
	/**
	 * Define uma função que será chamada assim que o documento tiver sido
	 * carregado.
	 * @param {Function} callback
	 * @return {JavascriptLibrary}
	 */
	init: function(callback){},
	
	/**
	 * Busca por determinado selector.
	 * @param {String} selector
	 * @return {JavascriptLibrary}
	 */
	query: function(selector){},
	
	/**
	 * Modifica o texto de determinado elemento.
	 * @param {String} text
	 * @return {JavascriptLibrary}
	 */
	text: function(text){},
	
	/**
	 * Comuta determinada classe CSS
	 * @param {String} className
	 * @return {JavascriptLibrary}
	 */
	toggle: function(className){},
	
	/**
	 * Sobe um ou mais níveis a partir do elemento atual.
	 * @param {Number} level
	 * @return {JavascriptLibrary}
	 */
	up: function(level){}
};