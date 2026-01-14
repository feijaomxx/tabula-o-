// --- 1. CONFIGURAÇÃO INICIAL (Ao abrir a página) ---
window.onload = function() {
    // Pega data de hoje
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    
    // Preenche o campo data
    document.getElementById('data').value = `${dia}/${mes}/${ano}`;
};

// --- 2. MÁSCARAS (Formatação Visual) ---

// Formata Data: 01012024 -> 01/01/2024
function mascaraData(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
    if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    input.value = v;
}

// Formata Telefone: 11999998888 -> (11) 99999-8888
function mascaraTelefone(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    input.value = v;
}

// Formata Moeda e Chama Cálculo: 1500 -> 15,00
function formatarMoeda(input) {
    let v = input.value.replace(/\D/g, ""); // Remove tudo que não é número
    
    if (v === "") {
        input.value = "";
    } else {
        // Divide por 100 para ter os centavos
        v = (parseInt(v) / 100).toFixed(2) + "";
        // Troca ponto por vírgula
        v = v.replace(".", ",");
        // Adiciona separador de milhar se precisar
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        input.value = v;
    }
    
    // Sempre que mudar um valor, recalcula o total
    calcularTotal();
}

// --- 3. CÁLCULO AUTOMÁTICO DO TOTAL ---
function calcularTotal() {
    let total = 0;
    const campos = ['tv', 'bl', 'fone', 'movel'];

    campos.forEach(id => {
        let valor = document.getElementById(id).value;
        // Limpa formatação para somar (tira ponto e troca virgula por ponto)
        // Ex: "1.200,50" -> 1200.50
        valor = valor.replace(/\./g, "").replace(",", ".");
        
        // Se for número, soma. Se for vazio, soma 0.
        total += parseFloat(valor) || 0;
    });

    // Formata o total de volta para o padrão brasileiro
    document.getElementById('totalInput').value = total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });
}

// --- 4. GERAR TEXTO E COPIAR ---
function gerarRelatorio() {
    // Pegar valores dos campos
    const data = document.getElementById('data').value;
    const numero = document.getElementById('numero').value;
    const total = document.getElementById('totalInput').value;
    
    // Se o campo estiver vazio, poe "0,00" no texto final
    const tv = document.getElementById('tv').value || "0,00";
    const bl = document.getElementById('bl').value || "0,00";
    const fone = document.getElementById('fone').value || "0,00";
    const movel = document.getElementById('movel').value || "0,00";
    const assinatura = document.getElementById('assinatura').value;

    // Monta o texto (Template)
    const textoFinal = `#FEITO ATIVO COM O CLIENTE DIA:${data}
Plano atualizado combo multi: - MIGRAÇÃO DA LINHA:${numero}
Valor total:R$ ${total}
Valores individuais após venda:TV:R$${tv} BL:R$ ${bl}  FONE:R$ ${fone} MÓVEL :R$ ${movel}
Informou valores individuais: ( x ) SIM ( ) NÃO Informou fidelidade: ( x ) SIM ( )NÃO Orientou sobre 0800 e recebimento de chip: ( ) SIM ( x ) NÃO (caso seja necessário envio de chip) O Combo Multi é uma oferta que inclui seus serviços em um único contrato e na mesma fatura. Você une os seus serviços residenciais + serviços moveis e agora cliente paga menos, em comparação ao custo de cada um individualmente. Com o combo Multi contratado, o cliente agora recebe a cobrança com todas as informações bem detalhadas em uma única fatura. CLIENTE AGORA TEM UM ATENDIMENTO EXCLUSIVO ATRAVÉS DO 0800 723 6626. ${assinatura}`;

    // 1. Coloca o texto na caixa de visualização
    const textArea = document.getElementById('resultado');
    textArea.value = textoFinal;

    // 2. Tenta copiar
    
    // Seleciona o texto visualmente
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Para mobile

    try {
        // Tenta copiar via comando do navegador (funciona na maioria)
        document.execCommand('copy');
        mostrarAviso();
    } catch (err) {
        // Se falhar, tenta via Clipboard API
        navigator.clipboard.writeText(textoFinal).then(mostrarAviso);
    }
}

function mostrarAviso() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("toast show", "toast"); }, 3000);
}
