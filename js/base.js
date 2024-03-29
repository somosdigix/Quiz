var areaQuestoes = $("#questoes"),
	questoesLista = $("#questoes ul"),
	questoesRespostas = $("#questoes ul li");

function limparTela() {
	areaQuestoes.empty().removeAttr("class");
}

function animacaoEntrada() {
	areaQuestoes.removeClass("bounceOutDown animated");
	areaQuestoes.addClass("bounceinUp animated");
}

function animacaoSaida() {
	areaQuestoes.removeClass("bounceinUp animated");
	areaQuestoes.addClass("bounceOutDown animated");
}

function fecharMensagem() {
	animacaoSaida();

	setTimeout(function() {
		limparTela();
	}, 1200);

	startCountdown();
}

function fecharMensagemSemPararTempo() {
	animacaoSaida();

	setTimeout(function() {
		limparTela();
	}, 1200);
}

function bloquearRespondidas() {
	var pegaCategoriaRespondida = areaQuestoes.attr("name");
	$("#" + pegaCategoriaRespondida).addClass("bloqueado").append("<div class='animated bounceInDown'></div>");
}

function verificaSeAcertou() {
	var pegaCategoriaRespondida = areaQuestoes.attr("name");
	$("#" + pegaCategoriaRespondida).attr("marca-certa", "acertou").find("div").addClass("acertou-questao");
}

function fecharJanela() {
	areaQuestoes.append("<span class='fechar' onclick='fecharMensagemSemPararTempo();'><span class='icone'></span>Fechar</span>");
}


function selecionarQuestao() {
	$("#questoes ul li").on("click", function() {
		$("#questoes ul li").removeClass("selecionado");
		$(this).addClass("selecionado");
	});
}

function contarRepostasCertas() {
	var valorAtual = Number($("#placar .respostas-certas").text()),
		novoValor = valorAtual + 1;

	$("#placar .respostas-certas").html(novoValor);
}


function pegaResultadoFinal() {
	var tempo = $(".tempo-gasto").text(),
		respostasCorretas = $("#placar .respostas-certas").text(),
		pegaTotalDeRespondidos = $("section.categorias-quiz ul.categorias li.bloqueado").length;

	if (pegaTotalDeRespondidos == 8) {
		$(".tempo-gasto").removeAttr("class").addClass("tempo-final").text(tempo);
		$(".fechar-mensagem").on("click", function(){
			$("body")
				.append("<div class='formulario-final'>" +
					"<h2>Obrigado por participar do nosso Quiz! </h2> <p>Você acertou <span>" + respostasCorretas + "</span> de <span>8</span> questões em <span>" + tempo + "</span>.</p> <p>Informe seu nome e e-mail nos campos abaixo!</p>" +
					"<input id='nome' type='text' placeholder='Nome' />" +
					"<input id='email' type='text' placeholder='Email' />" +
					"<a href='/' onclick='finalizar(); return false;' class='botao-final'>Finalizar</a>" +
					"</div>"
				);
			});
	}
}

function finalizar() {
	var nome = $("body #nome").val().trim(),
		email = $("body #email").val().trim();

	if (!validarInformacoes(nome, email)) return;

	var data = {
		nome: nome,
		tempo: $(".tempo-final").text(),
		quantidadeDePerguntas: $("section.categorias-quiz ul.categorias li.bloqueado").length,
		respostasCorretas: $("#placar .respostas-certas").text()
	};

	localStorage.setItem(email, JSON.stringify(data));

	window.location = "index.html";
}

function validarInformacoes(nome, email) {
	if (nome == "") {
		alert("Nome deve ser informado");
		return false;
	}

	if (email == "") {
		alert("E-mail deve ser informado");
		return false;
	}

	if (!validarEmail(email)) {
		alert("E-mail inválido");
		return false;
	}

	if (emailJaRespondeu(email)) {
		alert("Este email já respondeu o questionário");
		return false;
	}

	return true;
}

function validarEmail(email) {
	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function emailJaRespondeu(email) {
	return localStorage.getItem(email) != null;
}

function validarQuestao() {
	var respostaCertaSelecionada = $("#questoes ul li.resposta-certa.selecionado");
	var respostaSelecionada = $("#questoes ul li.selecionado")

	if (respostaSelecionada.length == 1 && respostaCertaSelecionada.length == 1) {
		areaQuestoes.find(".mensagem").show();
		$("#questoes .mensagem p span.icone").addClass("icone-acertou");
		$("#questoes .mensagem p:first-child").append("<span class='mensagem-titulo'>Opa, você acertou!</span>");
		$("#questoes .mensagem .mensagem-certa").show();
		$("#questoes button:first").attr("disabled", "disabled");

		contarRepostasCertas();
		bloquearRespondidas();
		verificaSeAcertou();
		pauseCountdown();
		pegaResultadoFinal();
	} else if (respostaSelecionada.length == 1 && respostaCertaSelecionada.length == 0) {
		areaQuestoes.find(".mensagem").show();
		$("#questoes .mensagem p span.icone").addClass("icone-errou");
		$("#questoes .mensagem p:first-child").append("<span class='mensagem-titulo'>Que pena, você errou!</span>");
		$("#questoes .mensagem .mensagem-errada").show();
		$("#questoes button:first").attr("disabled", "disabled");
		bloquearRespondidas();
		pauseCountdown();
		pegaResultadoFinal();
	} else if (respostaSelecionada.length != 1 && respostaCertaSelecionada.length != 1) {
		areaQuestoes.append("<div class='mensagem-de-validacao fadeInDownBig animated'>Caaaaaraaaaaa!!! Você é louco!!! Seleciona uma opção aí!!!</div>");
	} else {
		alert("tá di boa");
	}

}