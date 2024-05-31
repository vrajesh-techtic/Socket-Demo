const moment = require("moment");
const joi = require("joi");

const signUpValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter valid email!",
    }),
    password: joi
      .string()
      .required("Enter your password")
      .min(8)
      .max(32)
      .custom((value, helpers) => {
        if (!/[a-z]/.test(value)) {
          return helpers.error("lowercase");
        }
        if (!/[A-Z]/.test(value)) {
          return helpers.error("uppercase");
        }
        if (!/[0-9]/.test(value)) {
          return helpers.error("number");
        }
        if (!/[^a-zA-Z0-9]/.test(value)) {
          return helpers.error("special");
        }
        return value;
      }, "password validation")
      .messages({
        "string.min": "Password must have minimum 8 characters",
        "string.max": "Password must have maximum 32 characters",
        lowercase: "Password must have atleast one lowercase character",
        uppercase: "Password must have atleast one uppercase character",
        number: "Password must have atleast one digit",
        special: "Password must have atleast one special character",
      }),

    name: joi
      .string()
      .pattern(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)
      .required()
      .messages({
        "string.pattern.base": "Name must be alphabets only! ",
      }),
  });

  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(400).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const loginValidations = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter valid email!",
    }),
    // username: joi.string().alphanum().min(4).max(20).required().messages({
    //   "string.pattern.base": "Username must be alphanumeric only! ",
    //   "string.min": "Username should be of minimum 4 characters",
    //   "string.max": "Username should be of maximum 20 characters only",
    // }),
    password: joi
      .string()
      .required("Enter your password")
      .min(8)
      .max(32)
      .custom((value, helpers) => {
        if (!/[a-z]/.test(value)) {
          return helpers.error("lowercase");
        }
        if (!/[A-Z]/.test(value)) {
          return helpers.error("uppercase");
        }
        if (!/[0-9]/.test(value)) {
          return helpers.error("number");
        }
        if (!/[^a-zA-Z0-9]/.test(value)) {
          return helpers.error("special");
        }
        return value;
      }, "password validation")
      .messages({
        "string.min": "Password must have minimum 8 characters",
        "string.max": "Password must have maximum 32 characters",
        lowercase: "Password must have atleast one lowercase character",
        uppercase: "Password must have atleast one uppercase character",
        number: "Password must have atleast one digit",
        special: "Password must have atleast one special character",
      }),
  });
  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const updateValidations = (req, res, next) => {
  const schema = joi.object({
    // username: joi.string().alphanum().min(4).max(20).messages({
    //   "string.alphanum": "Username must be alphanumeric only! ",
    //   "string.empty": "Username must not be empty! ",
    //   "string.min": "Username should be of minimum 4 characters",
    //   "string.max": "Username should be of maximum 20 characters only",
    // }),

    name: joi
      .string()
      .pattern(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)
      .messages({
        "string.pattern.base": "Name must be alphabets only! ",
      }),
    // countryCode: joi.string(),
    // phoneNumber: joi.string().min(10).max(10).messages({
    //   "string.min": "Please enter 10 digit phone number",
    //   "string.max": "Please enter 10 digit phone number",
    // }),
    // gender: joi.string(),
    // dob: joi.date().iso().max(moment.utc().format("YYYY-MM-DD")).messages({
    //   "date.format": "Date of Birth must be in (YYYY-MM-DD) format",
    // }),
    // profilePic: joi.optional(),
  });

  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    // console.log("req.body", req.body);
    // console.log("req.headers.cookie", req.headers.cookie);
    next();
  }
};

