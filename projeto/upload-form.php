<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload de Imagem</title>
    <style>
        /* Estilo básico para o formulário */
        .upload-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .upload-container input[type="file"] {
            margin: 10px 0;
        }

        .upload-container button {
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .upload-container button:hover {
            background-color: #0056b3;
        }

        .message {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
        }

        .message.success {
            background-color: #d4edda;
            color: #155724;
        }

        .message.error {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>

<body>
    <div class="upload-container">
        <h2>Upload de Imagem</h2>
        <form action="upload.php" method="post" enctype="multipart/form-data">
            <input type="file" name="imagem" accept="image/*" required>
            <button type="submit">Enviar Imagem</button>
        </form>

        <?php
        // Mostre a mensagem se ela existir
        if (isset($_GET['mensagem'])) {
            $mensagem = urldecode($_GET['mensagem']);
            $uploadOk = isset($_GET['uploadOk']) ? (int)$_GET['uploadOk'] : 0;
            $classe = $uploadOk == 1 ? "success" : "error";
            echo "<div class='message $classe'>$mensagem</div>";
        }
        ?>
    </div>
</body>

</html>
