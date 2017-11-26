/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'proxy', (
  _,
  q,
  $path,
  $fs,
  $crypto,
  $sharp,
  krkLogger,
  requestBuilder
) => {

  const cacheDir = $path.resolve(__dirname, '../..', 'cache');
  const cacheExpiration = 24 * 60 * 60 * 1000; // 1 day
  const cacheInvalidationScanningPeriod = 1 * 60 * 60 * 1000; // 1 hour
  const supportedTypes = {
    'image/gif': true,
    'image/jpeg': true,
    'image/png': true,
    'image/svg+xml': true
  };
  const maxFileSize = 512 * 1024;
  const debugLog = false;

  if (!$fs.existsSync(cacheDir)){
    $fs.mkdirSync(cacheDir);
  }

  return {
    image,
    startPeriodicalCacheInvalidation,
    getCacheInfo
  };

  function image(src, resize) {
    const path = toPath(src, resize);
    const fileInfo = getFileInfo(path);
    if (fileInfo && fileInfo.isFile()) {
      return Promise.resolve(createPathInfo(path, !!fileInfo.size));
    }
    return fetchImgAndCache(src, path, resize);
  }

  function startPeriodicalCacheInvalidation() {
    scanAndInvalidateCacheDirectory();
    setInterval(scanAndInvalidateCacheDirectory, cacheInvalidationScanningPeriod);
  }

  function scanAndInvalidateCacheDirectory() {
    debugLog && krkLogger.info('start scanAndInvalidateCacheDirectory');
    $fs.readdir(cacheDir, (error, dirFiles) => {
      debugLog && krkLogger.info(`files reached ${dirFiles.length}`);
      if (error) {
        return krkLogger.error('startPeriodicalCacheInvalidation', error);
      }

      if (_.isEmpty(dirFiles)) {
        return;
      }

      const chucks = _.chunk(dirFiles, 50);

      function removeFiles(files, nextIdx) {
        _.each(files, file => {
          const path = `${cacheDir}/${file}`;
          $fs.stat(path, (fileError, stats) => {
            if (fileError) {
              return krkLogger.error('startPeriodicalCacheInvalidation', fileError);
            }
            if (isCacheValid(stats.mtime)) {
              debugLog && krkLogger.info(`invalidate ${path}`);
              invalidateCache(path);
            }
          });
        });

        if (chucks[nextIdx]) {
          setTimeout(() => removeFiles(chucks[nextIdx], nextIdx + 1), 10000);
        }
      }

      debugLog && krkLogger.info(`files chunked ${chucks.length}`);
      removeFiles(chucks[0], 1);
    });
  }

  function toPath(src, resize) {
    const path = cacheDir + '/' + $crypto.createHash('md5').update(src).digest('hex');
    return toPathWithSizeExtension(path, resize);
  }

  function toPathWithSizeExtension(path, resize) {
    return resize ? `${path}-${resize.w}-${resize.h}` : path;;
  }

  function getFileInfo(path) {
    try {
      return $fs.statSync(path);
    }
    catch (err) {
      return false;
    }
  }

  function isCacheValid(created) {
    const now = _.now();
    const imgCreated = created.getTime();
    return imgCreated + cacheExpiration < now;
  }

  function invalidateCache(path) {
    $fs.unlink(path, error => error && krkLogger.error('cannot unlink image', error));
  }

  function fetchImgAndCache(img, outPath, resize) {
    let hasError = false;
    return new Promise((resolve, reject) => {
      const writeStream = $fs.createWriteStream(outPath);

      const request = requestBuilder.create(img);

      request.on('response', function (imgResponse) {

        const contentType = imgResponse.headers['content-type'];
        if (!supportedTypes[contentType]) {
          return onError('invalid file type');
        }

        const contentLength = +imgResponse.headers['content-length'];
        if (_.isNaN(contentLength) || contentLength > maxFileSize) {
          return onError(`invalid content length: ${imgResponse.headers['content-length']}`);
        }

        if (resize) {
          const {w, h} = resize;
          const resizeTransform = $sharp().resize(w, h).max();
          request.pipe(resizeTransform).pipe(writeStream);
          resizeTransform.on('error', onError);
        } else {
          request.pipe(writeStream);
        }

        writeStream.on('error', onError);

        writeStream.on('finish', () => {
          if (!hasError) {
            resolve(createPathInfo(outPath));
          }
        });
      });

      request.on('error', onError);

      function onError(error) {
        if (hasError) {
          return;
        }
        hasError = true;
        request.abort();
        writeStream.end();
        resolve(createPathInfo(outPath, false));
      }
    });
  }

  function createPathInfo(path, isValid = true) {
    return {path, isValid};
  }

  function getCacheInfo() {
    return q.promisify(cb => $fs.readdir(cacheDir, cb))
      .then(dirFiles => Promise.all(
        _.map(dirFiles, file =>
          q.promisify(cb => $fs.stat(`${cacheDir}/${file}`, cb))
            .then(f => ({
              created: f.mtime,
              size: f.size,
              name: file
            }))
        )
      ))
      .then(cachedInfo => ({files: cachedInfo}));
  }

});
