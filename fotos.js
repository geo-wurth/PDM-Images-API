(async() => {
    botaoCarregarFotos()
})();

// Cria o botão para carregar fotos
function botaoCarregarFotos()
{
    var dadosHtml;

    dadosHtml = '<div class="row justify-content-md-center text-center">' +
                    '<div class="col-md-8">' +
                        '<button type="button" class="btn btn-secondary w-100" id="botaoCarregar">Carregar imagens...</button>' +
                    '</div>' +
                '</div>';
                
    incluirBotao = document.getElementById("carregarImagens");

    incluirBotao.innerHTML = dadosHtml;

    document.getElementById("botaoCarregar").addEventListener("click", x => {acessaFotos()} );
}

async function acessaFotos()
{   
    buscarFotos().then(json => {
        window.dados = json
        carregarFotos();
    }).catch(error => erroCarregamento(error));
}

// Buscar fotos através do link
async function buscarFotos(link = 'https://picsum.photos/v2/list?page=1&limit=30') {
    const response = await fetch(link);

    if (!response.ok) {
        throw new Error(response.status);
    }

    const json = await response.json();

    return json;
}

// Carrega dos itens das fotos na página
function carregarFotos()
{
    apagarTudo()

    const json = window.dados;

    for (var i = 0 ; i < json.length; i ++) {
        const f = json[i];

        var novoLi = document.createElement("div");

        var elem = document.getElementById("listaFotos");

        elem.appendChild(novoLi);

        elem.lastElementChild.classList.add("listaFotos-item");
        elem.lastElementChild.classList.add("col-md-3");

        var fotos = document.getElementsByClassName("listaFotos-item");

        var dadosFotos = ''; 

        dadosFotos +=   '<div class="card" style="width: 18rem;">' +
                            '<img src="' + f.download_url + '" class="card-img-top"/>' +
                            '<div class="card-body">' + 
                                '<div class="d-flex flex-row justify-content-center">' + 
                                    '<a class="btn bg-secondary m-1" onclick="favoritarImagem(this)"><i class="bi bi-star"></i></a>' +
                                    '<a class="btn bg-secondary m-1" onclick="anotarFoto(this)"><i class="bi bi-pencil-square"></i></a>' +
                                    '<a class="btn bg-secondary m-1" onclick="apagarFoto(this)"><i class="bi bi-x-square"></i></a>' +
                                '</div>' +
                                '<div class="row pt-2">' +
                                    '<span></span>' +
                                '</div>' + 
                                '<input class="form-control js-escondido" type="text" placeholder="Anotação"/>' +
                                '<div class="row px-3">' +
                                    '<a class="js-escondidobtn btn bg-secondary mt-2 js-escondido" onclick="salvarAnotacao(this)">Salvar</a>' +
                                '</div>' +
                            '</div>';

        fotos[fotos.length - 1].innerHTML += dadosFotos;
    }

    document.getElementById("loader").classList.add("js-escondido");
}

// Mensagem de erro no carregamento
async function erroCarregamento(error) {

    erroElemento =  document.getElementById("loader").childNodes[0];
    
    erroElemento.textContent = "- Erro no carregamento -" + error;
}

// Favorita a foto
function favoritarImagem(selfElement)
{
    let icon = selfElement.getElementsByTagName("i")[0]
    
    icon.classList.remove("bi-star");
    icon.classList.add("bi-star-fill");

    selfElement.setAttribute("onclick", "desfavoritarImagem(this)");
}

// Desfavorita a foto
function desfavoritarImagem(selfElement)
{
    let icon = selfElement.getElementsByTagName("i")[0]
    
    icon.classList.remove("bi-star-fill");
    icon.classList.add("bi-star");

    selfElement.setAttribute("onclick", "favoritarImagem(this)");
}

// Anotar foto
function anotarFoto(selfElement)
{
    selfElement.parentElement.parentElement.getElementsByTagName("span")[0].classList.add("js-escondido");
    selfElement.parentElement.parentElement.getElementsByTagName("input")[0].classList.remove("js-escondido");
    selfElement.parentElement.parentElement.getElementsByTagName("a")[3].classList.remove("js-escondido");
}

// Salvar anotação
function salvarAnotacao(selfElement)
{
    var input = selfElement.parentElement.parentElement.getElementsByTagName("input")[0]
    var paragrafo = selfElement.parentElement.parentElement.getElementsByTagName("span")[0]
    
    paragrafo.innerText = input.value
    
    paragrafo.classList.remove("js-escondido");

    selfElement.parentElement.parentElement.getElementsByTagName("a")[3].classList.add("js-escondido");

    input.classList.add("js-escondido");
}

// Remover todos as pessoas listados e reinicia a página
function apagarTudo() {
    const node = document.getElementById("listaFotos");

    while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
    }

    document.getElementById("loader").classList.remove("js-escondido");
    document.getElementById("carregarImagens").classList.add("js-escondido");
}

// Remover foto
function apagarFoto(element) {
    element.parentElement.parentElement.parentElement.parentElement.remove();
}
