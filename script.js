/* ==========================================
   FINANSYS
   SISTEMA DE FINANÇAS
========================================== */


/* ==========================================
   DADOS
========================================== */

/*
    Os dados ficam salvos no navegador.

    Depois, quando você colocar banco de dados,
    essa parte será substituída pela API/backend.
*/


let transacoes =
    JSON.parse(
        localStorage.getItem("finansys_transacoes")
    ) || [];


let metas =
    JSON.parse(
        localStorage.getItem("finansys_metas")
    ) || [];


/* Nome do cliente */

let nomeUsuario =
    localStorage.getItem("finansys_nome")
    || "Cliente";


/* ==========================================
   ELEMENTOS
========================================== */

const modalTransacao =
    document.getElementById("modalTransacao");

const modalMeta =
    document.getElementById("modalMeta");


const formTransacao =
    document.getElementById("formTransacao");

const formMeta =
    document.getElementById("formMeta");


/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("nomeUsuario")
        .textContent = nomeUsuario;


    mostrarMesAtual();


    colocarDataAtual();


    atualizarDashboard();


    atualizarTransacoes();


    atualizarMetas();

});


/* ==========================================
   MÊS ATUAL
========================================== */

function mostrarMesAtual() {

    const data = new Date();

    const texto =
        data.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("mesAtual")
        .textContent =
        texto.charAt(0).toUpperCase()
        + texto.slice(1);

}


/* ==========================================
   DATA ATUAL NO FORMULÁRIO
========================================== */

function colocarDataAtual() {

    const data = new Date();


    const ano =
        data.getFullYear();


    const mes =
        String(data.getMonth() + 1)
            .padStart(2, "0");


    const dia =
        String(data.getDate())
            .padStart(2, "0");


    document.getElementById("data")
        .value =
        `${ano}-${mes}-${dia}`;

}


/* ==========================================
   FORMATAR DINHEIRO
========================================== */

