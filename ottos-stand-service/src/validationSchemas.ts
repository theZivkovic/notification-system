import Joi from "joi";

const createBlueBookEntrySchema = Joi.object({
  title: Joi.string()
    .regex(/^\w+[\w\s]+$/)
    .min(1)
    .max(50)
    .required(),
  body: Joi.string().min(1).max(255).required(),
  from_name: Joi.string().alphanum().min(1).max(30).required(),
  to_name: Joi.string().alphanum().min(1).max(30).required(),
});

export {createBlueBookEntrySchema};
