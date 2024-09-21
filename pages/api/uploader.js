import B2 from 'backblaze-b2';

const uploadHandler = async (req, res) => {
  // reconstruct file buffer from stream
  const file = await new Promise((resolve) => {
    const chunks = [];

    req.on('readable', () => {
      let chunk;

      while (null !== (chunk = req.read())) {
        chunks.push(chunk);
      }
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });

  const b2 = new B2({
    applicationKeyId: "004c793eb828ace0000000004",
    applicationKey: "K004H1NvDQ+d9fD9sy9iBsYzd8f4/r8",
  });

  // b2 auth tokens are valid for 24 hours
  // .authorize returns the download url,
  // .getUploadUrl returns the upload url and auth token
  const { data: authData } = await b2.authorize();
  const { data: uploadData } = await b2.getUploadUrl({
    bucketId:  "1ce799930e2b4842884a0c1e",
  });

  // TODO figure out how to parse file name from form data
  const reqFileName = req.headers['x-filename'];

  const { data } = await b2.uploadFile({
    uploadUrl: uploadData.uploadUrl,
    uploadAuthToken: uploadData.authorizationToken,
    data: file,
    fileName: reqFileName, // Use reqFileName instead of fileName
  });
  
  
  // construct friendly url to return in the response
  const bucketName ="ok767777";
  const downloadURL = authData.downloadUrl;

  res.status(200).json({
    // add timestamp to url to force re-fetching images with the same src
    url: `${downloadURL}/file/${bucketName}/${data.fileName}?timestamp=${data.uploadTimestamp}`,
  });
};

// tell next.js to disable body parsing and handle as a stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadHandler;