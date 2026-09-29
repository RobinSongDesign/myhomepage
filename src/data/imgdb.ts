/**
 * Project images are hosted on imgdb.cn to keep the server light.
 * Most uploads carry a literal ".None" extension; pass the real one otherwise.
 */
export const imgdb = (id: string, ext = 'None') => `https://pic1.imgdb.cn/item/${id}.${ext}`;
