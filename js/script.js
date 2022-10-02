const buttonCadastrar = document.getElementById("cadastrar");
const URL_API = "https://programacao-script-backend.herokuapp.com/empregados";
const idInput = document.getElementById("id");
const nomeInput = document.getElementById("nome");
const funcaoInput = document.getElementById("funcao");
const salarioInput = document.getElementById("salario");

async function cadastrar() {
    const id = idInput.value;
    const nome = nomeInput.value;
    const funcao = funcaoInput.value;
    const salario = Number(salarioInput.value);
    let urlBase = URL_API;
    let dado;
    let metodo;

    if (id) {
        metodo = "PUT";
        urlBase += `/${id}`;
        dado = {
            nome,
            funcao,
            salario,
        };
    } else {
        metodo = "POST";
        dado = {
            nome,
            funcao,
            salario,
        };
    }

    await fetch(urlBase, {
        method: metodo,
        body: JSON.stringify(dado),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
        .then((resposta) => {
            if (resposta.status == 200) {
                alert("Salvamento realizado com sucesso!");
            } else if (resposta.status == 400) {
                alert("Preencha todos os campos!");
            } else if (resposta.status == 500) {
                alert("Erro no servidor!");
            }
        })
        .catch((error) => {
            alert(error);
        });

    idInput.value = "";
    nomeInput.value = "";
    funcaoInput.value = "";
    salarioInput.value = "";
    consultar();
}

async function consultar() {
    let dados = await fetch(URL_API)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            alert(error);
        });

    let resposta = "";
    dados.map((dado) => {
        resposta += `
                <tr>
                    <td> ${dado.id} </td> 
                    <td> ${dado.nome} </td> 
                    <td> ${dado.funcao} </td>
                    <td>R$ ${dado?.salario
                        ?.toFixed(2)
                        .toString()
                        .replace(".", ",")} </td>
                    <td> <i onClick="atualiza(${dado.id}, '${dado.nome}', '${
            dado.funcao
        }', ${dado.salario})" class='bi bi-pencil  text-warning me-3'></i></td>
                    <td> <i onClick='remove(${
                        dado.id
                    })' class='bi bi-trash text-danger '></i> </td> 
                </tr>`;
    });

    document.getElementById("conteudoTabela").innerHTML = resposta;
}

async function remove(id) {
    let confirma = confirm(`Confirma exclusão do personagem? `);

    if (confirma) {
        await fetch(`${URL_API}/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                alert(`Personagem foi removido com sucesso`);
                consultar();
            })
            .catch((error) => {
                alert(`Problema na remoção`);
            });
    }
}

function atualiza(id, nome, funcao, salario) {
    idInput.value = id;
    nomeInput.value = nome;
    funcaoInput.value = funcao;
    salarioInput.value = salario;
}

consultar();
buttonCadastrar.addEventListener("click", cadastrar);
