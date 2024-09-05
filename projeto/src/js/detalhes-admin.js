$(() => {
    $('#imagem-input').change(function (event) {
        var input = event.target;
        var files = input.files;
        var thumbsContainer = $('#thumbs-container');

        // Limpa a lista de imagens
        thumbsContainer.empty();

        // Função para enviar cada arquivo para o servidor
        function uploadFile(file) {
            var formData = new FormData();
            formData.append('imagem', file);

            $.ajax({
                url: 'upload.php', // O URL do seu script PHP de upload
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (data.status === 'success') {
                        // Adiciona a imagem no contêiner de thumbnails
                        var thumb = $('<img>', {
                            src: data.url,
                            class: 'thumb'
                        });
                        thumbsContainer.append(thumb);

                        // Atualiza o preview da imagem principal
                        if (thumbsContainer.find('img').length === 1) {
                            $('#imagem-preview').attr('src', data.url);
                        }

                        // Adiciona evento de clique para mudar a imagem principal ao clicar em um thumbnail
                        thumb.on('click', function () {
                            $('#imagem-preview').attr('src', data.url);
                            $('.thumbs img').removeClass('active'); // Remove a classe active de todos
                            $(this).addClass('active'); // Adiciona a classe active no thumbnail clicado
                        });

                        toastr.success('Imagem enviada com sucesso!', 'Sucesso');
                    } else {
                        toastr.error('Erro: ' + data.message, 'Erro');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    toastr.error('Erro ao enviar a imagem!', 'Erro');
                    console.error(textStatus, errorThrown);
                }
            });
        }

        // Loop através dos arquivos selecionados e envie cada um para o servidor
        $.each(files, function (index, file) {
            // Envie o arquivo para o servidor
            uploadFile(file);
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

    var produto = obterParametrosURL();
    if (produto.categoria != 'NOVO') {
        $.getJSON("https://bysun-740ca-default-rtdb.firebaseio.com/data.json", function (data) {
            var database = data;
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
            var srcArray = $(this).attr('src').split('/');
            var fileName = srcArray[srcArray.length - 1];
            imagens.push(fileName);
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
    });

    function popularInputs(produtoFind) {
        var especificacoes = Object.keys(produtoFind.especificaProduto);

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
});
