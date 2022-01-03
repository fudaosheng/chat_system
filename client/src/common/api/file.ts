import request from '.';

// 上传图片
export const uploadImg = (img: File) => {
  const formData = new FormData();
  formData.append('img', img);

  return request({
    url: '/file/upload/img',
    method: 'POST',
    data: formData,
  });
};


export const getImgByFilename = (filename: string) => {
  return request({
    url: '/file/get/img/' + filename,
  });
}