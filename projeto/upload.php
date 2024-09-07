<?php
$mensagem = ""; // Inicialize a variável de mensagem
$uploadOk = 1;  // Inicialize o status do upload

// Defina o diretório onde as imagens serão salvas
$target_dir = "/home/u367086902/domains/bysunoculos.com.br/public_html/imagens-oculos/";

// Pegue a extensão do arquivo enviado
$imageFileType = strtolower(pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION));

// Crie um novo nome de arquivo usando o timestamp com um ID único
$novoNomeArquivo = time() . '_' . uniqid() . '.' . $imageFileType;

// Caminho completo do arquivo a ser salvo
$target_file = $target_dir . $novoNomeArquivo;

// Verifique se o arquivo é uma imagem real
if (isset($_FILES["imagem"])) {
    $check = getimagesize($_FILES["imagem"]["tmp_name"]);
    if ($check !== false) {
        $mensagem .= "Arquivo é uma imagem - " . $check["mime"] . ".<br>";
    } else {
        $mensagem .= "Arquivo não é uma imagem.<br>";
        $uploadOk = 0;
    }
} else {
    $mensagem .= "Nenhum arquivo enviado.<br>";
    $uploadOk = 0;
}

// Verifique se o arquivo já existe (embora com o timestamp e uniqid isso seja improvável)
if (file_exists($target_file)) {
    $fileUrl = '/imagens-oculos/' . $novoNomeArquivo;
    echo json_encode(['status' => 'success', 'url' => $fileUrl, 'message' => 'Imagem já existe']);
    exit;
}

// Limite o tamanho do arquivo
if ($_FILES["imagem"]["size"] > 500000) {
    $mensagem .= "Desculpe, o seu arquivo é muito grande.<br>";
    $uploadOk = 0;
}

// Permita apenas certos formatos de arquivo
if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
    $mensagem .= "Desculpe, apenas arquivos JPG, JPEG, PNG e GIF são permitidos.<br>";
    $uploadOk = 0;
}

// Verifique se $uploadOk está definido como 0 devido a um erro
if ($uploadOk == 0) {
    echo json_encode(['status' => 'error', 'message' => $mensagem]);
} else {
    if (move_uploaded_file($_FILES["imagem"]["tmp_name"], $target_file)) {
        $fileUrl = '/imagens-oculos/' . $novoNomeArquivo;
        echo json_encode(['status' => 'success', 'url' => $fileUrl, 'message' => 'Upload realizado com sucesso']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Desculpe, ocorreu um erro ao enviar seu arquivo.']);
    }
}
?>
