function techSolutionsSoeakTool() {
  if(window.location.pathname.includes("speak.html")) {
    console.log("Speak Page Test");
    let sendButton = document.querySelector("div.send");
    let textarea = document.querySelector("#coiso");

    //Check if a API webkitSpeechRecognition is compatible with the browser (window)
    if(!("webkitSpeechRecognition" in window)) {
      console.log("O reconhecimento de fala não é suportado neste navegador.");
      return;
    }

    //Speech Recognition API
    //window.SpeechRecognition: É a versão mais recente e padrão da API. A maioria dos navegadores modernos (como Firefox e Chrome) a suporta.
    //window.webkitSpeechRecognition: É uma versão mais antiga, prefixada, que foi criada pela Google para o navegador Chrome e outros baseados no motor WebKit. Alguns navegadores mais antigos ainda podem usá-la.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    //Cria uma nova instância do objeto SpeechRecognition;
    //Cria o start(), stop(), lang (idioma) e interimResults (resultado parcial);
    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // Apenas resultados finais
    recognition.lang = "pt-BR"; // Define o idioma para português do Brasil

    //Flag:
    let isRecording = false;

    //Resultado
    //Texto exibido na tela
    recognition.addEventListener("result", (e) => {
      //Acesso ao e.results. o [0][0] concede acesso ao transcript que é onde texto falado se armazena
      //Há outro objeto, chamado confidence, com valore numeral, que detalha o grau de confança do texto falado.
      const transcript = e.results[0][0].transcript;
      textarea.textContent = transcript;
      sendButton.textContent = "Clique para falar";
    });

    //Resultado
    //Se der erro...
    recognition.addEventListener("erro", (e) => {
      console.error("Erro no reconhecimento de fala:", e.error);
      isRecording = false;
      sendButton.textContent = "Clique para falar";
    });

    //Resultado
    //Quando a gravação encerrar!
    recognition.addEventListener("end", (e) => {
      console.log("Cabô");
      sendButton.textContent = "Clique para falar";
    });

    //Botão de gravar
    sendButton.addEventListener("click", () => {
      if(!isRecording) {
        recognition.start(); //Começa a gravar
        isRecording = true;
        sendButton.textContent = "Gravando...";
        console.log("Iniciando gravação...");
      }else {
        recognition.stop();
        isRecording = false;
      }
    });
  }
}
techSolutionsSoeakTool();