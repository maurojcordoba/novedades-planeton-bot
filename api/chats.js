import { path } from 'path';
import { readFileSync, writeFileSync,existsSync } from 'fs';
import { tmpdir } from 'os';

const path_chat = path.join(tmpdir(), 'chats.json');

function getAll() {
  if(!existsSync(path_chat)){
    writeFileSync(path_chat, JSON.stringify([]));
  }
  return JSON.parse(readFileSync(path_chat));  
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
  writeFileSync(path_chat, JSON.stringify(data));
}

module.exports = {
  getAll: getAll,
  push: push,
  remove: remove,
  save: save,
};
