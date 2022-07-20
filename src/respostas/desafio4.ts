const userInfo = {
  username: '',
  password: '',
  apiKey:'',
  requestToken:'',
  sessionId: ''
}

let listId = ''
const username = document.getElementById('login')! as HTMLInputElement;
const password = document.getElementById('senha')! as HTMLInputElement;
const apiKey = document.getElementById('api-key')! as HTMLInputElement;
const searchField = document.getElementById('search')! as HTMLInputElement;
const listName = document.getElementById('list-name')! as HTMLInputElement;
const listDescription = document.getElementById('list-description')! as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const searchButton = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container')!;
const tokenButton = document.getElementById('token-button') as HTMLButtonElement;
const createListButton = document.getElementById('create-list-button') as HTMLButtonElement;
const showList = document.getElementById('show-list') as HTMLButtonElement


tokenButton?.addEventListener('click', function(){
  criarRequestToken()
})

loginButton?.addEventListener('click', function(){
  logar();
  criarSessao();
})

searchButton?.addEventListener('click', () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let query = searchField.value.toString();
  let listaDeFilmes = procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  listaDeFilmes.then((onResolve) =>{
    for (const item of onResolve.results) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(item.original_title))
      let addButton = document.createElement('button')
      li.appendChild(addButton)
      addButton.addEventListener('click', () =>{
        adicionarFilme(item.id)
      })
      ul.appendChild(li)
    }
  })

  
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})

createListButton.addEventListener('click', () => {
  criarLista(listName.value.toString(), listDescription.value.toString())
})

showList?.addEventListener('click', () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let listaDeFilmes = pegarLista();
  let ul = document.createElement('ul');
  ul.id = "lista"
  listaDeFilmes.then((onResolve) =>{
    for (const item of onResolve.items) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(item.name))
      ul.appendChild(li)
    }
  })

  
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul)
})

function preencherSenha() {
  userInfo.password = String(password.value);
  validateTokenButton();
}

 function preencherLogin() {
  userInfo.username = String(username.value);
  validateTokenButton();
}

function preencherApi() {
  userInfo.apiKey = String(apiKey.value);
  validateTokenButton();
}

function validateLoginButton() {
  if (userInfo.password && userInfo.username && userInfo.apiKey && userInfo.requestToken) {
    loginButton.disabled = false;
    tokenButton.disabled = false;
  }
}

function validateTokenButton() {
  if (userInfo.password && userInfo.username && userInfo.apiKey) {
    tokenButton.disabled = false;
  }
}


class HttpClient {
  static get({url= "", method = "", body = {}}): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }

      const requestBody = JSON.stringify(body)
      request.send(JSON.parse(requestBody));
    })
  }
}


function procurarFilme(query: string) {
  query = encodeURI(query)
  console.log(query)
  let result = HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${userInfo.apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

function adicionarFilme(filmeId: number) {
  let result = HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${userInfo.apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

function criarRequestToken () {
  const result = HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${userInfo.apiKey}`,
    method: "GET"
  })
  result
  .then((resolve) => userInfo.requestToken = resolve.request_token)
  .then(() => validateLoginButton())
  .catch((reject)=> console.log("ERROR"))
  
  console.log(userInfo.requestToken)
}

function logar() {
   HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${userInfo.apiKey}`,
    method: "POST",
    body: {
      username: `${userInfo.username}`,
      password: `${userInfo.password}`,
      request_token: `${userInfo.requestToken}`
    }
  })
}

 function criarSessao() {
  const result = HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${userInfo.apiKey}&request_token=${userInfo.requestToken}`,
    method: "GET"
  })
  result
  .then((resolve) => userInfo.sessionId = resolve.session_id)
  .catch((reject)=> console.log("ERROR"))
}

 function criarLista(nomeDaLista: string, descricao: string) {
  let result =  HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${userInfo.apiKey}&session_id=${userInfo.sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
   return result.then((onResolved) => listId = onResolved.id)
  .catch((onRejected) => console.log("ERROR"))
  
}

 function adicionarFilmeNaLista(filmeId: string, listaId: string) {
  let result =  HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${userInfo.apiKey}&session_id=${userInfo.sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

 function pegarLista() {
  let result =  HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${userInfo.apiKey}`,
    method: "GET"
  })
  console.log(result);
  return result
  
}