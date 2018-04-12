import { fetch } from 'services/api/api/helpers';
import invariant from 'invariant';

// type options = {   name, }

export const uploadFile = async (file, option) => {
  const filename = file instanceof File ? file.name : option.name;
  const payload = {
    kind: file.type,
    size: file.size,
    filename
  };
  const response = await fetch('/documents/oss', {
    method: 'POST',
    data: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  invariant(response, 'Response should be avaliable');

  const data = response.data;
  // const asset = data.asset;
  const asset = {
    url: data.url
  };

  console.log(data, 'data');
  console.log(asset, 'asset');
  const formData = new FormData();

  const {
    key,
    policy,
    accessId,
    success_action_status,
    Signature,
  } = data;


  formData.append('key', key);
  formData.append('policy', policy);
  formData.append('OSSAccessKeyId', accessId);
  formData.append('success_action_status', success_action_status);
  formData.append('Signature', Signature);

  if (file.blob) {
    formData.append('file', file.file);
  } else {
    formData.append('file', file);
  }

  const options = {
    method: 'POST',
    data: formData
  };

  await fetch(data.action, options);
  return asset;
};

export const dataUrlToBlob = (dataURL) => {
  const blobBin = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }

  const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
  return file;
};
