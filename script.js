if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    // elementos da página
    const video = document.querySelector("#video");
    const canvas = document.querySelector('#canvas');
    const btnScreenshot = document.querySelector("#btnScreenshot");
    const screenshotsContainer = document.querySelector("#screenshots");

    // usar câmera frontal
    let useFrontCamera = true;

    // stream atual do vídeo
    let videoStream;

    // configurações do vídeo
    const configuracoes = {
        video: {
            width: {
                min: 320,
                ideal: 375,
                max: 2560,
            },
            height: {
                min: 500,
                ideal: 500,
                max: 500,
            },
        },
    };

    // take screenshot
    btnScreenshot.addEventListener("click", function () {
        const img = document.createElement("img");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        img.src = canvas.toDataURL("image/png");
        screenshotsContainer.innerHTML = '';
        screenshotsContainer.prepend(img);

        alteraDiv();
    });

    function enviaFoto() {
        //Para upload no servidor
        //converte imagem para base64
        var dataURL = canvas.toDataURL();

        //envia para servidor
        $.ajax({
            type: "POST",
            url: "src/controle.php",
            data: {
                imgBase64: dataURL
            }
        }).done(function (o) {
            console.log(o);
        });

        window.location.href = "finalizado.html";
    }

    // Iniciar
    async function initializeCamera() {
        configuracoes.video.facingMode = useFrontCamera ? "user" : "environment";

        try {
            videoStream = await navigator.mediaDevices.getUserMedia(configuracoes);
            video.srcObject = videoStream;
        } catch (err) {
            alert(err);
            alert("Não foi possível acessar a câmera");
        }
    }

    initializeCamera();
} else {
    alert('A API da câmera não está disponível no seu navegador');
}

function alteraDiv() {
    $('.div-camera').toggle();
    $('.div-foto').toggle();
}