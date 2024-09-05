<?php
$mensagem = ""; // Inicialize a variável de mensagem
$uploadOk = 1;  // Inicialize o status do upload

// Defina o diretório onde as imagens serão salvas
$target_dir = "/home/u367086902/domains/bysunoculos.com.br/public_html/img/imagens-oculos/";
$target_file = $target_dir . basename($_FILES["imagem"]["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Verifique se o arquivo é uma imagem real
if(isset($_FILES["imagem"])) {
    $check = getimagesize($_FILES["imagem"]["tmp_name"]);
    if($check !== false) {
        $mensagem .= "Arquivo é uma imagem - " . $check["mime"] . ".<br>";
    } else {
        $mensagem .= "Arquivo não é uma imagem.<br>";
        $uploadOk = 0;
    }
}

// Verifique se o arquivo já existe
if (file_exists($target_file)) {
    $mensagem .= "Desculpe, o arquivo já existe.<br>";
    $uploadOk = 0;
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
    $mensagem .= "Desculpe, seu arquivo não foi enviado.<br>";
// Se tudo estiver ok, tente enviar o arquivo
} else {
    if (move_uploaded_file($_FILES["imagem"]["tmp_name"], $target_file)) {
        $mensagem .= "O arquivo ". htmlspecialchars(basename($_FILES["imagem"]["name"])). " foi enviado com sucesso.<br>";
    } else {
        $mensagem .= "Desculpe, ocorreu um erro ao enviar seu arquivo.<br>";
    }
}

// Redireciona de volta para o formulário com a mensagem
header("Location: editar.php?mensagem=" . urlencode($mensagem) . "&uploadOk=" . $uploadOk);
exit;
?>
