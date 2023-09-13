import { sql } from '@vercel/postgres';


async function getAll() {
  const { rows } = await sql`SELECT * FROM chats;`;

  return rows;
}

async function push(chatId) {
  try {
    await sql`INSERT INTO chats (id) VALUES (${chatId});`;
  } catch (error) {
    console.log(error);
  }
}

async function remove(chatId) {
  try {
    await sql`DELETE FROM chats WHERE id =${chatId};`;
  } catch (error) {
    console.log(error);
  }
}


exports = {
  getAll: getAll,
  push: push,
  remove: remove
}
