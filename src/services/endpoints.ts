export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.31.24:7386/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    UPDATE_PASSWORD: '/admin/auth/update-password',
  },
  USER: {
    GET: '/admin/user/userget',
    CREATE: '/admin/user/usercreate',
    UPDATE: '/admin/user/userupdate',
    UPDATE_STATUS: '/admin/user/userupdatestatus',
    DELETE: '/admin/user/userdelete',
  },
  BANNER: {
    GET: '/admin/banner/bannerget',
    CREATE: '/admin/banner/bannercreate',
    UPDATE: '/admin/banner/bannerupdate',
    UPDATE_STATUS: '/admin/banner/bannerupdatestatus',
    DELETE: '/admin/banner/bannerdelete',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
  },
  GALLERY: {
    GET: '/admin/gallery/galleryget',
    CREATE: '/admin/gallery/gallerycreate',
    UPDATE: '/admin/gallery/galleryupdate',
    UPDATE_STATUS: '/admin/gallery/galleryupdatestatus',
    DELETE: '/admin/gallery/gallerydelete',
  },
  INQUIRY: {
    GET: '/admin/inquiry/inquiryget',
  }
};