function moeda(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* ==========================================
   SALVAR DADOS
========================================== */

function salvarDados() {

    localStorage.setItem(
        "finansys_transacoes",
        JSON.stringify(transacoes)
    );


    localStorage.setItem(
        "finansys_metas",
        JSON.stringify(metas)
    );

}


/* ==========================================
   CALCULAR FINANÇAS
========================================== */

function calcularFinancas() {

    let entradas = 0;

    let saidas = 0;


    transacoes.forEach(transacao => {

        if (transacao.tipo === "entrada") {

            entradas += Number(
                transacao.valor
            );

        } else {

            saidas += Number(
                transacao.valor
            );

        }

    });


    const saldo =
        entradas - saidas;


    return {

        entradas,
        saidas,
        saldo

    };

}


/* ==========================================
   ATUALIZAR DASHBOARD
========================================== */

function atualizarDashboard() {

    const dados =
        calcularFinancas();


    /*
        SALDO
    */

    document.getElementById("saldo")
        .textContent =
        moeda(dados.saldo);


    /*
        ENTRADAS
    */

    document.getElementById("entradas")
        .textContent =
        moeda(dados.entradas);


    /*
        SAÍDAS
    */

    document.getElementById("saidas")
        .textContent =
        moeda(dados.saidas);


    /*
        TEXTO DO SALDO
    */

    let textoSaldo;


    if (dados.saldo > 0) {

        textoSaldo =
            "Saldo positivo";

    } else if (dados.saldo < 0) {

        textoSaldo =
            "Atenção: saldo negativo";

    } else {

        textoSaldo =
            "Seu saldo está zerado";

    }


    document.getElementById("variacaoSaldo")
        .textContent =
        textoSaldo;


    /*
        METAS
    */

    document.getElementById(
        "quantidadeMetas"
    ).textContent =
        metas.length;


    atualizarResumoMetas();


    /*
        CATEGORIAS
    */

    atualizarCategorias();

}


/* ==========================================
   MODAL TRANSAÇÃO - ABRIR
========================================== */

document.getElementById(
    "btnAdicionar"
).addEventListener("click", () => {

    modalTransacao.classList.add("aberto");

    colocarDataAtual();

});


/* ==========================================
   FECHAR MODAL TRANSAÇÃO
========================================== */

document.getElementById(
    "fecharModal"
).addEventListener("click", fecharModalTransacao);


document.getElementById(
    "cancelarModal"
).addEventListener("click", fecharModalTransacao);


function fecharModalTransacao() {

    modalTransacao.classList.remove("aberto");

    formTransacao.reset();

    colocarDataAtual();

}


/* ==========================================
   CLICAR FORA DO MODAL
========================================== */

modalTransacao.addEventListener(
    "click",
    event => {

        if (
            event.target === modalTransacao
        ) {

            fecharModalTransacao();

        }

    }
);


/* ==========================================
   SALVAR TRANSAÇÃO
========================================== */

formTransacao.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        /*
            TIPO
        */

        const tipo =
            document.querySelector(
                'input[name="tipo"]:checked'
            ).value;


        /*
            DESCRIÇÃO
        */

        const descricao =
            document.getElementById(
                "descricao"
            ).value.trim();


        /*
            CATEGORIA
        */

        const categoria =
            document.getElementById(
                "categoria"
            ).value;


        /*
            VALOR
        */

        const valor =
            Number(
                document.getElementById(
                    "valor"
                ).value
            );


        /*
            DATA
        */

        const data =
            document.getElementById(
                "data"
            ).value;


        /*
            VALIDAÇÃO
        */

        if (!descricao) {

            alert(
                "Digite uma descrição."
            );

            return;

        }


        if (!valor || valor <= 0) {

            alert(
                "Digite um valor válido."
            );

            return;

        }


        /*
            CRIAR TRANSAÇÃO
        */

        const novaTransacao = {

            id: Date.now(),

            tipo,

            descricao,

            categoria,

            valor,

            data

        };


        /*
            COLOCAR NA LISTA
        */

        transacoes.push(
            novaTransacao
        );


        /*
            SALVAR
        */

        salvarDados();


        /*
            ATUALIZAR TELA
        */

        atualizarDashboard();

        atualizarTransacoes();


        /*
            FECHAR
        */

        fecharModalTransacao();

    }
);


/* ==========================================
   MOSTRAR TRANSAÇÕES
========================================== */

function atualizarTransacoes() {

    const lista =
        document.getElementById(
            "listaTransacoes"
        );


    /*
        Se não houver nada
    */

    if (transacoes.length === 0) {

        lista.innerHTML = `

            <div class="sem-transacoes">

                <div>📋</div>

                <p>
                    Nenhuma transação cadastrada.
                </p>

                <small>
                    Clique em "Adicionar transação"
                    para começar.
                </small>

            </div>

        `;

        return;

    }


    /*
        Ordenar pelas mais recentes
    */

    const ordenadas =
        [...transacoes]
            .sort(
                (a, b) =>
                    b.id - a.id
            );


    /*
        Mostrar somente as 8 últimas
    */

    const ultimas =
        ordenadas.slice(0, 8);


    lista.innerHTML = "";


    ultimas.forEach(transacao => {

        const item =
            document.createElement("div");


        item.className =
            "transacao";


        const sinal =
            transacao.tipo === "entrada"
                ? "+"
                : "-";


        const icone =
            transacao.tipo === "entrada"
                ? "↓"
                : "↑";


        item.innerHTML = `

            <div class="transacao-info">

                <div
                    class="transacao-icone
                    ${transacao.tipo}">

                    ${icone}

                </div>


                <div class="transacao-texto">

                    <strong>
                        ${escaparHTML(
                            transacao.descricao
                        )}
                    </strong>

                    <small>
                        ${escaparHTML(
                            transacao.categoria
                        )}
                    </small>

                </div>

            </div>


            <div>

                <span
                    class="valor-transacao
                    ${transacao.tipo}">

                    ${sinal}
                    ${moeda(
                        transacao.valor
                    )}

                </span>


                <button
                    class="btn-excluir"
                    onclick="excluirTransacao(
                        ${transacao.id}
                    )">

                    ×

                </button>

            </div>

        `;


        lista.appendChild(item);

    });

}


