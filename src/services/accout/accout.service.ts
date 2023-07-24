import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { AccoutCreate } from 'src/DTOS/accout.dto';

@Injectable()
export class AccoutService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async create(item: AccoutCreate) {
    try {
      const query =
        'INSERT IN external_accout (tpye_accout, title, detail, total, user_id, branch_id) VALUES (?, ?, ?, ?, ?, ?)';
      const value = [
        item.type_accout,
        item.title,
        item.detail,
        item.total,
        item.user_id,
        item.branch_id,
      ];
      const create = await this.connect.execute(query, value);
      const { insertId } = create as any;
      return insertId;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll() {
    try {
      const query = 'SELECT * FROM external_accout';
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number) {
    try {
      const query = 'SELECT * FROM external_accout WHERE id = ?';
      const value = [id];
      const findById = await this.connect.execute(query, value);
      return findById;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
