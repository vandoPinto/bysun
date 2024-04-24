$(document).ready(function () {

    // $(".imagem-produto").hover(
    //     function () {
    //         console.log($(this)[0].currentSrc);
    //         // $(this).attr("src", "./img/imagens-oculos/imagem1.png"); // Certifique-se de que esta é a imagem correta
    //     },
    //     function () {
    //         // $(this).attr("src", "./img/imagens-oculos/front.png");
    //     }
    // );

    // $('.icone-like').click(function () {
    //     $(this).toggleClass('clicked');
    // });

    // Variável para armazenar os dados do banco de dados JSON
    var database;

    // Função para carregar os itens da categoria correspondente
    function carregarItensCategoria(categoria) {
        // Limpar a lista de itens
        $(".itens").empty();

        // Verificar se a categoria existe no banco de dados
        if (database.hasOwnProperty(categoria)) {
            // Iterar sobre os produtos da categoria
            $.each(database[categoria], function (index, produto) {
                // Criar elementos HTML para cada produto
                var li = $("<li>").addClass("item");
                var divCircle = $("<div>").addClass("circle");
                var imgLike = $("<img>").addClass("icone-like").attr("src", "./img/icons/coracao.svg").attr("alt", "Like produto");
                var link = $("<a>").attr("href", "https://api.whatsapp.com/send?phone=556198366-5716&text=Olá,%20gostaria%20de%20mais%20informações").attr("target", "_blank");
                var imgProduto = $("<img>").addClass("imagem-produto").attr("src", produto.imgs[0]).attr("alt", "Óculos");
                var descricaoProduto = $("<p>").addClass("descricao-produto").text(produto.descricao);
                var divPrecos = $("<div>").addClass("precos");
                var precoAntigo = $("<p>").addClass("preco-antigo").text("R$ " + produto.precoAntigo);
                var precoNovo = $("<p>").addClass("preco-novo").text("R$ " + produto.precoNovo);
                var parcelado = $("<p>").addClass("parcelado").text("ou " + produto.parcelado[0] + "x R$ " + produto.parcelado[1]);

                // Adicionar elementos ao DOM
                divCircle.append(imgLike);
                li.append(divCircle);
                link.append(imgProduto);
                link.append(descricaoProduto);
                divPrecos.append(precoAntigo);
                divPrecos.append(precoNovo);
                divPrecos.append(parcelado);
                link.append(divPrecos);
                li.append(link);

                // Adicionar o item à lista de itens
                $(".itens").append(li);
            });
        }
    }

    // Fazendo a solicitação fetch para o arquivo JSON
    $.getJSON("./src/banco-de-dados.json", function (data) {
        // Armazenar os dados do banco de dados na variável
        database = data;

        // Preencher a lista de categorias com os nomes das categorias do banco de dados
        $.each(database, function (categoria) {
            var categoriaItem = $("<li>").text(categoria).addClass('lista-categorias');
            if (categoria === "GLAMUROSAS") {
                categoriaItem.addClass("selecionado");
            }
            $(".categorias ul").append(categoriaItem);
        });

        // Inicialmente carregar os itens da categoria "GLAMUROSAS"
        carregarItensCategoria("GLAMUROSAS");

        // Manipular o evento de clique nos itens da lista de categorias
        $(".categorias li").click(function () {
            // Remover a classe 'selecionado' de todas as categorias
            $(".categorias li").removeClass("selecionado");
            // Adicionar a classe 'selecionado' à categoria selecionada
            $(this).addClass("selecionado");

            // Obter o texto do item clicado (nome da categoria)
            var categoria = $(this).text().trim();
            // Carregar os itens da categoria correspondente
            carregarItensCategoria(categoria);
        });
    });

    // Manipular o evento de digitação no campo de busca
    $(".search-bar input").on("input", function () {
        // Obter o valor de entrada do usuário
        var query = $(this).val();
        // Filtrar os produtos com base na consulta
        filtrarProdutos(query);
    });

    // Função para filtrar os produtos com base na entrada do usuário
    function filtrarProdutos(query) {
        // Limpar a lista de itens
        $(".itens").empty();

        // Variável para rastrear se algum produto correspondente foi encontrado
        var encontrouCorrespondencia = false;

        // Iterar sobre as categorias no banco de dados
        $.each(database, function (categoria, produtos) {
            // Iterar sobre os produtos dentro de cada categoria
            $.each(produtos, function (index, produto) {
                // Verificar se a descrição do produto contém a consulta (ignorando maiúsculas e minúsculas)
                if (produto.descricao.toLowerCase().includes(query.toLowerCase())) {
                    // Criar elementos HTML para cada produto correspondente
                    var li = $("<li>").addClass("item");
                    var divCircle = $("<div>").addClass("circle");
                    var imgLike = $("<img>").addClass("icone-like").attr("src", "./img/icons/coracao.svg").attr("alt", "Like produto");
                    var link = $("<a>").attr("href", "https://api.whatsapp.com/send?phone=556198366-5716&text=Olá,%20gostaria%20de%20mais%20informações").attr("target", "_blank");
                    var imgProduto = $("<img>").addClass("imagem-produto").attr("src", produto.imgs[0]).attr("alt", "Óculos");
                    var descricaoProduto = $("<p>").addClass("descricao-produto").text(produto.descricao);
                    var divPrecos = $("<div>").addClass("precos");
                    var precoAntigo = $("<p>").addClass("preco-antigo").text("R$ " + produto.precoAntigo);
                    var precoNovo = $("<p>").addClass("preco-novo").text("R$ " + produto.precoNovo);
                    var parcelado = $("<p>").addClass("parcelado").text("ou " + produto.parcelado[0] + "x R$ " + produto.parcelado[1]);

                    // Adicionar elementos ao DOM
                    divCircle.append(imgLike);
                    li.append(divCircle);
                    link.append(imgProduto);
                    link.append(descricaoProduto);
                    divPrecos.append(precoAntigo);
                    divPrecos.append(precoNovo);
                    divPrecos.append(parcelado);
                    link.append(divPrecos);
                    li.append(link);

                    // Adicionar o item à lista de itens
                    $(".itens").append(li);

                    // Indicar que uma correspondência foi encontrada
                    encontrouCorrespondencia = true;
                }
            });
        });

        // Verificar se nenhuma correspondência foi encontrada
        if (!encontrouCorrespondencia) {
            // Criar uma mensagem de aviso
            var mensagemAviso = $("<li>").addClass("item-aviso").text("Nenhum produto correspondente encontrado.");
            // Adicionar a mensagem de aviso à lista de itens
            $(".itens").append(mensagemAviso);
        }
    }


});
