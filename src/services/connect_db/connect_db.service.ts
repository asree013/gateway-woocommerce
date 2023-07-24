import { Injectable } from '@nestjs/common';
import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import confing_mysql from 'src/configs/confing_mysql';

@Injectable()
export class ConnectDbService {
  private connection: Connection;

  private async connect() {
    this.connection = await createConnection(confing_mysql);
  }
  constructor() {
    this.connect();
  }

  async querys(sql: string, params: any[] = []): Promise<any[]> {
    const [rows] = await this.connection.execute(sql, params);
    return rows as RowDataPacket[];
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    const [result] = await this.connection.execute(sql, params);
    return result;
  }
}
