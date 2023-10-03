export class CreateWareHouse {
  title: string;
  address: string;
  city: string;
  province: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
  user_id: number;
}
export class BranchCreateForUser {
  branch_id: number;
  user_id: number;
  role?: number;
}

export class Branch {
  title: string;
  address: string;
  city: string;
  province: string;
  postcode: number;
  country: string;
  email: string;
  phone: string;
}
