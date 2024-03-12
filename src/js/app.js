import WindowEdit from './WindowEdit';
import WindowController from './WindowController';

const conteiner = document.querySelector('.conteiner');
// const port = 9000;
// адрес сервера на render
const url = 'https://javascript-21-websockets-backend.onrender.com';

const edit = new WindowEdit(conteiner);
const controller = new WindowController(edit, url);
controller.init();
