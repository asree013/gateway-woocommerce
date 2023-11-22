export class PackingCase {
  id: number;
  pa_sku: string;
  names: string;
  counts: number;
  images: string;
  creata_at: Date;
  update_at: Date;
}

export class PackingCaseCreate {
  pc_sku: string;
  names: string;
  counts: number;
  images: string;
}

export class PackingCaseUpdate {
  id: number;
  pa_sku: string;
  names: string;
  counts: number;
  images: string;
}

export class PackingCaseDetail {
  id: number;
  pc_id: number;
  count_product_pack: number;
  count_product_item: number;
  create_at: Date;
  update_at: Date;
}

export class PackingCaseDetailCreate {
  product_id: number;
  pc_id: number;
  count_product_pack: number;
  count_product_item: number;
}

export class PackingCaseFull {
  id: number;
  pa_sku: string;
  names: string;
  counts: number;
  images: string;
  pc_id: number;
  count_product_pack: number;
  count_product_item: number;
  create_at: Date;
  update_at: Date;
}
