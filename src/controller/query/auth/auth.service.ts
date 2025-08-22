import axios from 'axios';
import apiRequest from '../../api/config/config';
import { auth } from '../../api/constant/apiLink';
import { CreadentialsAuthWithPwd, CredentialsAuth, ResponseLog } from '@/types';

export const _login = async (
  itemData: CreadentialsAuthWithPwd
): Promise<ResponseLog | undefined> => {
  try {
    const response = await apiRequest<CreadentialsAuthWithPwd, ResponseLog>({
      method: 'POST',
      endpoint: `${auth?.login}`,
      data: itemData,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Auth error');
      } else if (error.request) {
        throw new Error(error.message);
      }
    }

    throw new Error('error server');
  }
};
