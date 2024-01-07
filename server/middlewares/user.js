const { check, validationResult } = require('express-validator');




//middleware to authenticate the JWT token:
exports.authenticateJwtToken = (requestObject, responseObject, next) => {
    /*
      example:
      let options = {
          method: requestMethodEl.value,
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer 956024779072d5b1668e3e20dce2bbd34377cccc9db7ff52e0b4a8a479c5cc7b"
          },
          body: requestBodyValue
      };
    */
  
    /*  
    console.log(requestObject.headers);
    {
    'user-agent': 'vscode-restclient',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwiaWF0IjoxNjkxNzMzNTkxfQ.pr-0VY1GVd5EpndR7ua3Ta1H7nrDOzZi-Ok1OqFmCU4',
    'accept-encoding': 'gzip, deflate',
    host: 'localhost:3001',
    connection: 'close'
    }
    */
    const authorizationValue = requestObject.headers.authorization;
    let tokenValue;
    if (authorizationValue !== undefined) {
      const authorizationArray = authorizationValue.split(" ");
      /*
      console.log(authorizationArray);
      [
    'Bearer',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwiaWF0IjoxNjkxNzMzNTkxfQ.pr-0VY1GVd5EpndR7ua3Ta1H7nrDOzZi-Ok1OqFmCU4']
      */
      tokenValue = authorizationArray[1];
    }else{
        responseObject.status(401);
        responseObject.send("provide authorization value");        
    }
  
    if (tokenValue === undefined) {
      responseObject.status(401);
      responseObject.send("provide token value");
    } else {
      jwt.verify(tokenValue, process.env.SECRET_JWT_KEY, async (error, payload) => {
        if (error) {
          responseObject.status(401);
          responseObject.send("Invalid JWT Token");
        } else {
          console.log(payload);
  
          requestObject.username = payload.username;
          requestObject.user_id = payload.user_id;
          requestObject.name = payload.name;
          next();
        }
      });
    }
  };



exports.validateUserUpdate = [
    check('name').optional().isString(),
    check('profileImage').optional().isURL(),
    (requestObject, responseObject, next) => {
      const errors = validationResult(requestObject);
      if (!errors.isEmpty()) {
        return responseObject.status(400).send({ errors: errors.array() });
      }
      next();
    },
];
  