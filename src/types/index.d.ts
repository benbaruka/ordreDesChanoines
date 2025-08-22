export interface CredentialsAuth {
  email: string;
}
export interface CreadentialsAuthWithPwd {
  email: string;
  password: string;
}
export interface ResponseLog {
  status: boolean;
  message: string;
  data: DataResponseLog;
}

export interface DataResponseLog {
  user: UserResponseLog;
  token: TokenResponseLog;
}

export interface UserResponseLog {
  id: string;
  full_name: string;
  username: string;
  role_id: string;
  email: string;
  phone_number: string;
  avatar: any;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  role: RoleResponseLog;
  special_permissions: SpecialPermissionResponseLog[];
  role_name: string;
}

export interface RoleResponseLog {
  id: string;
  name: string;
  description: string;
  permissions: PermissionResponseLog[];
}

export interface PermissionResponseLog {
  module: string;
  path: string;
  actions: string[];
}

export interface SpecialPermissionResponseLog {
  module: string;
  path: string;
  actions: string[];
}

export interface TokenResponseLog {
  type: string;
  name: any;
  token: string;
  abilities: string[];
  lastUsedAt: any;
  expiresAt: any;
}

// export interface ResponseRole {
//   status: boolean;
//   data: DataResponseRole;
// }

// export interface DataResponseRole {
//   meta: MetaResponseRole;
//   data: DaumResponseRole[];
// }

// export interface MetaResponseRole {
//   total: number;
//   perPage: number;
//   currentPage: number;
//   lastPage: number;
//   firstPage: number;
//   firstPageUrl: string;
//   lastPageUrl: string;
//   nextPageUrl: any;
//   previousPageUrl: any;
// }

// export interface DaumResponseRole {
//   id: string;
//   name: string;
//   description: any;
//   status: boolean;
//   created_at: string;
//   updated_at: string;
//   permissions: PermissionResponseRole;
// }
// export interface PermissionResponseRole {
//   user: User[];
//   product: Product[];
//   seller: Seller[];
// }

export interface ResponseMe {
  status: boolean;
  data: DataResponseMe;
}
export interface CreatePermission {
  module: string;
}

export interface DataResponseMe {
  id: string;
  full_name: string;
  username: string;
  role_id: string;
  email: string;
  phone_number: any;
  avatar: any;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  role: RoleResponseMe;
  specialPermissions: SpecialPermissionsResponseMe;
}

export interface RoleResponseMe {
  id: string;
  name: string;
  description: string;
  permissions: PermissionsResponseMe;
}

export interface PermissionsResponseMe {}

export interface SpecialPermissionsResponseMe {}

export interface ResponseTrans {
  status: boolean;
  data: DataResponseTrans;
}

export interface DataResponseTrans {
  meta: Meta;
  data: DaumResponseTrans[];
}
export interface ActivityResponseTrans {
  id: string;
  name: string;
  description: any;
}
export interface Meta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: any;
  previousPageUrl: any;
}

export interface DaumResponseTrans {
  id: string;
  type: number;
  designation: string;
  comment: string;
  amount: number;
  activity: ActivityResponseTrans;
  rapport_at: string;
  created_at: string;
  updated_at: string;
  user: UserResponseTrans;
}

export interface UserResponseTrans {
  id: string;
  full_name: string;
  email: string;
  avatar: any;
  role: Role;
}

export interface RoleResponseTrans {
  id: string;
  name: string;
  description: string;
}

export interface ResponseActivities {
  status: boolean;
  data: DataResponseActivities;
}

export interface DataResponseActivities {
  meta: Meta;
  data: DaumResponseActivities[];
}

export interface DaumResponseActivities {
  id: string;
  name: string;
  description: any;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResponseUser {
  status: boolean;
  data: DataResponseUser;
}

export interface DataResponseUser {
  meta: Meta;
  data: DaumResponseUser[];
}

export interface DaumResponseUser {
  id: string;
  full_name: string;
  email: string;
  avatar: any;
  status: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface RoleResponseUser {
  id: string;
  name: string;
  description: string;
}

export interface CreateTrans {
  transactions: DataTrans[];
}

export interface DataTrans {
  type: number;
  activity_id: string;
  designation: string;
  comment: string;
  amount: number;
  rapport_at: string;
}

export interface ResponseUpdateTrans {
  activity_id: string;
  designation: string;
  comment: string;
  amount: number;
  rapport_at: string;
}
export interface CreateActivity {
  name: string;
  description: string;
}
export interface ResponseActivity {
  status: boolean;
  data: Data;
}

export interface Data {
  meta: Meta;
  data: Daum[];
}

export interface Meta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: any;
  previousPageUrl: any;
}

export interface Daum {
  id: string;
  name: string;
  description: any;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResponseBilan {
  status: boolean;
  data: DataResponseBilan;
}

export interface DataResponseBilan {
  year: string;
  results: ResultResponseBilan[];
  totals: TotalsResponseBilan;
}

export interface ResultResponseBilan {
  month: string;
  input: number;
  output: number;
  balance: number;
}

export interface TotalsResponseBilan {
  input: number;
  output: number;
  balance: number;
}

export interface ResponseState {
  status: boolean;
  data: Data;
}

export interface Data {
  total_inputs: number;
  total_outputs: number;
  difference: number;
}

export interface ResponseLine {
  input: number;
  output: number;
}

export interface DashboardLineData {
  status: boolean;
  data: Record<string, ResponseLine>; // La clé est une date au format YYYY-MM-DD
}
export interface ResponsePie {
  status: boolean;
  data: DataResponsePie;
}

export interface DataResponsePie {
  input: number;
  output: number;
}

export interface ResponseLastIn {
  status: boolean;
  data: DaumResponseLastIn[];
}

export interface DaumResponseLastIn {
  id: string;
  type: number;
  designation: string;
  amount: number;
  rapport_at: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface UserResponseLastIn {
  id: string;
  full_name: string;
  email: string;
  avatar: any;
}

export interface ResponseYears {
  status: boolean
  data: number[]
}