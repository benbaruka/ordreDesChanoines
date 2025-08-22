export const auth = {
  login: `/auth/login`,
};

export const activity = {
  get: `/activities`,
  update: `/activity`,
};

export const trans = {
  get: `/transactions`,
  update: `/transaction`,
  bilan: `/balance-sheet`,
};
export const dash = {
  getState: `/dash/stats`,
  getLine: `/dash/chart`,
  getPie: `/dash/pie-chart`,
  getLast: `/dash/last-transactions`,
  years: `/proposal/years`,
};

export const users = {
  getAll: `/users`,
  updateStatus: `/users/status`,
  updateRole: `/users/role`,
  proposal: `/users/proposal`,
};

export const me = {
  getAll: `/user/me`,
  update: `/user`,
  pwd: `/user/change-password`,
};