const forgotPWDValidations = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter valid email!",
    }),
  });
  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const onlyPWDValidations = (req, res, next) => {
  const schema = joi.object({
    password: joi
      .string()
      .required("Enter your password")
      .min(8)
      .max(32)
      .custom((value, helpers) => {
        if (!/[a-z]/.test(value)) {
          return helpers.error("lowercase");
        }
        if (!/[A-Z]/.test(value)) {
          return helpers.error("uppercase");
        }
        if (!/[0-9]/.test(value)) {
          return helpers.error("number");
        }
        if (!/[^a-zA-Z0-9]/.test(value)) {
          return helpers.error("special");
        }
        return value;
      }, "password validation")
      .messages({
        "string.min": "Password must have minimum 8 characters",
        "string.max": "Password must have maximum 32 characters",
        "string.empty": "Password must not be empty",
        lowercase: "Password must have atleast one lowercase character",
        uppercase: "Password must have atleast one uppercase character",
        number: "Password must have atleast one digit",
        special: "Password must have atleast one special character",
      }),
  });

  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(400).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const resetPWDValidations = (req, res, next) => {
  const schema = joi.object({
    currPassword: joi
      .string()
      .required("Enter current password")
      .min(8)
      .max(32)
      .custom((value, helpers) => {
        if (!/[a-z]/.test(value)) {
          return helpers.error("lowercase");
        }
        if (!/[A-Z]/.test(value)) {
          return helpers.error("uppercase");
        }
        if (!/[0-9]/.test(value)) {
          return helpers.error("number");
        }
        if (!/[^a-zA-Z0-9]/.test(value)) {
          return helpers.error("special");
        }
        return value;
      }, "password validation")
      .messages({
        "string.min": "Current password must have minimum 8 characters",
        "string.max": "Current password must have maximum 32 characters",
        "string.empty": "Current password cannot be empty!",
        lowercase: "Current password must have atleast one lowercase character",
        uppercase: "Current password must have atleast one uppercase character",
        number: "Current password must have atleast one digit",
        special: "Current password must have atleast one special character",
      }),
    password: joi
      .string()
      .required("Enter new password")
      .min(8)
      .max(32)
      .custom((value, helpers) => {
        if (!/[a-z]/.test(value)) {
          return helpers.error("lowercase");
        }
        if (!/[A-Z]/.test(value)) {
          return helpers.error("uppercase");
        }
        if (!/[0-9]/.test(value)) {
          return helpers.error("number");
        }
        if (!/[^a-zA-Z0-9]/.test(value)) {
          return helpers.error("special");
        }
        return value;
      }, "password validation")
      .messages({
        "string.min": "New password must have minimum 8 characters",
        "string.max": "New password must have maximum 32 characters",
        lowercase: "New password must have atleast one lowercase character",
        uppercase: "New password must have atleast one uppercase character",
        number: "New password must have atleast one digit",
        special: "New password must have atleast one special character",
      }),

    confirmPassword: joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (value !== req.body.password) {
          return helpers.error("notSame");
        }
      }, "confirm password")
      .messages({ notSame: "Both passwords must be same!" }),
  });

  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const usernameValidations = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().alphanum().min(4).max(20).required().messages({
      "string.pattern.base": "Username must be alphanumeric only! ",
      "string.empty": "Username must not be empty! ",
      "string.alphanum": "Username must have only alphanumeric characters!",
      "string.min": "Username should be of minimum 4 characters",
      "string.max": "Username should be of maximum 20 characters only",
    }),
  });

  const errors = schema.validate(req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const chatValidations = (req, res, next) => {
  const schema = joi
    .object({
      convoId: joi.string().required().messages({
        "string.empty": "Conversation ID must not be empty! ",
      }),

      message: joi.string().optional().messages({
        "string.empty": "Message must not be empty! ",
      }),
      receiverId: joi.string().optional(),
    })
    .messages({
      "any.required":
        "Please send 'receiverId', 'convoId'  and 'message' fields only!",
    });

  const errors = schema.validate(req.body);

  req.body.senderId = req.headers.userId;
  // console.log("req.body", req.body);

  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const convoValidation = (req, res, next) => {
  const schema = joi
    .object({
      receiverId: joi.string().required().messages({
        "string.empty": "Receiver ID must not be empty! ",
      }),
    })
    .messages({
      "any.required": "Please send 'receiverId' only!",
    });

  const errors = schema.validate(req.body);
  req.body.senderId = req.headers.userId;

  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const getChatsValidation = async (req, res, next) => {
  const schema = joi
    .object({
      convoId: joi.string().required().messages({
        "string.empty": "Conversation ID must not be empty! ",
      }),
      receiverId: joi.string().optional(),
    })
    .messages({
      "any.required": "Please send conversation ID only!",
    });

  const errors = schema.validate(req.body);

  req.body.senderId = req.headers.userId;
  // console.log("req.body", req.body);
  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const deleteConvoValidations = (req, res, next) => {
  const schema = joi
    .object({
      convoId: joi.string().required().messages({
        "string.empty": "Conversation ID must not be empty! ",
      }),
    })
    .messages({
      "any.required": "Please send 'convoId' only!",
    });

  const errors = schema.validate(req.body);
  req.body.senderId = req.headers.userId;

  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const createGroupValdiation = (req, res, next) => {
  // console.log("req.body", req.body);
  const schema = joi
    .object({
      groupName: joi.string().required().messages({
        "string.empty": "Group Name must not be empty! ",
      }),

      users: joi.array().required(),
    })
    .messages({
      "any.required": "Please send 'groupName' and 'users' only!",
    });

  const errors = schema.validate(req.body);
  req.body.senderId = req.headers.userId;

  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

const editGroupValidations = (req, res, next) => {
  const schema = joi
    .object({
      groupName: joi.string().required().messages({
        "string.empty": "Group Name must not be empty! ",
      }),
      convoId: joi.string().required().messages({
        "string.empty": "Conversation ID must not be empty! ",
      }),
      users: joi.array().required(),
    })
    .messages({
      "any.required": "Please send 'groupName', 'convoId' and 'users' only!",
    });

  const errors = schema.validate(req.body);
  req.body.senderId = req.headers.userId;

  if (errors.error) {
    res.status(404).send({ status: false, error: errors.error.message });
  } else {
    next();
  }
};

module.exports = {
  signUpValidation,
  loginValidations,
  updateValidations,
  forgotPWDValidations,
  onlyPWDValidations,
  resetPWDValidations,
  usernameValidations,
  chatValidations,
  convoValidation,
  getChatsValidation,
  deleteConvoValidations,
  createGroupValdiation,
  editGroupValidations
};
