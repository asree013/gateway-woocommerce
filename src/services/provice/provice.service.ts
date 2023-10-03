import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';

@Injectable()
export class ProviceService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async getSector() {
    try {
      const query = `SELECT * FROM provience_geographies`;
      const result = await this.connect.querys(query);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getProvinceByID(id: number) {
    try {
      const query = `SELECT * FROM provience_provinces AS gr WHERE gr.geography_id = ?`;
      const value = [id];
      const result = await this.connect.querys(query, value);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAumpersById(id: number) {
    try {
      const query = `SELECT * FROM provience_amphures AS am WHERE am.province_id = ?`;
      const value = [id];
      const result = await this.connect.querys(query, value);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getTambolById(id: number) {
    try {
      const query = `SELECT * FROM provience_districts AS dt WHERE dt.amphure_id = ?`;
      const value = [id];
      const result = await this.connect.querys(query, value);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getTambolByTMId(id: number) {
    try {
      const query = `SELECT * FROM provience_districts AS dt WHERE id = ?`;
      const value = [id];
      const result = await this.connect.execute(query, value);
      return result[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getProvinceByidPV(id: number) {
    try {
      const query = `SELECT * FROM provience_provinces AS pv WHERE id = ? `;
      const value = [id];
      const result = await this.connect.execute(query, value);
      return result[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
