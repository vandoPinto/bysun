<?php
// Define o caminho do arquivo JSON com base no ambiente
if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    // Ambiente local
    $jsonFile = __DIR__ . '/banco/banco-de-dados.json'; // Caminho relativo para o ambiente local
} else {
    // Ambiente de produção
    $jsonFile = '/home/u367086902/domains/bysunoculos.com.br/public_html/banco/banco-de-dados.json'; // Caminho absoluto para o ambiente de produção
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica se o arquivo JSON existe
    if (!file_exists($jsonFile)) {
        echo json_encode(['status' => 'error', 'message' => 'Arquivo JSON não encontrado']);
        exit;
    }

    // Cria um backup do arquivo JSON antes de sobrescrever
    $backupDir = dirname($jsonFile) . '/backup/' . date('Y-m-d'); // Pasta com a data de hoje
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true); // Cria a pasta, caso não exista
    }

    $backupFile = $backupDir . '/banco-de-dados-' . time() . '.json'; // Arquivo com timestamp

    if (!copy($jsonFile, $backupFile)) {
        echo json_encode(['status' => 'error', 'message' => 'Falha ao criar backup do arquivo JSON']);
        exit;
    }

    // Lê o conteúdo atual do arquivo JSON
    $data = json_decode(file_get_contents($jsonFile), true);
    $produtoAtualizado = json_decode(file_get_contents('php://input'), true);
    $categoria = $produtoAtualizado['categoria'];
    $id = $produtoAtualizado['id'];

    // Verifica se a categoria já existe, se não, cria uma nova
    if (!isset($data[$categoria])) {
        $data[$categoria] = [];
    }

    // Atualiza ou adiciona o produto
    $produtoExistente = false;
    foreach ($data[$categoria] as &$produto) {
        if ($produto['id'] == $id) {
            // Atualiza o produto existente
            $produto = $produtoAtualizado;
            $produtoExistente = true;
            break;
        }
    }

    if (!$produtoExistente) {
        // Adiciona o novo produto ao array
        $data[$categoria][] = $produtoAtualizado;
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
