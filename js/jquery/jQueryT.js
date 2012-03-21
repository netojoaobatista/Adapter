/**
 * Implementação de um adaptador que implementa a interface de {JavascriptLibrary}
 * e delega as operações diretamente à biblioteca jQuery.
 * @constructor
 */
function jQueryT() {
	this.lastQuery = null;
}

jQueryT.prototype = new JavascriptLibrary();

/**
 * Dispara um evento qualquer
 * @param {String} event O evento que será disparado.
 * @return {jQueryT}
 */
jQueryT.prototype.fire = function(event) {
	if (this.lastQuery) this.lastQuery.trigger(event);
};

/**
 * Anexa um manipulador de eventos para um evento específico.
 * @param {String} event Nome do evento.
 * @param {Function} callback Função que será executada quando o evento for
 * 		   disparado. 
 * @return {jQueryT}
 */
jQueryT.prototype.on = function(event,callback,element) {
	var $ = this;
	jQuery(element||this.lastQuery).bind(event,function(){
		callback.apply($,arguments);
	});
	return $;
};

/**
 * Busca por determinado selector a partir do ponto atual.
 * @param {String} selector
 * @return {jQueryT}
 */
jQueryT.prototype.find = function(selector) {
	var instance = new jQueryT();
	instance.lastQuery = this.lastQuery.find(selector);
	
	return instance;
};

/**
 * Define uma função que será chamada assim que o documento tiver sido
 * carregado.
 * @param {Function} callback
 * @return {jQueryT}
 */
jQueryT.prototype.init = function(callback) {
	var $ = this;
	jQuery(document).ready(function(){
		callback.apply($,arguments);
	});
	return $;
};

/**
 * Busca por determinado selector.
 * @param {String} selector
 * @return {jQueryT}
 */
jQueryT.prototype.query = function(selector) {
	var instance = new jQueryT();
	instance.lastQuery = $(selector);
	
	return instance;
};

/**
 * Modifica o texto de determinado elemento.
 * @param {String} text
 * @return {jQueryT}
 */
jQueryT.prototype.text = function(text) {
	if (this.lastQuery) this.lastQuery.text(text);
	return this;
};

/**
 * Comuta determinada classe CSS
 * @param {String} className
 * @return {jQueryT}
 */
jQueryT.prototype.toggle = function(className) {
	if (this.lastQuery) this.lastQuery.toggleClass(className);
	return this;
};

/**
 * Sobe um ou mais níveis a partir do elemento atual.
 * @param {Number} level
 * @return {jQueryT}
 */
jQueryT.prototype.up = function(level) {
	var lastQuery = this.lastQuery;
	var instance = new jQueryT();

	for (level=(level||1);level>0;lastQuery=lastQuery.parent(),level--);
	
	instance.lastQuery = lastQuery;
	
	return instance;
};