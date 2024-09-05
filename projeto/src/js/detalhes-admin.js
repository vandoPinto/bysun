$(() => {
    $('#imagem-input').change(function (event) {
        var input = event.target;
        var files = input.files;
        var thumbsContainer = $('#thumbs-container');

        thumbsContainer.empty(); // Limpa a lista de imagens

        // Loop através dos arquivos selecionados
        $.each(files, function (index, file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // Adiciona as imagens na fila (thumbnails)
                var thumb = $('<img>', {
                    src: e.target.result,
                    class: index === 0 ? 'active' : '' // A primeira imagem será ativa
                });
                thumbsContainer.append(thumb);

                // Mostra a primeira imagem selecionada no preview principal
                if (index === 0) {
                    $('#imagem-preview').attr('src', e.target.result);
                }

                // Adiciona evento de clique para mudar a imagem principal ao clicar em um thumbnail
                thumb.on('click', function () {
                    $('#imagem-preview').attr('src', e.target.result);
                    $('.thumbs img').removeClass('active'); // Remove a classe active de todos
                    $(this).addClass('active'); // Adiciona a classe active no thumbnail clicado
                });
            }

            reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
        });
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


    var produto = (obterParametrosURL());
    if (produto.categoria != 'NOVO') {
        // $.getJSON("./src/banco-de-dados.json", function (data) {
        $.getJSON("https://bysun-740ca-default-rtdb.firebaseio.com/data.json", function (data) {
            database = data;
            $.each(database, function (categoria) {
                if (categoria === produto.categoria) {
                    if (database.hasOwnProperty(categoria)) {
                        $.each(database[categoria], function (index, produtoFind) {
                            if (produtoFind.id == produto.id) {
                                popularInputs(produtoFind);
                            }
                        });
                    }
                }
            });
        });
    } else {
        console.log("Criar novo produto");
    }

    $('#oculosForm').submit(function (e) {
        e.preventDefault(); // Prevenir comportamento padrão do formulário

        // Capturar valores dos inputs
        var id = 6; // ou você pode gerar dinamicamente
        var nome = $('#nome').val();
        var precoAntigo = $('#preco-antigo').val();
        var precoNovo = $('#preco').val();
        var descricao = $('#descricao').val();
        var genero = $('#genero').val();
        var material = $('#material').val();
        var cor = $('#cor').val();
        var protecao = $('#protecao').val();
        var itens = $('#itens').val();

        // Capturar as imagens
        var imagens = [];
        $('#thumbs-container img').each(function () {
            imagens.push($(this).attr('src').replace('./img/imagens-oculos/', ''));
        });

        // Criar objeto no formato desejado
        var produtoAtualizado = {
            "id": id, // Pode ser dinâmico
            "imgs": imagens,
            "descricao": nome,
            "precoAntigo": precoAntigo,
            "precoNovo": precoNovo,
            "descricaoProduto": [
                "Estilo: " + genero,
                descricao
            ],
            "especificaProduto": {
                "Material": material,
                "Genero": genero,
                "proteçao da lente": protecao,
                "Ítens inclusos": itens,
                "corLente": cor
            }
        };

        console.log(produtoAtualizado);

        // Aqui você pode enviar o objeto `produtoAtualizado` para o backend usando AJAX ou outro método
        // $.ajax({
        //     url: 'seu-endpoint.php',
        //     type: 'POST',
        //     data: JSON.stringify(produtoAtualizado),
        //     success: function (response) {
        //         console.log('Produto atualizado com sucesso:', response);
        //     }
        // });
    })

    function popularInputs(produtoFind) {
        var especificacoes = Object.keys(produtoFind.especificaProduto)

        $('#nome').val(produtoFind.descricao);
        $('#preco-antigo').val(produtoFind.precoAntigo);
        $('#preco').val(produtoFind.precoNovo);
        $('#descricao').val(produtoFind.descricaoProduto);
        $('#genero').val(produtoFind.especificaProduto[especificacoes[0]]);
        $('#material').val(produtoFind.especificaProduto[especificacoes[1]]);
        $('#cor').val(produtoFind.especificaProduto[especificacoes[2]]);
        $('#protecao').val(produtoFind.especificaProduto[especificacoes[3]]);
        $('#itens').val(produtoFind.especificaProduto[especificacoes[4]]);

        if (produtoFind.imgs.length > 0) {
            $('#imagem-preview').attr('src', './img/imagens-oculos/' + produtoFind.imgs[0]);
        }
        $('#thumbs-container').empty();
        produtoFind.imgs.forEach(function (imagem, index) {
            var imgElement = $('<img>').attr('src', './img/imagens-oculos/' + imagem);
            if (index === 0) {
                imgElement.addClass('active');
            }
            $('#thumbs-container').append(imgElement);
        });

        $('#thumbs-container img').click(function () {
            $('#thumbs-container img').removeClass('active');
            $(this).addClass('active');
            $('#imagem-preview').attr('src', $(this).attr('src'));
        });
    }
})