const userInfo = {
  username: '',
  password: '',
  apiKey:'',
  requestToken:'',
  sessionId: ''
}

const username = document.getElementById('login')! as HTMLInputElement;
const password = document.getElementById('senha')! as HTMLInputElement;
const apiKey = document.getElementById('api-key')! as HTMLInputElement;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container')!;
let tokenButton = document.getElementById('token-button') as HTMLButtonElement;

tokenButton?.addEventListener('click', function(){
  criarRequestToken()
})

loginButton?.addEventListener('click', function(){
  criarRequestToken()
  logar();
})

searchButton?.addEventListener('click', () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let query = document.getElementById('search') as HTMLInputElement;
  let listaDeFilmes = procurarFilme(String(query));
  let ul = document.createElement('ul');
  ul.id = "lista"
  
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})



function preencherSenha() {
  userInfo.password = String(password.value);
  validateLoginButton();
}

 function preencherLogin() {
  userInfo.username = String(username.value);
  validateLoginButton();
}

function preencherApi() {
  userInfo.apiKey = String(apiKey.value);
  validateLoginButton();
}

function validateLoginButton() {
  if (userInfo.password && userInfo.username && userInfo.apiKey) {
    loginButton.disabled = false;
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
  let result: any = HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${userInfo.apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

function adicionarFilme(filmeId: string) {
  let result: any = HttpClient.get({
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
  let result: any = HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${userInfo.apiKey}&request_token=${userInfo.requestToken}`,
    method: "GET"
  })
  userInfo.sessionId = result.session_id;
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
}