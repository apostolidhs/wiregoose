/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesAuthorize', (
  $_,
  $q,
  $crypto, 
  config,
  notificationsEmail,
  parameterValidator,
  middlewarePermissions,
  middlewareResponse,
  modelsUser
) => {

  return {
    register
  };

  function register(app) {
    app.post(`/${config.API_URL_PREFIX}/authorize/signup`, [
      middlewarePermissions.check('FREE'),
      middlewareUserAndPassParameterValidator,
      middlewareSignUpController,
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.post(`/${config.API_URL_PREFIX}/authorize/login`, [
      middlewarePermissions.check('FREE'),
      middlewareUserAndPassParameterValidator,
      middlewareLoginController,
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    const verifyAccountRoute = `/${config.API_URL_PREFIX}/authorize/verifyAccount`; 
    app.get(verifyAccountRoute, [
      middlewarePermissions.check('FREE'),
      middlewareVerifyAccountParameterValidator,
      middlewareVerifyAccountController,
      middlewareResponse.success,
      middlewareResponse.fail
    ]);    

    function middlewareVerifyAccountParameterValidator(req, res, next) {
      const validationOpts = [
        {path: 'validationToken', value: req.query.token, isValid: v => res.locals.params.token = v}
      ];
      parameterValidator.modelPartialValidator(modelsUser, validationOpts)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('INVALID_PARAMS', reason);
          next(true);
        });
    }

    function middlewareUserAndPassParameterValidator(req, res, next) {

      const validationOpts = [
        {path: 'email', value: req.body.email, isValid: v => res.locals.params.email = v},
        {path: 'password', value: req.body.password, isValid: v => res.locals.params.password = v},
      ];
      parameterValidator.modelPartialValidator(modelsUser, validationOpts)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('INVALID_PARAMS', reason);
          next(true);
        });
    }

    function middlewareSignUpController(req, res, next) {
      $q.promisify(cb => $crypto.randomBytes(32, cb))
          .catch(reason => {          
            res.locals.errors.add('NOT_ENOUGH_ENTROPY', reason);
            next(true);          
          })        
        .then(validationToken => new modelsUser({
          validationToken: validationToken.toString('hex'),
          email: res.locals.params.email,
          password: res.locals.params.password,
          role: 'USER',
          preferences: {}          
        }))
        .then(user => user.save()
          .catch(reason => {
            res.locals.errors.add('DB_ERROR', reason.errors || reason);
            next(true);
          }))     
        .then(newUser => {          
          const emailTemplate = getEmailTemplate(newUser);
          return notificationsEmail.send(emailTemplate)
            .catch(reason => {
              res.locals.errors.add('EMAIL_FAIL', reason.errors || reason);
              next(true);
            })
            .then(() => newUser);
        })
        .then(newUser => res.locals.data = newUser.getSafely())
        .then(() => next());

      function getEmailTemplate(user) {
        const subject = 'Verify your account';

        const verifyUrl = `${config.APP_URL}${verifyAccountRoute}?token=${user.validationToken}`;
        const content = `
          <h1>${config.NAME}</h1>
          <h3>Hi ${user.email}</h3>
          <p>Thank you for creating account on ${config.NAME}</p>
          <p>Please, <a href="${verifyUrl}">Verify you account</a></p>
        `;

        return {
          to: user.email,
          subject,
          content
        };
      }
    }

    function middlewareLoginController(req, res, next) {
      modelsUser.findOne({email: res.locals.params.email})
          .catch(reason => error('DB_ERROR', reason))
        .then(user => {
          if (!user) {
            return error('UNAUTHORIZED_USER');
          }

          if (user.validationToken) {
            return error('NOT_VERIFIED_USER');
          }
          
          return user.comparePassword(req.body.password)
            .then(isEqual => {
              if (!isEqual) {  
                return error('UNAUTHORIZED_USER');                              
              }              
              
              res.locals.data = middlewarePermissions.createJWT(user);
              next();
            })    
        })


        function error(type, reason) {
          res.locals.errors.add(type, reason);
          next(true);
        }              
    }

    function middlewareVerifyAccountController(req, res, next) {
      modelsUser.verifyAccount(res.locals.params.token)
          .catch(reason => error('DB_ERROR', reason))
        .then(updated => {
          if (!updated) {
            res.locals.errors.add('UNAUTHORIZED_USER');
            return next(true);
          }
          
          res.locals.redirect = `${config.APP_URL}/?validated=${updated._id}?email=${updated.email}`; 
          next();          
        });
    }
  }

});