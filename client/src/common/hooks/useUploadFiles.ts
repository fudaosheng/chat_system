import { FileItem } from '@douyinfe/semi-ui/upload';
import { batchDeleteUserImgs } from 'common/api/file';
import { differenceBy } from 'lodash';
import { useState } from 'react';

/**
 * 自定义上传文件hooks
 * @author fudaosheng
 */
interface UseUploadFilesResp {
  fileList: Array<FileItem>;
  handleUploadSuccess: (responseBody: object, file: File, _fileList: Array<FileItem>) => void;
  handleRemoveImg: (currentFile: File, _fileList: Array<FileItem>, currentFileItem: FileItem) => void;
}
export const useUploadFiles = (): UseUploadFilesResp => {
  const [fileList, setFileList] = useState<Array<FileItem>>([]);

  // 图片上传成功的回调
  const handleUploadSuccess = (responseBody: object, file: File, _fileList: Array<FileItem>) => {
    setFileList(_fileList);
  };
  // 移除图片的回调
  const handleRemoveImg = (currentFile: File, _fileList: Array<FileItem>, currentFileItem: FileItem) => {
    // 删除移除的图片
    const needDeleteFiles = differenceBy(fileList, _fileList, 'uid');
    if (needDeleteFiles?.length) {
      batchDeleteUserImgs(needDeleteFiles?.map(i => i.response?.data?.url?.split('/')?.pop()));
    }
    setFileList(_fileList);
  };
  return {
      fileList,
      handleRemoveImg,
      handleUploadSuccess
  }
};
