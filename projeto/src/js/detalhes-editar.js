$(() => {
    $('#imagem-input').change(function (event) {
        var input = event.target;
        var files = input.files;
        var thumbsContainer = $('#thumbs-container');

        // Limpa a lista de imagens
        thumbsContainer.empty();

        // Função para enviar cada arquivo para o servidor
        function uploadFile(file) {
            // Tamanhos máximos e qualidade para a imagem
            var maxWidth = 800;
            var maxHeight = 600;
            var quality = 0.9; // Valor entre 0 e 1, onde 1 é a melhor qualidade

            compressImage(file, maxWidth, maxHeight, quality, function (compressedBlob) {
                var formData = new FormData();
                formData.append('imagem', compressedBlob, file.name);
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
                                $('#thumbs-container img').removeClass('active'); // Remove a classe active de todos
                                $(this).addClass('active'); // Adiciona a classe active no thumbnail clicado
                            });

                            // toastr.success('Imagem enviada com sucesso!', 'Sucesso');
                        } else {
                            toastr.info('Imagem já existe: ' + data.url, 'Imagem Existente');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Erro ao enviar a imagem!', 'Erro');
                        console.error(textStatus, errorThrown);
                    }
                });
            });
        }

        // Loop através dos arquivos selecionados e envie cada um para o servidor
        $.each(files, function (index, file) {
            uploadFile(file);
        });

        function compressImage(file, maxWidth, maxHeight, quality, callback) {
            var img = document.createElement('img');
            var reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target.result;
            };

            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var width = img.width;
                var height = img.height;

                // Calcular novas dimensões
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Comprimir a imagem
                canvas.toBlob(function (blob) {
                    callback(blob);
                }, 'image/jpeg', quality); // Ajuste o tipo e a qualidade da imagem
            };

            reader.readAsDataURL(file);
        }
    });

    $('#thumbs-container').on('click', 'img', function () {
        var cover = $('#imagem-preview');
        var thumb = $(this).attr('src');
        if (cover.attr('src') !== thumb) {
            cover.fadeTo('200', '0', () => {
                cover.attr('src', thumb);
                cover.fadeTo('150', '1');
            });
        }
        $('#thumbs-container img').removeClass('active');
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

    if (produto.id) {
        // Edição de produto existente, busca os dados e preenche o formulário
        var jsonPath;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            jsonPath = 'banco/banco-de-dados.json'; // Caminho para o ambiente local
        } else {
            jsonPath = 'https://bysunoculos.com.br/banco/banco-de-dados.json'; // Caminho para o ambiente publicado
        }

        $.getJSON(jsonPath, function (data) {
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

        $('.submit').text('Salvar edição');
        $('.titulo').text(`Editar Óculos ${produto.categoria || 'Novo'}`);
    } else {
        // Produto novo, preenche com valores padrão
        console.log("Criar novo produto");

        // Valores padrão para novo produto
        // $('#nome').val('Nome do Produto');
        $('#preco-antigo').val('200,00');
        $('#preco').val('150,00');
        $('#descricao').val(`Estilo: Oval / Óculos de sol com design elegante e vintage. / Perfeito para adicionar um toque de sofisticação ao seu look. / Proteção UV: 100% UVA / UVB / Cor da armação: Marrom claro / Cor da lente: Marrom degradê / Inclui: 1 Óculos Solar, 1 Case e 1 Flanela para Limpeza.`);
        $('#material').val('Acetato premium ou metal');
        $('#genero').val('Feminino'); // ou outro valor padrão
        $('#protecao').val('Contra Raios UVA / UVB');
        $('#itens').val('Case e flanela');
        $('#cor').val('Degradê, Marrom');

        $('.excluir').hide(); // Esconde o botão de excluir para novo produto

        $('.titulo').text(`Cadastro de Óculos ${produto.categoria || 'Novo'}`);
    }

    $('#oculosForm').submit(function (e) {
        e.preventDefault(); // Prevenir comportamento padrão do formulário

        // Capturar valores dos inputs
        var id = produto.id || Date.now(); // Usa o id existente se estiver editando, senão cria um novo
        var nome = $('#nome').val();
        var precoAntigo = $('#preco-antigo').val();
        var precoNovo = $('#preco').val();
        var descricao = $('#descricao').val();
        var genero = $('#genero').val();
        var material = $('#material').val();
        var cor = $('#cor').val();
        var protecao = $('#protecao').val();
        var itens = $('#itens').val();
        var categoria = produto.categoria || 'NOVO'; // Defina a categoria do produto

        // Capturar as imagens
        var imagens = [];
        $('#thumbs-container img').each(function () {
            var srcArray = $(this).attr('src').split('/');
            var fileName = srcArray[srcArray.length - 1];
            imagens.push(fileName);
        });

        // Criar objeto no formato desejado
        var produtoAtualizado = {
            "id": id,
            "categoria": categoria,
            "imgs": imagens,
            "descricao": nome,
            "precoAntigo": precoAntigo,
            "precoNovo": precoNovo,
            "descricaoProduto": [
                descricao
            ],
            "especificaProduto": {
                "Material": material,
                "Genero": genero,
                "protecao": protecao,
                "Ítens inclusos": itens,
                "corLente": cor
            }
        };

        $.ajax({
            url: '../../crud-banco.php', // O URL do seu script PHP
            type: 'POST',
            data: JSON.stringify(produtoAtualizado),
            contentType: 'application/json',
            success: function (response) {
                var data = JSON.parse(response);
                if (data.status === 'success') {
                    var mensagem = produto.id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!';
                    toastr.success(mensagem, 'Sucesso');

                    // Limpar o formulário e as imagens após sucesso
                    limparFormulario();
                } else {
                    toastr.error('Erro ao adicionar ou atualizar o produto!', 'Erro');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Erro ao enviar os dados!', 'Erro');
                console.error(textStatus, errorThrown);
            }
        });
    });

    function popularInputs(produtoFind) {
        var especificacoes = Object.keys(produtoFind.especificaProduto);

        $('#nome').val(produtoFind.descricao);
        $('#preco-antigo').val(produtoFind.precoAntigo);
        $('#preco').val(produtoFind.precoNovo);
        $('#descricao').val(produtoFind.descricaoProduto.join("\n"));
        $('#genero').val(produtoFind.especificaProduto[especificacoes[1]]);
        $('#material').val(produtoFind.especificaProduto[especificacoes[0]]);
        $('#cor').val(produtoFind.especificaProduto[especificacoes[4]]);
        $('#protecao').val(produtoFind.especificaProduto[especificacoes[2]]);
        $('#itens').val(produtoFind.especificaProduto[especificacoes[3]]);

        // Adiciona as imagens no thumbs-container
        var thumbsContainer = $('#thumbs-container');
        thumbsContainer.empty(); // Limpa o contêiner de thumbnails
        produtoFind.imgs.forEach(function (imagem, index) {
            var thumb = $('<img>', {
                src: '../../imagens-oculos/' + imagem,
                class: 'thumb'
            });
            thumbsContainer.append(thumb);

            // Define a primeira imagem como imagem principal no preview
            if (index === 0) {
                $('#imagem-preview').attr('src', '../../imagens-oculos/' + imagem);
            }

            // Adiciona evento de clique para mudar a imagem principal ao clicar em um thumbnail
            thumb.on('click', function () {
                $('#imagem-preview').attr('src', '../../imagens-oculos/' + imagem);
                $('#thumbs-container img').removeClass('active'); // Remove a classe active de todos
                $(this).addClass('active'); // Adiciona a classe active no thumbnail clicado
            });
        });
    }

    function limparFormulario() {
        // $('#oculosForm')[0].reset();
        $('#thumbs-container').empty();
        $('#imagem-preview').attr('src', '');
    }


    $('.excluir').click(() => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Esta ação não pode ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                var produtoParaExcluir = {
                    categoria: produto.categoria,
                    id: produto.id
                };

                fetch('crud-delete.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(produtoParaExcluir)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            toastr.success('Produto excluído com sucesso!', 'Sucesso');
                            console.log('Produto excluído:', produtoParaExcluir);

                            // Alternativa para garantir que o cache não interfira
                            setTimeout(() => {
                                history.back();
                            }, 500); // Aguarda um pequeno intervalo
                        } else {
                            toastr.error('Erro ao excluir o produto: ' + data.message, 'Erro');
                        }
                    })
                    .catch(error => {
                        toastr.error('Erro ao enviar a solicitação!', 'Erro');
                        console.error('Erro:', error);
                    });
            } else {
                toastr.info('Ação cancelada.', ' ');
            }
        });
    })
});
