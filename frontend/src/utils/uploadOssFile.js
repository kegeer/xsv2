// "success_action_redirect": "http://www.linkick.com",
//   "success_action_status": 201,
//   "file_part_name": "papers/cc3db51f-ecff-458e-8e63-f84f1798bdd7/28cf33be5008a9acba76ebe8dd598c9d-",
//   "signature": "HYnZv3Pz7ornPtd+zvfGAqE5Ymo=",
//   "accessId": "LTAIT2QhXKpEqteX",
//   "key": "papers/cc3db51f-ecff-458e-8e63-f84f1798bdd7/28cf33be5008a9acba76ebe8dd598c9d-${filename}",
//   "policy": "{\"expiration\": \"2018-04-05T03:15:01Z\", \"conditions\": [[\"starts-with\", \"$key\", \"papers/\"]]}",
//   "expire": 1522869301,
//   "action": "http://xueshu-papers.oss-cn-beijing.aliyuncs.com"

/* eslint-disable */

import { fetch } from "services/api/api/helpers";
import invariant from "invariant";
import SparkMD5 from "spark-md5";
import { FileSerializer } from "services/serializers";

export const getHash = file => new Promise((resolve, reject) => {
    let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice,
      chunkSize = 2097152, // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    fileReader.onload = function(e) {
      spark.append(e.target.result); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end()); // Compute hash
      }
    };

    fileReader.onerror = function() {
      reject(console.warn("oops, something went wrong."));
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });

export const getHashCallback = (file, cb) => {
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice,
    chunkSize = 2097152, // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = (e) => {
    spark.append(e.target.result); // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      cb(spark.end()); // Compute hash
    }
  };

  fileReader.onerror = function() {
    console.warn("oops, something went wrong.")
  };

  const loadNext = () => {
    let start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
};

export const uploadFile = async ({
  file,
  projectId,
  option = { name: "" }
}) => {
  const filename = file instanceof File ? file.name : option.name;
  let hash = "";
  await getHash(file).then(hash => {
    hash;
  });
  console.log(filename, hash, 'hash')
  /* 上传文件信息，并且计算文件的Hash值，避免重复 */
  const payload = FileSerializer.serialize({
    size: file.size,
    name: filename,
    hash
  });
  console.log(payload, "payload");

  const response = await fetch(`projects/${projectId}/files`, {
    method: "POST",
    data: JSON.stringify(payload)
  });

  invariant(response, "Response should be avaliable");
  console.log(response.data);
  const data = response.data;
  if (data.type && data.type === "files") {
    return data;
  }
  const {
    key,
    policy,
    accessId,
    success_action_status,
    Signature,
    callback
    // callback_var
  } = data;

  let formData = new FormData();

  formData.append("key", key);
  formData.append("policy", policy);
  formData.append("OSSAccessKeyId", accessId);
  formData.append("success_action_status", success_action_status);
  formData.append("Signature", Signature);
  formData.append("callback", callback);
  // formData.append("x:filehash", callback_var["x:filehash"]);
  // formData.append("file_part_name", file_part_name);
  if (file.blob) {
    formData.append("file", file.file);
  } else {
    formData.append("file", file);
  }

  const options = {
    method: "POST",
    data: formData,
    onUploadProgress(progressEvent) {
      const percentage = progressEvent.loaded / progressEvent.total;
      console.log(percentage);
    }
  };

  await fetch(data.action, options);
};
