// const x = require("uniqid");

const handleError = (error) => {
    if (App.state !== 'init' && Object.keys(error).length) {
      let content = 'Сервер сообщил об ошибке: ';
  
      if (typeof error === 'object') {
        content += Object.values(error).join(' ');
      } else {
        content += error;
      }
  
      if (/[^.]$/.test(content)) {
        content += '.';
      }
    }
  }

/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    xhr.responseType = 'json';

    if (options.hasOwnProperty('headers')) {
        for (let key in options.headers) {
            xhr.headers(key, options.headers[key]);
        }
    }

    if (options.method === 'GET') {
        options.url += '?';
        for(let key in options.data) {
            options.url += key + '=' + options.data[key] + '&';
        }
        options.url = options.url.slice(0, -1);
    }
    else {
        for (let key in options.data) {
            formData.append(key, options.data[key]);
        }
    }

    try {
        xhr.open(options.method, options.url);
        xhr.withCredentials = true;
    
        xhr.onloadend = () => {
          if (String(xhr.status).startsWith('2')) {
            options.callback(xhr.response?.error, xhr.response);
          } else {
            let content = 'Сервер не принял запрос. ';
            content += `Ошибка ${xhr.status}: ${xhr.statusText}.`;
            console.log(content);
          }
        }
        xhr.send(formData);
      }
      catch (e) {
        console.log(e);
      }  
}
