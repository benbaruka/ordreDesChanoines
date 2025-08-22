// import axios from 'axios';
// import { upload } from '../../api/constant/apiLink';
// import { baseURL } from '../../api/config/baseUrl';

// const AllowedSubfolders: { [key: string]: boolean } = {
//   images: true,
//   documents: true,
//   videos: true,
//   profiles: true,
//   cards: true,
// };

// export const uploadFile = async (file: File, subfolder: string) => {
//   if (!AllowedSubfolders[subfolder]) {
//     throw new Error('Invalid subfolder');
//   }

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('subfolder', subfolder);

//   try {
//     const response = await axios.post(
//       `${baseURL}/${upload?.upload}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );

//     if (response.data.message === 'File uploaded successfully') {
//       return response.data;
//     } else {
//       throw new Error(response.data.message || 'Failed to upload file');
//     }
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// };
