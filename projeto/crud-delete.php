<?php
// Define o caminho do arquivo JSON com base no ambiente
if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    // Ambiente local
    $jsonFile = __DIR__ . '/banco/banco-de-dados.json'; // Caminho relativo para o ambiente local
    $imageDir = __DIR__ . '/imagens-oculos/'; // Diretório local das imagens
} else {
    // Ambiente de produção
    $jsonFile = '/home/u367086902/domains/bysunoculos.com.br/public_html/banco/banco-de-dados.json'; // Caminho absoluto para o ambiente de produção
    $imageDir = '/home/u367086902/domains/bysunoculos.com.br/public_html/imagens-oculos/'; // Diretório de produção das imagens
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica se o arquivo JSON existe
    if (!file_exists($jsonFile)) {
        echo json_encode(['status' => 'error', 'message' => 'Arquivo JSON não encontrado']);
        exit;
    }

    $data = json_decode(file_get_contents($jsonFile), true);
    $produtoParaExcluir = json_decode(file_get_contents('php://input'), true);
    $categoria = $produtoParaExcluir['categoria'];
    $id = $produtoParaExcluir['id'];

    // Verifica se a categoria existe
    if (!isset($data[$categoria])) {
        echo json_encode(['status' => 'error', 'message' => 'Categoria não encontrada']);
        exit;
    }

    // Encontra e remove o produto
    $produtoEncontrado = false;
    foreach ($data[$categoria] as $index => $produto) {
        if ($produto['id'] == $id) {
            // Remove o produto do array
            $imagens = $produto['imgs']; // Captura as imagens do produto

            // Excluir as imagens associadas ao produto
            foreach ($imagens as $imagem) {
                $imagePath = $imageDir . $imagem;
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Remove a imagem do servidor
                }
            }

            unset($data[$categoria][$index]);
            $data[$categoria] = array_values($data[$categoria]); // Reindexar o array
            $produtoEncontrado = true;
            break;
        }
    }

    if (!$produtoEncontrado) {
        echo json_encode(['status' => 'error', 'message' => 'Produto não encontrado']);
        exit;
    }

    // Salva o arquivo JSON
    if (file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT)) === false) {
        echo json_encode(['status' => 'error', 'message' => 'Falha ao salvar o arquivo JSON']);
        exit;
    }

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
}
?>
