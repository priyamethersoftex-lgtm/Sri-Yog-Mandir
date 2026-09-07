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
  },
  AMENITY: {
    GET: '/admin/amenity/amenitylist',
    CREATE: '/admin/amenity/amenitycreate',
    UPDATE: '/admin/amenity/amenityupdate',
    DELETE: '/admin/amenity/amenitydelete',
  },
  ROOM_TYPE: {
    GET: '/admin/room/roomtypelist',
    CREATE: '/admin/room/roomtypecreate',
    UPDATE: '/admin/room/roomtypeupdate',
    DELETE: '/admin/room/roomtypedelete',
  },
  ROOM_VIEW: {
    GET: '/admin/room/roomviewlist',
    CREATE: '/admin/room/roomviewcreate',
    UPDATE: '/admin/room/roomviewupdate',
    DELETE: '/admin/room/roomviewdelete',
  },
  BED_TYPE: {
    GET: '/admin/room/bedtypelist',
    CREATE: '/admin/room/bedtypecreate',
    UPDATE: '/admin/room/bedtypeupdate',
    DELETE: '/admin/room/bedtypedelete',
  },
  ROOM: {
    GET: '/admin/room/roomget',
    CREATE: '/admin/room/roomcreate',
    UPDATE: '/admin/room/roomupdate',
    AMENITY_ASSIGN: '/admin/room/roomamenityassign',
    AMENITY_REMOVE: '/admin/room/roomamenityremove',
  },
  ROOM_IMAGE: {
    GET: '/admin/room/roomimageget',
    ADD: '/admin/room/roomimageadd',
    UPDATE: '/admin/room/roomimageupdate',
    SET_PRIMARY: '/admin/room/roomimagesetprimary',
    DELETE: '/admin/room/roomimagedelete',
  },
  RESERVATION: {
    GET: '/admin/reservation/reservationget',
    CREATE: '/admin/reservation/reservationcreate',
    UPDATE: '/admin/reservation/reservationupdate',
    UPDATE_STATUS: '/admin/reservation/reservationupdatestatus',
  }
};
