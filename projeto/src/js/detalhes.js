function detalhesItem(produto) {
    $(".categorias li").removeClass("selecionado");
    window.scroll(0, 0);
    var mainContainer = $("<main>");
    var descricaoSection = $("<section>").addClass("descricao");
    var descricaoContainer = $("<div>").addClass("descricao-container style1");
    var imagemContainer = $("<div>").addClass("imagem-container");
    var thumbs = $("<div>").addClass("thumbs");


    var imgProduto = $("<img>").attr("src", './img/imagens-oculos/' + produto.imgs[0]).attr("alt", "").css("max-height", "450px").css('width', 'auto').addClass('light-zoom');
    var textoContainer = $("<div>").addClass("texto-container style2");
    var tituloProduto = $("<h1>").addClass("style3").text(produto.descricao);
    var linkConhecer = $("<a>").addClass("style4").attr("href", "#mais").text("conheça mais sobre este produto");
    var precoAntigo = $("<p>").addClass("style5").text("de " + produto.precoAntigo);
    var precoNovo = $("<p>").addClass("style6").text("R$ " + produto.precoNovo);
    // var parcelado = $("<p>").addClass("style7").text("ou " + produto.parcelado[0] + "x de R$ " + produto.parcelado[1] + " s/ juros");

    var frete = $("<p>").addClass("style7").text("Frete a calcular de acordo com a região.");
    var desconto = $("<p>").addClass("style7").text("Desconto 5% no pix.");

    var urlImagemSelecionada = new URL('./img/imagens-oculos/' + produto.imgs[0], window.location.origin).href
    var linkComprar = $("<a>").addClass("style8").attr("href",
        `https://api.whatsapp.com/send?phone=556198366-5716&text=Olá gostaria de mais informações sobre o óculos: ${produto.descricao}, com o código: ${produto.id}, ${urlImagemSelecionada} `).attr('target', '_blank').text("COMPRAR");

    // Construindo a estrutura HTML
    imagemContainer.append(imgProduto);
    imagemContainer.append(thumbs);

    produto.imgs.map((src, index) => {
        var imagem;
        if (index == 0) {
            imagem = $("<img>").attr("src", './img/imagens-oculos/' + src).addClass('active');
        } else {

            imagem = $("<img>").attr("src", './img/imagens-oculos/' + src);
        }
        thumbs.append(imagem)
    });

    descricaoContainer.append(imagemContainer);
    textoContainer.append(tituloProduto);
    textoContainer.append(linkConhecer);
    textoContainer.append(precoAntigo);
    textoContainer.append(precoNovo);
    // textoContainer.append(parcelado);
    textoContainer.append(frete);
    textoContainer.append(desconto);
    textoContainer.append(linkComprar);
    descricaoContainer.append(textoContainer);
    descricaoSection.append(descricaoContainer);

    // Compartilhar container
    var compartilharContainer = $("<div>").addClass("compartilhar-container style9");
    compartilharContainer.append($("<p>").addClass("style10").text("compartilhar"));
    compartilharContainer.append($("<a>").addClass("style11").attr("href", "").text("instagram"));
    compartilharContainer.append($("<a>").addClass("style12").attr("href", "").text("facebook"));
    descricaoSection.append(compartilharContainer);

    mainContainer.append(descricaoSection);

    // Descrição do produto
    var descricaoProdutoContainer = $("<section>").addClass("mais style13").attr('id', 'mais');
    var descricaoProdutoSelecionado = $("<div>").addClass("descricao-produto-selecionado style14");
    descricaoProdutoSelecionado.append($("<h1>").addClass("style15").text("DESCRIÇÃO DO PRODUTO"));
    var descricaoProduto = $("<div>").addClass("style16");
    produto.descricaoProduto.forEach(function (desc) {
        descricaoProduto.append($("<p>").text(desc));
    });
    descricaoProdutoSelecionado.append(descricaoProduto);
    descricaoProdutoContainer.append(descricaoProdutoSelecionado);

    // Especificações do produto

    // Material - acetato premium ou metal, Genero, proteçao da lente, itens inclusos (case flanela), cor da lente
    var especificacoesProduto = $("<div>").addClass("especificacoes-produto style17");
    especificacoesProduto.append($("<h1>").addClass("style18").text("ESPECIFICAÇÕES DO PRODUTO"));
    var especificacoesGrid = $("<div>").addClass("especificacoes-grid");
    var especificacoesTipo = $("<div>").addClass("especificacoes-tipo");
    var especificacoesInfo = $("<div>").addClass("especificacoes-info");


    var especificacoesLabels = ["Gênero", "Material da Lente", "Cor da Lente", "Proteção da Lente", "Itens Inclusos"];
    Object.keys(produto.especificaProduto).forEach(function (chave, index) {
        especificacoesTipo.append($("<p>").text(especificacoesLabels[index]));
        especificacoesInfo.append($("<p>").text(produto.especificaProduto[chave]));
    });
    especificacoesGrid.append(especificacoesTipo);
    especificacoesGrid.append(especificacoesInfo);
    especificacoesProduto.append(especificacoesGrid);
    descricaoProdutoContainer.append(especificacoesProduto);
    mainContainer.append(descricaoProdutoContainer);

    // Adicionando o HTML ao item da lista
    $(".itens").empty();
    $(".resultado-busca").css('display', 'block')
    $(".itens").css('display', 'block')
    $(".itens").append(mainContainer);

    $('.light-zoom').lightzoom({
        zoomPower: 4,    //Default
        glassSize: 250,  //Default
    });

    $('.thumbs img').click(function (e) {
        var cover = $('.light-zoom');
        var thumb = $(this).attr('src');
        if (cover.attr('src') !== thumb) {
            cover.fadeTo('200', '0', () => {
                cover.attr('src', thumb);
                cover.fadeTo('150', '1')
            });
        }
        $('.thumbs img').removeClass('active');
        $(this).addClass('active');
    });

}

function obterParametrosURL() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var partes = queryString.split('&');
    for (var i = 0; i < partes.length; i++) {
        var chaveValor = partes[i].split('=');
        var chave = decodeURIComponent(chaveValor[0]);
        var chaveSemColchetes = chave.replace(/\[.*?\]/g, '');
        var valor = decodeURIComponent(chaveValor[1]);
        params[chaveSemColchetes] = valor;
    }
    return params;
}


var jsonPath;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    jsonPath = 'src/banco/banco-de-dados.json'; // Caminho para o ambiente local
} else {
    jsonPath = 'https://bysunoculos.com.br/src/banco/banco-de-dados.json'; // Caminho para o ambiente publicado
}

// $.getJSON("https://bysun-740ca-default-rtdb.firebaseio.com/data.json", function (data) {
$.getJSON(jsonPath, function (data) {
    var produto = (obterParametrosURL());
    database = data;
    $.each(database, function (categoria) {
        if (categoria === produto.categoria) {
            if (database.hasOwnProperty(categoria)) {
                $.each(database[categoria], function (index, produtoFind) {
                    if (produtoFind.id == produto.id) {
                        detalhesItem(produtoFind);
                    }
                });
            }
        }
    });
});