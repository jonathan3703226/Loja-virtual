function aumentar(idDoSpan) {
    let elemento = document.getElementById(idDoSpan);
    let valorAtual = parseInt(elemento.innerText);
    elemento.innerText = valorAtual + 1;
}


function diminuir(idDoSpan) {
    let elemento = document.getElementById(idDoSpan);
    let valorAtual = parseInt(elemento.innerText);
    
    if (valorAtual > 0) {
        elemento.innerText = valorAtual - 1;
    }
}

function finalizarCompra() {
    let q1 = parseInt(document.getElementById('qtd1').innerText);
    let q2 = parseInt(document.getElementById('qtd2').innerText);
    let q3 = parseInt(document.getElementById('qtd3').innerText);
    let q4 = parseInt(document.getElementById('qtd4').innerText);
    let q5 = parseInt(document.getElementById('qtd5').innerText);

    let totalDeItens = q1 + q2 + q3 + q4 + q5;
    if (totalDeItens === 0) {
        alert("Nenhum produto foi selecionado.");
        return;
    }

    let sub1 = q1 * 250;
    let sub2 = q2 * 3500;
    let sub3 = q3 * 2800;
    let sub4 = q4 * 650;
    let sub5 = q5 * 2500;

    let totalCompra = sub1 + sub2 + sub3 + sub4 + sub5;

    let opcao = prompt("Forma de pagamento:\n1 - À vista\n2 - Cartão de débito\n3 - Cartão de crédito");

    if (opcao !== "1" && opcao !== "2" && opcao !== "3") {
        alert("Opção inválida!");
        return;
    }

    let nomePagamento = "";
    if (opcao === "1") nomePagamento = "À vista";
    if (opcao === "2") nomePagamento = "Cartão de débito";
    if (opcao === "3") nomePagamento = "Cartão de crédito";

    let desconto = 0;
    if (totalCompra >= 5000 && opcao === "1") {
        desconto = totalCompra * 0.10;
    }

    let totalAPagar = totalCompra - desconto;

    let texto = "<h2>Resumo da Compra</h2>";
    
    if (q1 > 0) texto += "<p>Fone de Ouvido: " + q1 + "x - Subtotal: R$ " + sub1 + ",00</p>";
    if (q2 > 0) texto += "<p>Notebook: " + q2 + "x - Subtotal: R$ " + sub2 + ",00</p>";
    if (q3 > 0) texto += "<p>Smart TV: " + q3 + "x - Subtotal: R$ " + sub3 + ",00</p>";
    if (q4 > 0) texto += "<p>Caixa de Som: " + q4 + "x - Subtotal: R$ " + sub4 + ",00</p>";
    if (q5 > 0) texto += "<p>Videogame: " + q5 + "x - Subtotal: R$ " + sub5 + ",00</p>";

    texto += "<hr>";
    texto += "<p>Forma de pagamento: " + nomePagamento + "</p>";
    texto += "<p>Total da Compra: R$ " + totalCompra + ",00</p>";
    texto += "<p>Desconto: R$ " + desconto + ",00</p>";
    texto += "<h3>Total Final: R$ " + totalAPagar + ",00</h3>";

    let divResumo = document.getElementById('resumo');
    divResumo.innerHTML = texto;
    divResumo.style.display = "block";
}