import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const messages = await this.getMessages();

    return messages[id];
  }

  async findAll() {
    const messages = await this.getMessages();

    return messages;
  }

  async create(content: string) {
    const messages = await this.getMessages();
    const id = Math.floor(Math.random() * 999);

    messages[id] = { id, content };

    await writeFile('messages.json', JSON.stringify(messages));
  }

  async getMessages() {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents);
    return messages;
  }
}
