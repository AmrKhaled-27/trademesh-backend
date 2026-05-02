export const responseInterceptor = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    // Attempting to avoid double-wrapping and avoid intercepting errors
    if (res.__intercepted || (body && typeof body === 'object' && body.success === false)) {
      return originalJson.call(this, body);
    }

    res.__intercepted = true;

    let response = {};
    let data = body;

    // Check for pagination and extract it to meta
    if (data && typeof data === 'object' && data.pagination) {
      const { pagination, ...restData } = data;
      response.meta = { pagination };
      data = restData;
    }

    response.data = data;

    return originalJson.call(this, response);
  };

  next();
};
