export{}

const botaoAtualizar = document.getElementById('atualizar-saldo');
const botaoLimpar = document.getElementById('limpar-saldo')!;
const soma = document.getElementById('soma')! as HTMLInputElement;
const campoSaldo = document.getElementById('campo-saldo');

let saldoTotal = 0;

limparSaldo()

function somarAoSaldo(soma: number) {
    if(campoSaldo){
        saldoTotal += soma
        campoSaldo.innerHTML = saldoTotal.toString();
        limparCampoSoma();
    }
}

function limparSaldo() {
    if(campoSaldo){
        saldoTotal = 0;
        campoSaldo.innerHTML = saldoTotal.toString();
    }
}

function limparCampoSoma(){
    soma.value = '';
}

if(botaoAtualizar){
    botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(Number(soma.value));
});}

botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});