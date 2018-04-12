import invariant from 'invariant';
import { getHash, getHashCallback } from 'utils/uploadOssFile';
import { FileSerializer } from 'services/serializers';
import { fetch, normalize, normalizeErrors } from 'services/api/api/helpers';
import { apiFetched } from './api';
import { FILE_UPLOAD_PROGRESS, FILE_CALLBACK_SUCCESS } from '../constants/file';

// export const uploadFile = data => dispatch =>
//   upload(data).then(payload => console.log(payload));

export const pinFile = () => (dispatch) => {};
export const unPinFile = () => (dispatch) => {};

export const uploadFile = ({
  file,
  projectId,
  option = { name: '' }
}) => (dispatch) => {
  const filename = file instanceof File ? file.name : option.name;
  let fileHash = '';
  // getHash(file).then((hash) => {
  //   fileHash = hash;
  // });
  getHashCallback(file, (hash) => {
    fileHash = hash;
    console.log(fileHash, 'filehash');
    /* 上传文件信息，并且计算文件的Hash值，避免重复 */
    const payload = FileSerializer.serialize({
      size: file.size,
      name: filename,
      hash: fileHash
    });
    fetch(`projects/${projectId}/files`, {
      method: 'POST',
      data: JSON.stringify(payload)
    })
      .then((res) => {
        const data = res.data;
        if (data.type && data.type === 'files') {
          dispatch(apiFetched(normalize(data)));
        }
        dispatch(uploadOss(data, file));
      })
      .catch(normalizeErrors);
  });
};

export const uploadOss = (data, file) => (dispatch) => {
  const {
    key,
    policy,
    accessId,
    success_action_status,
    Signature,
    callback
    // callback_var
  } = data;

  const formData = new FormData();

  formData.append('key', key);
  formData.append('policy', policy);
  formData.append('OSSAccessKeyId', accessId);
  formData.append('success_action_status', success_action_status);
  formData.append('Signature', Signature);
  formData.append('callback', callback);
  // formData.append("x:filehash", callback_var["x:filehash"]);
  // formData.append("file_part_name", file_part_name);
  if (file.blob) {
    formData.append('file', file.file);
  } else {
    formData.append('file', file);
  }

  const options = {
    method: 'POST',
    data: formData,
    onUploadProgress(progressEvent) {
      const percentage = progressEvent.loaded / progressEvent.total;
      dispatch(progress(percentage));
    }
  };

  fetch(data.action, options).then((res) => {
    const payload = res.data;
    dispatch(apiFetched(normalize(payload)));
    dispatch(callbackSuccess());
  });
};

export const progress = percentage => ({
  type: 'FILE_UPLOAD_PROGRESS',
  payload: {
    percentage
  }
});

export const callbackSuccess = () => ({
  type: 'FILE_CALLBACK_SUCCESS'
});
