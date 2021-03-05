import { Injectable } from '@nestjs/common';
import { ExampleCategory } from './example.enums';

@Injectable()
export class ExampleService {
  public async getRecords(category: ExampleCategory): Promise<string[]> {
    return ['recordA', 'recordB'];
  }

  public async add(record: string, category: ExampleCategory) {
    // ...
  }

  public async addBulk(records: string[], category: ExampleCategory) {
    // ...
  }
}
