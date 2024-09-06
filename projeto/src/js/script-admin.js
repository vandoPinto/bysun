$(document).ready(function () {
    var database;
    var categoria;

    function changeSVG() {
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

    function chamarDetalhes(produto) {
        var url = "./editar.html" + "?" + $.param(produto);
        window.location.href = url;
    }

    // function excluirProduto(categoria, id) {
    //     Swal.fire({
    //         title: 'Você tem certeza?',
    //         text: "Esta ação não pode ser desfeita!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sim, excluir!',
    //         cancelButtonText: 'Cancelar'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             var produtoParaExcluir = {
    //                 categoria: categoria,
    //                 id: id
    //             };

    //             fetch('crud-delete.php', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(produtoParaExcluir)
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     if (data.status === 'success') {
    //                         toastr.success('Produto excluído com sucesso!', 'Sucesso');
    //                         console.log('Produto excluído:', produtoParaExcluir);


    //                         // Alternativa para garantir que o cache não interfira
    //                         setTimeout(() => {
    //                             // location.reload(); // Força uma recarga da página
    //                             // Recarregar os itens da categoria ou forçar recarga completa da página
    //                             atualizarInterface(categoria); // Atualiza a interface
    //                         }, 500); // Aguarda um pequeno intervalo
    //                     } else {
    //                         toastr.error('Erro ao excluir o produto: ' + data.message, 'Erro');
    //                     }
    //                 })
    //                 .catch(error => {
    //                     toastr.error('Erro ao enviar a solicitação!', 'Erro');
    //                     console.error('Erro:', error);
    //                 });
    //         } else {
    //             toastr.info('Ação cancelada.', ' ');
    //         }
    //     });
    // }


    // function atualizarInterface(categoria) {
    //     $(".itens").empty();
    //     carregarItensCategoria(categoria);
    // }

    function adicionarItem(produto, categorias) {
        let produtoSelecionado = { 'categoria': categorias, 'id': produto.id }
        var li = $("<li>").addClass(`item`).addClass(`item-${produto.id}`);

        var apagar = $("<img>").addClass("trash")
            .addClass(`svg airplane `)
            .attr('id', produto.id)
            .attr("src", "./img/icons/trash.svg")
            .attr("alt", "Apagar");

        var divCircle = $("<div>").addClass("circle")
            .click(() => {
                excluirProduto(categorias, produto.id);
            });

        var link = $("<div>").click(() => { chamarDetalhes(produtoSelecionado); });
        var imgProduto = $("<img>").addClass("imagem-produto").attr("src", './imagens-oculos/' + produto.imgs[0]).attr("alt", "Óculos");
        var descricaoProduto = $("<p>").addClass("descricao-produto").text(produto.descricao);
        var divPrecos = $("<div>").addClass("precos");
        var precoAntigo = $("<p>").addClass("preco-antigo").text("R$ " + produto.precoAntigo);
        var precoNovo = $("<p>").addClass("preco-novo").text("R$ " + produto.precoNovo);

        // divCircle.append(apagar);
        // li.append(divCircle);
        link.append(imgProduto);
        link.append(descricaoProduto);
        divPrecos.append(precoAntigo);
        divPrecos.append(precoNovo);
        link.append(divPrecos);
        li.append(link);

        $(".resultado-busca").css('display', 'flex');
        $(".itens").css('display', 'flex');
        $(".itens").append(li);
        changeSVG();
    }

    function carregarItensCategoria(categoria) {
        $(".itens").empty();

        var addNew = {
            "descricao": "Adicionar produto",
            "imgs": ["imagemvazia.jpg"],
            "precoAntigo": "0",
            "precoNovo": "0"
        };
        adicionarItem(addNew, categoria);

        if (database.hasOwnProperty(categoria)) {
            $.each(database[categoria], function (index, produto) {
                adicionarItem(produto, categoria);
            });
        }
    }

    var jsonPath;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        jsonPath = 'banco/banco-de-dados.json'; // Local
    } else {
        // Adiciona um timestamp ao final da URL para evitar cache
        jsonPath = 'https://bysunoculos.com.br/banco/banco-de-dados.json?v=' + new Date().getTime();
    }

    $.getJSON(jsonPath, function (data) {
        database = data;

        if (window.location.pathname === '/' || window.location.pathname === '/admin.html' || window.location.pathname === '/projeto/admin.html') {
            $.each(database, function (categoria, produtos) {
                $.each(produtos, function (index, produto) {
                    adicionarItem(produto, categoria);
                });
            });
        }

        $(".categorias li").click(function () {
            $(".categorias li").removeClass("selecionado");
            $(this).addClass("selecionado");
            var categoriaEscolhida = $(this).text().trim();
            carregarItensCategoria(categoriaEscolhida);
            categoria = categoriaEscolhida;
        });
    });

    if (window.matchMedia("(max-width: 768px)").matches) {
        $('.menu').click(() => {
            $('.lista-opcoes ul').toggle();
        });

        $('.lista-opcoes ul').on("click", "*", function () {
            $('.lista-opcoes ul').hide();
        });
    }

    $(".search-bar input").on("input", function () {
        var query = $(this).val();
        filtrarProdutos(query);
    });

    function filtrarProdutos(query) {
        $(".itens").empty();
        var encontrouCorrespondencia = false;
        if (categoria != 'LIKE') {
            $.each(database, function (categoria, produtos) {
                $.each(produtos, function (index, produto) {
                    if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                        adicionarItem(produto, categoria);
                        encontrouCorrespondencia = true;
                    }
                });
            });
        } else {
            let liked = JSON.parse(localStorage.getItem('produtosSelecionados'));
            Object.keys(liked).map((a) => {
                liked[a].map((produto) => {
                    if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                        adicionarItem(produto);
                        encontrouCorrespondencia = true;
                    }
                });
            });
        }

        if (!encontrouCorrespondencia) {
            var mensagemAviso = $("<li>").addClass("item-aviso").text("Nenhum produto correspondente encontrado.");
            $(".itens").append(mensagemAviso);
        }
    }
});
