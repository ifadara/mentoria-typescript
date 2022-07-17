type Pessoa = {
    nome: string
    idade: number
    profissao: Profissao
}

enum Profissao{
    ATRIZ,
    PADEIRO
}

let maria: Pessoa = {
    nome: "Maria",
    idade: 29,
    profissao: Profissao.ATRIZ
};


let roberto: Pessoa = {
    nome: "Roberto",
    idade: 19,
    profissao: Profissao.PADEIRO,
}


let laura: Pessoa = {
    nome: "Laura",
    idade: 32,
    profissao: Profissao.ATRIZ
};

let carlos: Pessoa = {
    nome: "carlos",
    idade: 19,
    profissao: Profissao.PADEIRO
}