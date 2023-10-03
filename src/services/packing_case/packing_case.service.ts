import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import {
  PackingCase,
  PackingCaseCreate,
  PackingCaseDetail,
  PackingCaseDetailCreate,
  PackingCaseFull,
  PackingCaseUpdate,
} from 'src/DTOS/packingCase';
import { NotFound } from 'src/DTOS/Notfound';

@Injectable()
export class PackingCaseService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}
  notFound() {
    return {
      status: 204,
      message: 'is not item in database',
    };
  }
  async create(item: PackingCaseCreate): Promise<PackingCase> {
    try {
      const query = `
      INSERT INTO external_packing_case (pc_sku, names, counts, images) 
      VALUES ('?', '?', ?, '?')
      `;
      const value = [item.pa_sku, item.names, item.counts, item.images];
      const result = await this.connect.execute(query, value);
      const { inSertId } = result as any;
      const findId = await this.findById(inSertId);
      return findId;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createDetail(item: PackingCaseDetailCreate) {
    try {
      const query = `
        INSERT INTO external_packing_case_detail 
        (product_id, pc_id, count_product_pack, count_product_item)
        VALUES (?, ?, ?, ?)
      `;
      const value = [
        item.product_id,
        item.pc_id,
        item.count_product_pack,
        item.count_product_item,
      ];
      const create = await this.connect.execute(query, value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number): Promise<PackingCase | NotFound | any> {
    try {
      const response = {
        status: 204,
        message: 'is not item in Database',
      };
      const query = `
            SELECT * FORM external_packing_case WHERE id = ?
        `;
      const value = [id];
      const result = await this.connect.execute(query, value);
      if (result.length === 0) {
        return response;
      }
      return result[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<PackingCase[] | NotFound> {
    try {
      const qurey = `
            SELECT * FORM external_packing_case
        `;
      const result = await this.connect.querys(qurey);
      if (result.length === 0) {
        const response = {
          status: 204,
          message: 'is not item in Database',
        };
        return response;
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number): Promise<string | NotFound | any> {
    try {
      const findId = await this.findById(id);
      if (findId.status === 204) {
        return findId.message;
      } else {
        const query = `
            DELETE FORM external_packing_case WHERE id = ?
        `;
        const value = [id];
        const deleted = await this.connect.execute(query, value);
        if (deleted) {
          const response = {
            status: '202',
            message: 'Deleted Item!!!',
          };
          return response;
        }
      }
    } catch (error) {}
  }

  async update(item: PackingCaseUpdate): Promise<PackingCase> {
    try {
      const query = `
            UPDATE external_packing_case AS cases 
            SET cases.pc_sku = ?, cases.names = ?, cases.counts = ? cases.images = ?
            WHERE cases.id = ?
        `;
      const value = [
        item.pa_sku,
        item.names,
        item.counts,
        item.images,
        item.id,
      ];
      const update = await this.connect.execute(query, value);
      if (update) {
        return update;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // async getPacking(): Promise<PackingCaseFull | NotFound> {
  //   try {
  //     const query = `
  //           SELECT pack.*, packD.product_id, packD.count_product_pack, packD.count_product_item
  //           FROM external_packing_case AS pack
  //           LEFT JOIN external_packing_case_detail AS packD ON pack.id = packD.pc_id
  //       `;
  //     const result = await this.connect.execute(query);
  //     if (!result) {
  //       return this.notFound();
  //     } else {
  //       const packingObj: PackingCaseFull[] = [];
  //       const packingI = null;
  //       let packingCurrent: PackingCaseFull = null;

  //       for (const row of result) {
  //         if (row.id !== packingI) {
  //           if (packingCurrent) {
  //             packingObj.push(packingCurrent);
  //           }
  //           packingCurrent = {
  //             id: row.id,
  //             pa_sku: row.pa_sku,
  //             names: row.names,
  //             counts: row.counts,
  //             images: row.images,
  //             pc_id: row.pc_id,
  //             count_product_pack: row.count_product_pack,
  //             count_product_item: row.count_product_item,
  //             create_at: row.create_at,
  //             update_at: row.update_at,
  //           };
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }
}