/* ==========================================
   EXCLUIR TRANSAÇÃO
========================================== */

function excluirTransacao(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta transação?"
        );


    if (!confirmar) {

        return;

    }


    transacoes =
        transacoes.filter(
            transacao =>
                transacao.id !== id
        );


    salvarDados();


    atualizarDashboard();

    atualizarTransacoes();

}


/* ==========================================
   CATEGORIAS
========================================== */

function atualizarCategorias() {

    const gastos = {};


    /*
        Somente saídas
    */

    transacoes.forEach(transacao => {

        if (
            transacao.tipo !== "saida"
        ) {

            return;

        }


        if (
            !gastos[transacao.categoria]
        ) {

            gastos[transacao.categoria] = 0;

        }


        gastos[transacao.categoria] +=
            Number(transacao.valor);

    });


    const total =
        Object.values(gastos)
            .reduce(
                (soma, valor) =>
                    soma + valor,
                0
            );


    /*
        TOTAL
    */

    document.getElementById(
        "totalGastos"
    ).textContent =
        moeda(total);


    /*
        LEGENDA
    */

    const legenda =
        document.getElementById(
            "legendaCategorias"
        );


    legenda.innerHTML = "";


    const cores = [
        "#7c4dff",
        "#36b9cc",
        "#4caf50",
        "#4285f4",
        "#f3a623",
        "#ef5350",
        "#ec407a",
        "#795548"
    ];


    const categorias =
        Object.entries(gastos)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 6);


    categorias.forEach(
        ([categoria, valor], index) => {

            const percentual =
                total > 0
                    ? (
                        valor / total * 100
                    ).toFixed(0)
                    : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "legenda-item";


            item.innerHTML = `

                <span
                    class="cor-legenda"
                    style="
                        background:
                        ${cores[index]};
                    ">
                </span>

                <span>
                    ${escaparHTML(
                        categoria
                    )}
                </span>

                <span>
                    ${moeda(valor)}
                </span>

                <span>
                    ${percentual}%
                </span>

            `;


            legenda.appendChild(item);

        }
    );


    /*
        Atualizar gráfico
    */

    atualizarDonut(
        categorias,
        total,
        cores
    );

}


/* ==========================================
   DONUT
========================================== */

function atualizarDonut(
    categorias,
    total,
    cores
) {

    const donut =
        document.getElementById(
            "donut"
        );


    if (
        categorias.length === 0 ||
        total === 0
    ) {

        donut.style.background =
            "#eeeeee";

        return;

    }


    let inicio = 0;

    const partes = [];


    categorias.forEach(
        ([categoria, valor], index) => {

            const graus =
                (valor / total) * 360;


            const fim =
                inicio + graus;


            partes.push(
                `${cores[index]}
                ${inicio}deg
                ${fim}deg`
            );


            inicio = fim;

        }
    );


    donut.style.background =
        `conic-gradient(
            ${partes.join(",")}
        )`;

}


/* ==========================================
   MODAL META
========================================== */

document.getElementById(
    "btnAdicionarMeta"
).addEventListener(
    "click",
    () => {

        modalMeta.classList.add(
            "aberto"
        );

    }
);


/* FECHAR */

document.getElementById(
    "fecharModalMeta"
).addEventListener(
    "click",
    fecharModalMeta
);


document.getElementById(
    "cancelarMeta"
).addEventListener(
    "click",
    fecharModalMeta
);


function fecharModalMeta() {

    modalMeta.classList.remove(
        "aberto"
    );

    formMeta.reset();

}


/* ==========================================
   SALVAR META
========================================== */

