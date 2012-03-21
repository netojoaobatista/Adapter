/**
 * Implementação de um adaptador que implementa a interface de {PrototypeT}
 * e delega as operações diretamente à biblioteca Prototype.
 * @constructor
 */
function PrototypeT() {
	this.lastQuery = null;
}

PrototypeT.prototype = new JavascriptLibrary();

/**
 * Dispara um evento qualquer
 * @param {String} event O evento que será disparado.
 * @return {PrototypeT}
 */
PrototypeT.prototype.fire = function(event) {
	this.each(function(e){ if (e[event]) e[event](); });
};

/**
 * Executa uma função para cada elemento selecionado.
 * @param {Function} callback
 * @returns {PrototypeT}
 */
PrototypeT.prototype.each = function(callback) {
	for ( var i=0, t=this.lastQuery.length;i<t;++i){
		callback.apply(this,[this.lastQuery[i]]);
	}
	return this;
};

/**
 * Anexa um manipulador de eventos para um evento específico.
 * @param {String} event Nome do evento.
 * @param {Function} callback Função que será executada quando o evento for
 * 		   disparado. 
 * @return {PrototypeT}
 */
PrototypeT.prototype.on = function(event,callback,element) {
	this.each(function(e){
		Event.observe(e,"click",function(evt) {
			var instance = new PrototypeT();
			instance.lastQuery = Event.element(evt);
			
			callback.apply(instance,arguments);
		});
	});
	
	return this;
};

/**
 * Busca por determinado selector a partir do ponto atual.
 * @param {String} selector
 * @return {PrototypeT}
 */
PrototypeT.prototype.find = function(selector) {
	var instance = new PrototypeT();
	instance.lastQuery = this.lastQuery.select(selector);
	
	return instance;
};

/**
 * Define uma função que será chamada assim que o documento tiver sido
 * carregado.
 * @param {Function} callback
 * @return {PrototypeT}
 */
PrototypeT.prototype.init = function(callback) {
	var $ = this;
	document.observe("dom:loaded",function(){
		callback.apply($,arguments);
	});
	return $;
};

/**
 * Busca por determinado selector.
 * @param {String} selector
 * @return {PrototypeT}
 */
PrototypeT.prototype.query = function(selector) {
	var instance = new PrototypeT();
	instance.lastQuery = $$(selector);
	
	return instance;
};

/**
 * Modifica o texto de determinado elemento.
 * @param {String} text
 * @return {PrototypeT}
 */
PrototypeT.prototype.text = function(text) {
	if (this.lastQuery) this.each(function(e){ e.update(text);});
	return this;
};

/**
 * Comuta determinada classe CSS
 * @param {String} className
 * @return {PrototypeT}
 */
PrototypeT.prototype.toggle = function(className) {
	if (this.lastQuery) this.lastQuery.toggleClassName(className);
	return this;
};

/**
 * Sobe um ou mais níveis a partir do elemento atual.
 * @param {Number} level
 * @return {PrototypeT}
 */
PrototypeT.prototype.up = function(level) {
	var lastQuery = this.lastQuery;
	var instance = new PrototypeT();

	for (level=(level||1);lastQuery&&level>0;lastQuery=lastQuery.up(),level--);
	
	instance.lastQuery = lastQuery;
	
	return instance;
};