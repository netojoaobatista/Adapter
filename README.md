Desacoplando as bibliotecas Javascript da interface de usuário.
===============================================================

Que bibliotecas como jQuery, Prototype e outras facilitam nossa vida, diminuem o
esforço e tempo de desenvolvimento, além de aumentar a produtividade e
compatibilidade, todos nós concordamos. O problema, porém, é quando a dependência
por determinada biblioteca se torna prejudicial para uma solução cuja pretensão é
ser um produto reutilizável, ou seja, não estou falando sobre um site depender ou
não de uma biblioteca específica, estou falando sobre um componente de interface
de usuário, que é desenvolvido para ser entregue como produto, seja um plugin,
módulo ou qualquer coisa que tenhamos desenvolvido para que outros sites utilizem.

Outro ponto importante, é que desacoplar não significa não utilizar, pelo contrário,
a ideia desse artigo é descrever como utilizar tudo o que essas bibliotecas oferecem,
mas injetando-a como dependência, fazendo com que seu uso possa variar, permitindo
que utilizemos essas bibliotecas, mas que nosso produto não dependa de uma biblioteca
específica, de fato, nosso produto nem deve conhecer tal biblioteca.

Mas, qual o objetivo disso?
---------------------------

Simples, quando desenvolvemos um site, a biblioteca é praticamente toda benéfica,
mas quando desenvolvemos um componente ou plugin para ser distribuído como produto,
para que outros sites utilizem, podemos ter problemas se utilizarmos uma biblioteca
diferente da biblioteca utilizada pelo outro site. É o caso de termos utilizado
jQuery em nosso produto e o site que vai utilizá-lo, utilizar Prototype, ou seja,
além de dificultar o uso de nosso componente, prejudicamos o usuário que consumirá
aquele componente pois, além do Prototype, ainda deverá carregar também o jQuery
para atender nossa dependência.

Para ilustrar a resolução desse problema, vamos começar mostrando o problema:

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<title>Desacoplando as bibliotecas Javascript</title>
			<link rel="stylesheet" type="text/css" href="css/sample.css" />
			<script src="js/jquery.min.js"></script>
			<script>
			(function($){
				$(function(){
					$('.dropdown .selection').click(function(){
						$(this).parent().toggleClass('openned');
					});
	
					$('.dropdown .list a').click(function(){
						var selection = $(this).parent()
											   .parent()
											   .parent()
											   .find('.selection');
					
						selection.text($(this).text());
						selection.click();
					});
				});
			}(jQuery));
			</script>
		</head>
		<body>
			<div class="dropdown">
				<a href="#" class="selection">Bibliotecas</a>
				<ul class="list">
					<li class="option"><a href="#">Item 1</a></li>
					<li class="option"><a href="#">Item 2</a></li>
					<li class="option"><a href="#">Item 3</a></li>
				</ul>
			</div>
		</body>
	</html>

A marcação do menu dropdown acima é *altamente dependente* da biblioteca jQuery.
Ele se parecerá com o seguinte:

