/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewarePermissions', (
  $_, 
  $passport, 
  $jwtSimple, 
  config, 
  logger, 
  modelsUser, 
  middlewarePermissionsRoles
) => {

  return {
    check,
    createJWT,
    decodeJWT
  };

  function check(permission) {
    if ($_.indexOf(middlewarePermissionsRoles, permission) === -1) {
      logger.error(`unsupported permission (${permission})`);
    }
    
    if (permission === 'FREE') {
      return (req, res, next) => next();
    }
    
    return (req, res, next) => {
      const options = {
        session: false, 
        failWithError: true
      };
      $passport.authenticate('jwt', options)(req, res, onPassportAuthenticationFinished);

      function onPassportAuthenticationFinished(error) {
        if (error) return unauthorized();

        const token = getToken(req.headers);
        const decodedToken = decodeJWT(token);
        
        if (!($_.isObject(decodedToken) && decodedToken.session && decodedToken.user)) {
          return unauthorized();
        }

        if (decodedToken.session.expiresAt < $_.now()) {
          return unauthorized();
        }

        const user = decodedToken.user;

        if (!(user 
          && ((permission === 'USER' && (user.role === 'USER' || user.role === 'ADMIN'))
          || permission === 'ADMIN' && (user.role === 'ADMIN')))) {
            return unauthorized();
        }
        
        res.locals.user = decodedToken.user;
        res.locals.session = decodedToken.session
        next();
      }

      function unauthorized() {
        res.locals.errors.add('UNAUTHORIZED_USER');
        return next(true);
      }      
    };
    
  }

  function getToken (headers) {
    if (headers && headers.authorization) {
      const parted = headers.authorization.split(' ');
      return parted.length === 2 && parted[0] === 'JWT' ? parted[1] : undefined;
    }
  };  

  function createJWT(user) {
    const tokenData = {
      user: user.getSafely(),
      session: {
        expiresAt: $_.now() + config.JWT_EXPIRATION_PERIOD
      }
    };

    const token = $jwtSimple.encode(tokenData, config.JWT_SECRET);   

    return `JWT ${token}`;                
  }
  
  function decodeJWT(token) {
    return $jwtSimple.decode(token, config.JWT_SECRET);
  }

});
