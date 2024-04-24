$(document).ready(function () {
    var database;
    var categoria;

    function adicionarItem(produto) {
        var li = $("<li>").addClass("item");
        var divCircle = $("<div>").addClass("circle");
        var svgElement = $('<svg xmlns="http://www.w3.org/2000/svg" class="utilities__icons ico--wishlist icone-like" width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M15.057 0.876321C12.5247 0.830199 11.1787 2.83649 10.5171 4.10483C9.19393 1.59121 7.77948 0.761017 5.58936 0.876321C3.03423 0.991625 0.775676 3.13628 0.866931 6.38785C1.00381 12.2222 10.5399 20.5011 10.5399 20.5011C10.5399 20.5011 14.327 16.9497 16.8137 13.7212C17.8631 12.3606 20.2129 8.97066 20.2129 6.24949C20.2129 3.52831 18.2738 0.922442 15.057 0.876321Z" stroke="#000" stroke-width="0.75" stroke-miterlimit="10"/></svg>');
        var imgLike = $("<img>").addClass("icone-like")
            .attr("src", "data:image/svg+xml;base64," + btoa(svgElement.prop('outerHTML')))
            .attr("alt", "Like produto");
        var link = $("<a>").attr("href", "https://api.whatsapp.com/send?phone=556198366-5716&text=Olá,%20gostaria%20de%20mais%20informações").attr("target", "_blank");
        var imgProduto = $("<img>").addClass("imagem-produto").attr("src", produto.imgs[0]).attr("alt", "Óculos");
        var descricaoProduto = $("<p>").addClass("descricao-produto").text(produto.descricao);
        var divPrecos = $("<div>").addClass("precos");
        var precoAntigo = $("<p>").addClass("preco-antigo").text("R$ " + produto.precoAntigo);
        var precoNovo = $("<p>").addClass("preco-novo").text("R$ " + produto.precoNovo);
        var parcelado = $("<p>").addClass("parcelado").text("ou " + produto.parcelado[0] + "x R$ " + produto.parcelado[1]);

        divCircle.append(imgLike);
        li.append(divCircle);
        link.append(imgProduto);
        link.append(descricaoProduto);
        divPrecos.append(precoAntigo);
        divPrecos.append(precoNovo);
        divPrecos.append(parcelado);
        link.append(divPrecos);
        li.append(link);

        $(".itens").append(li);
    }

    function carregarItensCategoria(categoria) {
        $(".itens").empty();
        if (database.hasOwnProperty(categoria)) {
            $.each(database[categoria], function (index, produto) {
                adicionarItem(produto);
            });
        }
    }

    $.getJSON("./src/banco-de-dados.json", function (data) {
        database = data;
        $.each(database, function (categoria) {
            var categoriaItem = $("<li>").text(categoria).addClass('lista-categorias');
            if (categoria === "GLAMUROSAS") {
                categoriaItem.addClass("selecionado");
            }
            $(".categorias ul").append(categoriaItem);
        });

        carregarItensCategoria("GLAMUROSAS");
        categoria = "GLAMUROSAS";

        $(".categorias li").click(function () {
            $(".categorias li").removeClass("selecionado");
            $(this).addClass("selecionado");
            var categoriaEscolhida = $(this).text().trim();
            carregarItensCategoria(categoriaEscolhida);
            categoria = categoriaEscolhida;
        });
    });

    $(".search-bar input").on("input", function () {
        var query = $(this).val();
        filtrarProdutos(query, categoria);
    });

    function filtrarProdutos(query, categoriaSelecionada) {
        $(".itens").empty();
        var encontrouCorrespondencia = false;

        if (database.hasOwnProperty(categoriaSelecionada)) {
            $.each(database[categoriaSelecionada], function (index, produto) {
                if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                    adicionarItem(produto);
                    encontrouCorrespondencia = true;
                }
            });
        }

        if (!encontrouCorrespondencia) {
            var mensagemAviso = $("<li>").addClass("item-aviso").text("Nenhum produto correspondente encontrado.");
            $(".itens").append(mensagemAviso);
        }
    }

    $(".categorias li").click(function () {
        $(".categorias li").removeClass("selecionado");
        $(this).addClass("selecionado");
        var categoriaEscolhida = $(this).text().trim();
        carregarItensCategoria(categoriaEscolhida);
        categoria = categoriaEscolhida;
        var query = $(".search-bar input").val();
        filtrarProdutos(query, categoriaEscolhida);
    });

    $(".search-bar input").on("input", function () {
        var query = $(this).val();
        filtrarProdutos(query, categoria);
    });
});
