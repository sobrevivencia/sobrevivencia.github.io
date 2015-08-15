$(document).ready(function(){
	telaAtual = 1;
	$("#tinderslide").jTinder({
		// dislike callback
	    onDislike: function (item) {
		    // set the status text
	        verificaFim(item.index());
	    },
		// like callback
	    onLike: function (item) {
		    // set the status text
			encerraQuiz('sim', item.index());
	    },
		animationRevertSpeed: 200,
		animationSpeed: 400,
		threshold: 1,
		likeSelector: '.like',
		dislikeSelector: '.dislike'
	});
	function recalcula(){
		var tamTela = parseInt($("#tudo").width());
		$('header').css({'width':$(window).width()+'px'});
		$('.tela-1').css({'width':tamTela+'px'});
		$('.tela-2').css({'width':tamTela+'px'});
		$('.tela-3').css({'width':tamTela+'px'});
		if(telaAtual==1){
			$('.telas').css({'left':0+"px"});
		}else if(telaAtual==2){
			$('.telas').css({'left':-tamTela+"px"});
		}else if(telaAtual==3){
			$('.telas').css({'left':-(tamTela*2)+"px"});
		}
	}
	recalcula();
	$(window).resize(function(){
		recalcula();
	})
	$("#btn-tela-1").click(function(){
		var tamTela = parseInt($("#tudo").width());
		$('.telas').animate({'left':-tamTela});
		$("html, body").scrollTop(0);
		telaAtual = 2;
	})
	$("#comecar").click(function(){
		$("#mask").fadeOut();
		$(".formulario").animate({'height':0});
	})

	var totalPerguntas = $('#tinderslide ul li').length;
	function verificaFim(index){
		if(index==0){
			encerraQuiz('não', index);
		}
	}
	function encerraQuiz(valor, index){
		var tamTela = parseInt($("#tudo").width());
		var resultado = "";
        var indexLi = index;
        $(".wrap").fadeOut("fast",function() {
            if(valor=="sim"){
            	resultado = $(".wrap ul li").eq(indexLi).find(".justificativa").html();
  	        	$(".tela-3").html(resultado).animate({'text-decoration':'none'},function(){
  	        		$(".vai_inicio").click(function(){
						var tamTela = parseInt($(window).width());
						$('.telas').animate({'left':0},function(){
							location.reload();
							telaAtual = 1;
						});
						$("html, body").scrollTop(0);
					})
  	        	});
  	        	// $(".resultado #msg-feedback").html("<span>Infelizmente você não pode doar porque:</span>"+"<h3 class='just'>"+resultado+"</h3>");
  	        	// $(".refazer").css({'display':'block'});
  	        	$(".store").css({'display':'none'});
            }else{
            	resultado = '<div class="tit-sessao"><h2>Oba!</h2></div><div class="img-justification"><img src="assets/images/calendar.png"></div><div class="text-justification"><div class="title-justification"><h2>Você está potencialmente apto para doar dia 08/maio!</h2><p>Vamos avisar a Maria! Se você quiser, baixe o app para receber um lembrete quando estiver chegando e convide mais amigos! </p></div><div class="sobre-ong"><a target="_BLANK" href="https://itunes.apple.com/en/app/blood-pressure-companion-free/id458537528" title="App Store" class="store"><img src="assets/images/app.png" alt="Apple Store" /><img src="assets/images/play.png" alt="Play Store" /><img src="assets/images/phone.png" alt="Windows Phone" /></a></div><button class="vai_inicio">Voltar para o convite</button></div>';
           		$(".tela-3").html(resultado).animate({'text-decoration':'none'},function(){
           			$(".vai_inicio").click(function(){
						var tamTela = parseInt($(window).width());
						$('.telas').animate({'left':0},function(){
							location.reload();
							telaAtual = 1;
						});
						$("html, body").scrollTop(0);
					})
           		});
  	        	// $(".refazer").css({'display':'none'});
  	        	// $(".store").css({'display':'block'});
            }
        	// $("#actions").css({'opacity':'0','display':'none'});
           
            // $(".resultado").fadeIn();
			$('.telas').animate({'left':-(tamTela*2)+"px"},function(){
				$("html, body").scrollTop(0);
				telaAtual = 3;
			});
        });
    }

	$('#actions .like, #actions .dislike').click(function(e){
		e.preventDefault();
		$("#tinderslide").jTinder($(this).attr('class'));
	});
})