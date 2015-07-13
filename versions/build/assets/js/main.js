$(document).ready(function(){

	(function() {

		var urlDados = "/htmlinfo_arquivo/162/dados.csv"; //prod
		var urlDados = "assets/data/dados.csv"; //dev

		caminho = "http://infograficos-estaticos.s3.amazonaws.com/tochas-olimpicas/assets/images/";  //prod
		caminho = "assets/images/"; //dev

		getToJson(urlDados, function(dados) {

			dados = _.each(dados, function(tocha,i){
		      	tocha.id = i;
		    });
			iniciaAplicacao(dados);
		})

		function iniciaAplicacao(dados) {
			//init
		}

		//FUNÇÕES ------------\/


	})();

})