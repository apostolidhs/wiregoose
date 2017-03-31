const model = {
  name: 'rssProvider',
  schema: {
    name: {
      type: 'String',
      required: true,
      index: true,
      unique: true,
      maxlength: [64],
    },
    link: {
      type: 'Url',
      required: true,
    },
    _id: {
      type: 'String',
      required: true,
      index: true,
      unique: true,
    },
  },
};

export default model;
