$(document).ready(function () {
    var database;
    var categoria;

    function changeSVG(params) {
        $('img.svg').each(function () {
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            $.get(imgURL, function (data) {
                var $svg = $(data).find('svg');
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                $img.replaceWith($svg);
            });
        });

    }

    function adicionarItem(produto) {

        var li = $("<li>").addClass(`item`).addClass(`item-${produto.id}`);
        var divCircle = $("<div>").addClass("circle")
            .click(function () {
                mudarCorFillSVG($(this), '#E91E63');
                adicionarProdutoSelecionado(produto);
            });
        var imgLike = $("<img>").addClass("icone-like")
            .addClass(`svg airplane `)
            .attr('id', produto.id)
            .attr("src", "./img/icons/coracao.svg")
            .attr("alt", "Like produto")
        if (marcarLike(produto.id)) {
            imgLike.addClass('marcado')
        }

        var link = $("<div>").click(() => { detalhesItem(produto) })//.attr("href", "./descricao.html").attr("target", "_blank");
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

        $(".resultado-busca").css('display', 'flex')
        $(".itens").css('display', 'flex')
        $(".itens").append(li);
        changeSVG();
    }





    function detalhesItem(produto) {
        $(".categorias li").removeClass("selecionado");
        window.scroll(0, 0);
        var mainContainer = $("<main>");
        var descricaoSection = $("<section>").addClass("descricao");
        var descricaoContainer = $("<div>").addClass("descricao-container style1");
        var imagemContainer = $("<div>").addClass("imagem-container");
        var imgProduto = $("<img>").attr("src", produto.imgs[0]).attr("alt", "").css("max-height", "450px");
        var textoContainer = $("<div>").addClass("texto-container style2");
        var tituloProduto = $("<h1>").addClass("style3").text(produto.descricao);
        var linkConhecer = $("<a>").addClass("style4").attr("href", "#mais").text("conheça mais sobre este produto");
        var precoAntigo = $("<p>").addClass("style5").text("de " + produto.precoAntigo);
        var precoNovo = $("<p>").addClass("style6").text("R$ " + produto.precoNovo);
        var parcelado = $("<p>").addClass("style7").text("ou " + produto.parcelado[0] + "x de R$ " + produto.parcelado[1] + " s/ juros");
        var urlImagemSelecionada = window.location.href.split('/index.html')[0] + '/' + produto.imgs[0].split('./')[1];
        var linkComprar = $("<a>").addClass("style8").attr("href",
            `https://api.whatsapp.com/send?phone=556198366-5716&text=Olá gostaria de mais informações sobre o óculos: ${produto.descricao}, com o código: ${produto.id}, ${urlImagemSelecionada} `).attr('target', '_blank').text("COMPRAR");

        // Construindo a estrutura HTML
        imagemContainer.append(imgProduto);
        descricaoContainer.append(imagemContainer);
        textoContainer.append(tituloProduto);
        textoContainer.append(linkConhecer);
        textoContainer.append(precoAntigo);
        textoContainer.append(precoNovo);
        textoContainer.append(parcelado);
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
        var especificacoesProduto = $("<div>").addClass("especificacoes-produto style17");
        especificacoesProduto.append($("<h1>").addClass("style18").text("ESPECIFICAÇÕES DO PRODUTO"));
        var especificacoesGrid = $("<div>").addClass("especificacoes-grid");
        var especificacoesTipo = $("<div>").addClass("especificacoes-tipo");
        var especificacoesInfo = $("<div>").addClass("especificacoes-info");
        var especificacoesLabels = ["Por Gênero", "Material da Lente", "Material da Armação", "Garantia", "Proteção da Lente", "Por Estilo", "Cor da Armação", "Itens Inclusos", "Por Coleção", "Cor da Lente", "Lente", "Ponte", "Haste"];
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
    }





    function mudarCorFillSVG($elemento, cor) {
        $elemento.find('.icone-like').addClass('marcado');
    }

    function adicionarProdutoSelecionado(produto) {
        var produtosArmazenados = JSON.parse(localStorage.getItem('produtosSelecionados')) || {};
        if (!produtosArmazenados[categoria]) {
            produtosArmazenados[categoria] = [];
        }
        const objetosComID2 = produtosArmazenados[categoria].filter(objeto => objeto.id === produto.id);
        if (categoria != 'LIKE') {
            if (objetosComID2.length > 0) {
                produtosArmazenados[categoria].pop(produto);
                $(document).find(`#${produto.id}`).removeClass('marcado');
            } else {
                produtosArmazenados[categoria].push(produto);
            }
            localStorage.setItem('produtosSelecionados', JSON.stringify(produtosArmazenados));
        } else {
            Object.keys(produtosArmazenados).map((a) => {
                produtosArmazenados[a].map((produtoAchado) => {
                    if (produtoAchado.id === produto.id) {
                        produtosArmazenados[a] = produtosArmazenados[a].filter(produto => produto !== produtoAchado)  //.pop(produtoAchado);
                        localStorage.setItem('produtosSelecionados', JSON.stringify(produtosArmazenados));
                        $(document).find(`.item-${produto.id}`).fadeOut();
                        $(document).find(`#${produto.id}`).removeClass('marcado');
                    }
                })
            });
        }

    }

    if (window.matchMedia("(max-width: 768px)").matches) {
        // Se sim, vincular o evento de clique ao elemento com a classe .menu
        $('.menu').click(() => {
            $('.lista-opcoes ul').toggle();
        });

        // Se sim, vincular o evento de clique a todos os elementos dentro de .lista-opcoes ul
        $('.lista-opcoes ul').on("click", "*", function () {
            $('.lista-opcoes ul').hide(); // Ocultar o elemento com id "content"
        });
    }




    $('.like').click(carregarItensLike);

    function carregarItensLike() {
        $(".categorias li").removeClass("selecionado");
        categoria = 'LIKE';
        $(".itens").empty();
        let liked = JSON.parse(localStorage.getItem('produtosSelecionados'));
        Object.keys(liked).map((a) => {
            liked[a].map((produto) => {
                adicionarItem(produto);
            })
        });
    }

    function marcarLike(id) {
        let valor = false
        let liked = JSON.parse(localStorage.getItem('produtosSelecionados'));
        if (!liked) {
            return false
        }
        Object.keys(liked).map((a) => {
            liked[a].map((produto) => {
                if (produto.id == id) {
                    valor = true;
                }
            })
        });
        return valor;
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

        categoria = "GLAMUROSAS";
        carregarItensCategoria(categoria);

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
        filtrarProdutos(query);
    });

    function filtrarProdutos(query) {
        $(".itens").empty();
        var encontrouCorrespondencia = false;
        if (categoria != 'LIKE') {
            if (database.hasOwnProperty(categoria)) {
                $.each(database[categoria], function (index, produto) {
                    if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                        adicionarItem(produto);
                        encontrouCorrespondencia = true;
                    }
                });
            }
        } else {
            let liked = JSON.parse(localStorage.getItem('produtosSelecionados'));
            Object.keys(liked).map((a) => {
                liked[a].map((produto) => {
                    if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                        adicionarItem(produto);
                        encontrouCorrespondencia = true;
                    }
                })
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
        filtrarProdutos(query);
    });

    $(".search-bar input").on("input", function () {
        var query = $(this).val();
        filtrarProdutos(query);
    });
});
