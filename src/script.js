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
        changeSVG();
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

    $('.like').click(carregarItensLike)

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
