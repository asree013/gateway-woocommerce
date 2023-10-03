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
      const query = `
      SELECT * FROM external_accout
      `;
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

  async findAllAccoutFormIdBranch(branch_id: number) {
    try {
      const query = `
        SELECT accout.*, branch.title AS br_title
        FROM external_accout AS accout 
        LEFT JOIN  external_branch AS branch ON branch.id = accout.branch_id
        WHERE accout.branch_id = ?
      `;
      const value = [branch_id];
      const find = await this.connect.querys(query, value);
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
      if (!item.date && !item.branch_id) {
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
        `;
        const findAll: AccoutAll[] = await this.connect.querys(query);
        if (findAll.length === 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          const accoutObject: any[] = [];
          let currentAccoutId = null;
          let currentAccout: any = null;

          for (const row of findAll) {
            if (row.id !== currentAccoutId) {
              if (currentAccout) {
                accoutObject.push(currentAccout);
              }
              currentAccout = {
                id: row.id,
                br_title: row.br_title,
                detail: row.detail,
                create_at: row.create_at,
                update_at: row.update_at,
                type_accout: row.type_accout,
                user_nicename: row.user_nicename,
                branch_id: row.branch_id,
                title: row.title,
                total: row.total,
                user_id: row.user_id,
                pic_accout: [],
              };
              currentAccoutId = row.id;
            }

            currentAccout.pic_accout.push({
              image: row.image,
            });
          }

          if (currentAccout) {
            accoutObject.push(currentAccout);
          }

          return accoutObject;
          // return searchDate;
        }
      }
      if (item.date && !item.branch_id) {
        console.log('date');
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
          WHERE accout.create_at LIKE '%${item.date}%'
        `;
        const searchDate: AccoutAll[] = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          console.log(202);

          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          const accoutObject: any[] = [];
          let currentAccoutId = null;
          let currentAccout: any = null;

          for (const row of searchDate) {
            if (row.id !== currentAccoutId) {
              if (currentAccout) {
                accoutObject.push(currentAccout);
              }
              currentAccout = {
                id: row.id,
                br_title: row.br_title,
                detail: row.detail,
                create_at: row.create_at,
                update_at: row.update_at,
                type_accout: row.type_accout,
                user_nicename: row.user_nicename,
                branch_id: row.branch_id,
                title: row.title,
                total: row.total,
                user_id: row.user_id,
                pic_accout: [],
              };
              currentAccoutId = row.id;
            }

            currentAccout.pic_accout.push({
              image: row.image,
            });
          }

          if (currentAccout) {
            accoutObject.push(currentAccout);
          }

          return accoutObject;
          // return searchDate;
        }
      }
      if (typeof item.branch_id === 'string' && !item.date) {
        console.log('branch');

        // const day = new Date();
        // const dates = day.getUTCDate();
        // const month = day.getUTCMonth() + 1;
        // const year = day.getUTCFullYear();
        const query = `
                        SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
                        FROM external_accout AS accout
                        LEFT JOIN wp_users AS users ON users.ID = accout.user_id
                        LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
                        LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
                        WHERE accout.branch_id = ${item.branch_id}
                        `;
        const searchDate: AccoutAll[] = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          const accoutObject: any[] = [];
          let currentAccoutId = null;
          let currentAccout: any = null;

          for (const row of searchDate) {
            if (row.id !== currentAccoutId) {
              if (currentAccout) {
                accoutObject.push(currentAccout);
              }
              currentAccout = {
                id: row.id,
                br_title: row.br_title,
                detail: row.detail,
                create_at: row.create_at,
                update_at: row.update_at,
                type_accout: row.type_accout,
                user_nicename: row.user_nicename,
                branch_id: row.branch_id,
                title: row.title,
                total: row.total,
                user_id: row.user_id,
                pic_accout: [],
              };
              currentAccoutId = row.id;
            }

            currentAccout.pic_accout.push({
              image: row.image,
            });
          }

          if (currentAccout) {
            accoutObject.push(currentAccout);
          }

          return accoutObject;
          // return searchDate;
        }
      }
      if (item.date && item.branch_id) {
        console.log('all');
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
          WHERE accout.create_at LIKE '${item.date}%' AND accout.branch_id = ${item.branch_id}
        `;
        const searchDate: AccoutAll[] = await this.connect.querys(query);
        if (searchDate.length <= 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          const accoutObject: any[] = [];
          let currentAccoutId = null;
          let currentAccout: any = null;

          for (const row of searchDate) {
            if (row.id !== currentAccoutId) {
              if (currentAccout) {
                accoutObject.push(currentAccout);
              }
              currentAccout = {
                id: row.id,
                br_title: row.br_title,
                detail: row.detail,
                create_at: row.create_at,
                update_at: row.update_at,
                type_accout: row.type_accout,
                user_nicename: row.user_nicename,
                branch_id: row.branch_id,
                title: row.title,
                total: row.total,
                user_id: row.user_id,
                pic_accout: [],
              };
              currentAccoutId = row.id;
            }

            currentAccout.pic_accout.push({
              image: row.image,
            });
          }

          if (currentAccout) {
            accoutObject.push(currentAccout);
          }

          return accoutObject;
          // return searchDate;
        }
      }
      if (item.branch_id.length > 1) {
        console.log('branch_id Array');
        const query = `
          SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
          FROM external_accout AS accout
          LEFT JOIN wp_users AS users ON users.ID = accout.user_id
          LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
          LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
        `;
        const findAll: AccoutAll[] = await this.connect.querys(query);
        if (findAll.length === 0) {
          const status = {
            status: 202,
            message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
          };
          return status;
        } else {
          const accoutObject: any[] = [];
          let currentAccoutId = null;
          let currentAccout: any = null;

          for (const row of findAll) {
            if (row.id !== currentAccoutId) {
              if (currentAccout) {
                accoutObject.push(currentAccout);
              }
              currentAccout = {
                id: row.id,
                br_title: row.br_title,
                detail: row.detail,
                create_at: row.create_at,
                update_at: row.update_at,
                type_accout: row.type_accout,
                user_nicename: row.user_nicename,
                branch_id: row.branch_id,
                title: row.title,
                total: row.total,
                user_id: row.user_id,
                pic_accout: [],
              };
              currentAccoutId = row.id;
            }

            currentAccout.pic_accout.push({
              image: row.image,
            });
          }

          if (currentAccout) {
            accoutObject.push(currentAccout);
          }

          return accoutObject;
          // return searchDate;
        }
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
      const query = `SELECT accout.*, users.user_nicename, branch.title AS br_title, eia.image AS image
      FROM external_accout AS accout
      LEFT JOIN wp_users AS users ON users.ID = accout.user_id
      LEFT JOIN external_branch AS branch ON branch.id = accout.branch_id
      LEFT JOIN external_images_accout AS eia ON accout.id = eia.accout_id
      WHERE accout.create_at LIKE '%2023-07-27%'
      
      `;
      const searchDate: AccoutAll[] = await this.connect.querys(query);
      if (searchDate.length <= 0) {
        const status = {
          status: 202,
          message: 'ยังไม่มีข้อมูลบัญชีในวันนี้',
        };
        return status;
      } else {
        const accoutObject: any[] = [];
        let currentAccoutId = null;
        let currentAccout: any = null;

        for (const row of searchDate) {
          if (row.id !== currentAccoutId) {
            if (currentAccout) {
              accoutObject.push(currentAccout);
            }
            currentAccout = {
              id: row.id,
              br_title: row.br_title,
              detail: row.detail,
              create_at: row.create_at,
              update_at: row.update_at,
              type_accout: row.type_accout,
              user_nicename: row.user_nicename,
              branch_id: row.branch_id,
              title: row.title,
              total: row.total,
              user_id: row.user_id,
              pic_accout: [],
            };
            currentAccoutId = row.id;
          }

          currentAccout.pic_accout.push({
            image: row.image,
          });
        }

        if (currentAccout) {
          accoutObject.push(currentAccout);
        }

        return accoutObject;
        // return searchDate;
      }
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

class AccoutAll {
  user_nicename: string;
  id: number;
  type_accout: string;
  title: string;
  detail: string;
  total: number;
  user_id: number;
  branch_id: number;
  pic_accout: [image: string];
  create_at: Date;
  update_at: Date;
  br_title: string;
  image: string;
}
