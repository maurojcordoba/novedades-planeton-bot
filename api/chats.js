const  path = require('path');
const fs = require ('fs');
const os = require ('os');

const path_chat = path.join(os.tmpdir(), 'chats.json');

function getAll() {
  if(!fs.existsSync(path_chat)){
    fs.writeFileSync(path_chat, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(path_chat));  
}

function push(chatId) {
  const data = getAll();
  data.push(chatId);
  save(data);
}

function remove(chatId) {
  const data = getAll();
  data.splice(data.indexOf(chatId));
  save(data);
}

function save(data) {
  fs.writeFileSync(path_chat, JSON.stringify(data));
}

module.exports = {
  getAll: getAll,
  push: push,
  remove: remove,
  save: save,
};
