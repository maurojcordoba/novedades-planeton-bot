const fs = require('fs');
const path = require('path');

import { tmpdir } from 'os';

const path_chat = path.join(tmpdir(),'chats.json');

function getAll(){
  return JSON.parse(fs.readFileSync(path_chat))
}

function push(chatId){
  const data = getAll();
  data.push(chatId);
  save(data);
}

function remove(chatId){
  const data = getAll();
  data.splice(data.indexOf(chatId));
  save(data);
}


function save(data){
  fs.writeFileSync(path_chat, JSON.stringify(data));  
}

module.exports = {
  getAll: getAll,
  push: push,
  remove: remove,
  save: save
}
