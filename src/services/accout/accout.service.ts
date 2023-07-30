import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { AccoutCreate, AccoutUpdate } from 'src/DTOS/accout.dto';
import {
  AccoutSearchAdmin,
  ImagesCreate,
} from 'src/models/images.accout.model';

@Injectable()
export class AccoutService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async create(item: AccoutCreate) {
    try {
      const query =
        'INSERT INTO external_accout (type_accout, title, detail, total, user_id, branch_id) VALUES (?, ?, ?, ?, ?, ?)';
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
      const response = await this.findById(insertId);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll() {
    try {
      const query = `SELECT * FROM external_accout`;
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
      return findById[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, item: AccoutUpdate) {
    try {
      const query =
        'UPDATE external_accout SET type_accout = ?, title = ?, detail = ?, total = ? WHERE id = ?';
      const value = [item.type_accout, item.title, item.detail, item.total, id];
      await this.connect.execute(query, value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const query = 'DELETE FROM external_accout WHERE id = ?';
      const value = [id];
      await this.connect.execute(query, value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllAccoutFormIdBranch() {
    try {
      const query = `SELECT users.user_nicename , accout.* , branch.title AS br_title 
      FROM wp_users AS users LEFT JOIN external_accout AS accout ON users.ID = accout.user_id 
      LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id`;
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllAccoutFormIdBranchAndBranch(branch_id: number) {
    const day = new Date();
    const date = day.getUTCDate();
    const month = day.getUTCMonth() + 1;
    const year = day.getUTCFullYear();
    try {
      const query = `SELECT accout.*, users.user_nicename, branch.title AS br_title
      FROM external_accout AS accout
      LEFT JOIN wp_users AS users ON users.ID = accout.user_id
      LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
      WHERE accout.create_at LIKE '%${year}%${month}%${date}%' AND accout.branch_id = ${branch_id}
      `;
      const searchDate = await this.connect.querys(query);
      if (searchDate.length <= 0) {
        const status = {
          status: 202,
          message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
        };
        return status;
      }
      return searchDate;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllAccoutAdmin(item: AccoutSearchAdmin) {
    try {
      if (item.date && !item.branch_id) {
        console.log('date ', item.date);
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          WHERE accout.create_at LIKE '%${item.date}%'
        `;
        const searchDate = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          console.log(202);

          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          console.log(201);
          return searchDate;
        }
      }
      if (item.branch_id && !item.date) {
        console.log('branch_id ', item.branch_id);
        // const day = new Date();
        // const dates = day.getUTCDate();
        // const month = day.getUTCMonth() + 1;
        // const year = day.getUTCFullYear();
        const query = `SELECT accout.*, users.user_nicename, branch.title AS br_title
                        FROM external_accout AS accout
                        LEFT JOIN wp_users AS users ON users.ID = accout.user_id
                        LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
                        WHERE accout.branch_id = ${item.branch_id}
                        `;
        const searchDate = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        }
        return searchDate;
      }
      if (item.date && item.branch_id) {
        console.log('all', { branch_id: item.branch_id, date: item.date });
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          WHERE accout.create_at LIKE '${item.date}%' AND accout.branch_id = ${item.branch_id}
        `;
        const searchDate = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        }
        return searchDate;
      }
    } catch (error) {
      console.log('err', error);
      throw new BadRequestException(error);
    }
  }

  async findAllAccoutOnDate() {
    const day = new Date();
    const date = day.getUTCDate();
    const month = day.getUTCMonth() + 1;
    const year = day.getUTCFullYear();
    try {
      const query = `SELECT accout.*, users.user_nicename, branch.title AS br_title
      FROM external_accout AS accout
      LEFT JOIN wp_users AS users ON users.ID = accout.user_id
      LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
      WHERE accout.create_at LIKE '%${year}%${month}%${date}%'
      `;
      const searchDate = await this.connect.querys(query);
      if (searchDate.length <= 0) {
        const status = {
          status: 202,
          message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
        };
        return status;
      }
      return searchDate;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createImage(item: ImagesCreate) {
    console.log(item);

    try {
      const query =
        'INSERT INTO external_images_accout (accout_id, image) VALUES (?, ?)';
      return await Promise.all(
        item.image.map(async (r) => {
          const value = [item.accout_id, r];
          const result = await this.connect.execute(query, value);
          const { insertId } = result as any;
          const find = await this.FindImageByid(insertId);
          return find;
        }),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async FindImageAll() {
    try {
      const query = 'SELECT * FROM external_images_accout';
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async FindImageByid(id: number) {
    try {
      const query = 'SELECT * FROM external_images_accout WHERE id = ?';
      const value = [id];
      const find = await this.connect.execute(query, value);
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async FindImageByidAccout(id: number) {
    try {
      const query = 'SELECT * FROM external_images_accout WHERE accout_id = ?';
      const value = [id];
      const find = await this.connect.querys(query, value);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