![Menu dropdown](http://img546.imageshack.us/img546/9350/dropdown.png)
![Menu dropdown aberto](http://img51.imageshack.us/img51/8750/dropdownopenned.png)
![Menu dropdown modificado](http://img837.imageshack.us/img837/7292/dropdownchanged.png)

Para esse menu funcionar como esperado, precisamos manipular a ação clique do
usuário, adicionar uma classe CSS openned à div dropdown para que os itens
apareçam e, então, aguardar um novo clique do usuário, seja no menu, ou em algum
item, para que uma opção seja selecionada.

Como podem ver, utilizamos uma técnica para resolução de compatibilidade que a
grande maioria conhece e já deve ter utilizado em algum projeto. O ponto, porém,
é que elaé aplicada de forma insuficiente, ou seja, estamos injetando a dependência
jQuery, mas estamos dependendo especificamente dessa implementação, nosso código
conhece demais essa biblioteca e, por isso, é altamente dependente dela.
O problema é que, muitas vezes, as bibliotecas possuem formas diferentes de se
fazer a mesma coisa, por exemplo, para termos o mesmo comportamento no menu,
utilizando Prototype, o código seria parecido com:

	<script src="js/prototype.js"></script>
	<script>
	document.observe("dom:loaded",function(){
		$$('.dropdown .selection').forEach(function(e){
			Event.observe(e,"click" , function(evt){
				Event.element(evt).up().toggleClassName("openned");
			});
		});
		
		$$('.dropdown .list a').forEach(function(e){
			Event.observe(e,"click",function(evt){
				var anchor = Event.element(evt);
				var selection = anchor.up()
									  .up()
									  .up()
									  .select('.selection')[0];
	
				selection.update( anchor.innerHTML );
				selection.click();
			});
		});
	});
	</script>

Como podemos ver, o uso da biblioteca Prototype é incompatível com o uso da
biblioteca jQuery, ou seja, temos um código assim:

![Código](http://img256.imageshack.us/img256/7990/tomada.jpg)

E uma biblioteca qualquer, assim:

![Biblioteca](http://img846.imageshack.us/img846/447/plugue.jpg)

Para resolver a incompatibilidade entre as bibliotecas precisamos ter uma interface
única, que nosso menu conheça, mas que nos libera da dependência de uma biblioteca
específica, encapsulando o que é específico da biblioteca dentro de um adaptador:

![Adaptador](http://img441.imageshack.us/img441/1862/adaptador.jpg)

Para que nosso código não dependa de uma interface, precisamos ter uma interface
que permita que façamos a mesma coisa, porém de forma abstrata:

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

Com isso, poderíamos ter um adaptador que implementa essa interface, apenas delegando
a responsabilidade das operações para a biblioteca específica, assim:

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

E, finalmente, nosso código final, que não depende de nenhuma biblioteca específica:

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<title>Desacoplando as bibliotecas Javascript</title>
			<link rel="stylesheet" type="text/css" href="css/adapter.css" />
			<script src="js/JavascriptLibrary.js"></script>
			
			<!--
			Para utilizar a versão Prototype, basta remover o comentário das
			linhas abaixo, comentar as linhas da biblioteca jQuery e seu adapter e
			substituir a instância de jQueryT passado na Closure do código para uma
			instância de PrototypeT.
		
			<script src="js/prototype/prototype.js"></script>
			<script src="js/prototype/PrototypeT.js"></script>
			-->
	
			<script src="js/jquery/jquery.min.js"></script>
			<script src="js/jquery/jQueryT.js"></script>
			<script>
			(function(lib){
				if (lib instanceof JavascriptLibrary){
					lib.init(function(){
						this.query(".dropdown .selection").on("click",function(){
							this.up().toggle("openned");
						});
						this.query(".dropdown .list a").on("click",function(evt){
							var selector = this.up(3).find(".selection");
							selector.text(evt.target.innerHTML);
							selector.fire("click");
						});
					});
				} else {
					throw "biblioteca inválida";
				}
			}(new jQueryT()));
			</script>
		</head>
		<body>
			<div class="dropdown">
				<a href="#" class="selection">Bibliotecas</a>
				<ul class="list">
					<li class="option"><a href="#">Item 1</a></li>
					<li class="option"><a href="#">Item 2</a></li>
					<li class="option"><a href="#">Item 3</a></li>
				</ul>
			</div>
		</body>
	</html>

Ou, com a versão Prototype:

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

O mais importante é que o código que utiliza a biblioteca, permanece exatamente
o mesmo, só temos que trocar o adaptador:

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<title>Desacoplando as bibliotecas Javascript</title>
			<link rel="stylesheet" type="text/css" href="css/adapter.css" />
			<script src="js/JavascriptLibrary.js"></script>
			
			<!--
			Para utilizar a versão Prototype, basta remover o comentário das
			linhas abaixo, comentar as linhas da biblioteca jQuery e seu adapter e
			substituir a instância de jQueryT passado na Closure do código para uma
			instância de PrototypeT.
			-->
		
			<script src="js/prototype/prototype.js"></script>
			<script src="js/prototype/PrototypeT.js"></script>
	
			<!--
			<script src="js/jquery/jquery.min.js"></script>
			<script src="js/jquery/jQueryT.js"></script>
			-->
			<script>
			(function(lib){
				if (lib instanceof JavascriptLibrary){
					lib.init(function(){
						this.query(".dropdown .selection").on("click",function(){
							this.up().toggle("openned");
						});
						this.query(".dropdown .list a").on("click",function(evt){
							var selector = this.up(3).find(".selection");
							selector.text(evt.target.innerHTML);
							selector.fire("click");
						});
					});
				} else {
					throw "biblioteca inválida";
				}
			}(new PrototypeT()));
			</script>
		</head>
		<body>
			<div class="dropdown">
				<a href="#" class="selection">Bibliotecas</a>
				<ul class="list">
					<li class="option"><a href="#">Item 1</a></li>
					<li class="option"><a href="#">Item 2</a></li>
					<li class="option"><a href="#">Item 3</a></li>
				</ul>
			</div>
		</body>
	</html>
	
[Nota no Facebook](www.facebook.com/notes/joão-batista-neto/desacoplando-as-bibliotecas-javascript-da-interface-de-usuário/413524222007462)