formMeta.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const nome =
            document.getElementById(
                "nomeMeta"
            ).value.trim();


        const valor =
            Number(
                document.getElementById(
                    "valorMeta"
                ).value
            );


        const guardado =
            Number(
                document.getElementById(
                    "valorGuardado"
                ).value
            ) || 0;


        if (!nome) {

            alert(
                "Digite o nome da meta."
            );

            return;

        }


        if (
            !valor ||
            valor <= 0
        ) {

            alert(
                "Digite um valor válido."
            );

            return;

        }


        if (
            guardado > valor
        ) {

            alert(
                "O valor guardado não pode ser maior que o objetivo."
            );

            return;

        }


        const novaMeta = {

            id: Date.now(),

            nome,

            valor,

            guardado

        };


        metas.push(
            novaMeta
        );


        salvarDados();


        atualizarMetas();

        atualizarDashboard();


        fecharModalMeta();

    }
);


/* ==========================================
   MOSTRAR METAS
========================================== */

function atualizarMetas() {

    const lista =
        document.getElementById(
            "listaMetas"
        );


    if (metas.length === 0) {

        lista.innerHTML = `

            <div class="sem-metas">

                <p>
                    Nenhuma meta cadastrada.
                </p>

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    metas.forEach(meta => {

        const percentual =
            Math.min(
                100,
                (
                    meta.guardado /
                    meta.valor
                ) * 100
            );


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "meta";


        item.innerHTML = `

            <div class="meta-top">

                <strong>
                    ${escaparHTML(
                        meta.nome
                    )}
                </strong>

                <span class="meta-percentual">
                    ${percentual.toFixed(0)}%
                </span>

            </div>


            <div class="meta-valores">

                <span>
                    ${moeda(
                        meta.guardado
                    )}
                </span>

                <span>
                    ${moeda(
                        meta.valor
                    )}
                </span>

            </div>


            <div class="meta-barra">

                <div
                    style="
                        width:
                        ${percentual}%;
                    ">
                </div>

            </div>


            <button
                class="btn-excluir"
                onclick="excluirMeta(
                    ${meta.id}
                )">

                Excluir

            </button>

        `;


        lista.appendChild(item);

    });

}


/* ==========================================
   RESUMO DAS METAS
========================================== */

function atualizarResumoMetas() {

    const quantidade =
        metas.length;


    const descricao =
        document.getElementById(
            "metasDescricao"
        );


    if (
        quantidade === 0
    ) {

        descricao.textContent =
            "Nenhuma meta cadastrada";

        document.getElementById(
            "progressoMetas"
        ).style.width = "0%";

        return;

    }


    let totalObjetivo = 0;

    let totalGuardado = 0;


    metas.forEach(meta => {

        totalObjetivo +=
            Number(meta.valor);

        totalGuardado +=
            Number(meta.guardado);

    });


    const percentual =
        totalObjetivo > 0
            ? (
                totalGuardado /
                totalObjetivo
            ) * 100
            : 0;


    descricao.textContent =
        `${quantidade} ${
            quantidade === 1
                ? "meta ativa"
                : "metas ativas"
        }`;


    document.getElementById(
        "progressoMetas"
    ).style.width =
        `${Math.min(
            100,
            percentual
        )}%`;

}


/* ==========================================
   EXCLUIR META
========================================== */

function excluirMeta(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta meta?"
        );


    if (!confirmar) {

        return;

    }


    metas =
        metas.filter(
            meta =>
                meta.id !== id
        );


    salvarDados();


    atualizarMetas();

    atualizarDashboard();

}


/* ==========================================
   SEGURANÇA
========================================== */

/*
    Impede que o usuário coloque HTML
    dentro da descrição/categoria.
*/

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;

}


/* ==========================================
   FECHAR MODAIS COM ESC
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            modalTransacao.classList.remove(
                "aberto"
            );

            modalMeta.classList.remove(
                "aberto"
            );

        }

    }
);


/* ==========================================
   FIM
========================================== */