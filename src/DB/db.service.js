export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
  let query = model.findOne(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }
  if (options.sort) {
    query = query.sort(options.sort);
  }
  if (options.skip) {
    query = query.skip(options.skip);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.select) {
    query = query.select(options.select);
  }
  const doc = await query;
  return doc;
};

export const findById = async ({ model, id, options = {} } = {}) => {
  let query = model.findById(id);
  if (options.populate) {
    query = query.populate(options.populate);
  }
  if (options.sort) {
    query = query.sort(options.sort);
  }
  if (options.skip) {
    query = query.skip(options.skip);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.select) {
    query = query.select(options.select);
  }
  const doc = await query;
  return doc;
};

export const find = async ({ model, filter = {}, options = {} } = {}) => {
  let query = model.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }
  if (options.sort) {
    query = query.sort(options.sort);
  }
  if (options.skip) {
    query = query.skip(options.skip);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.select) {
    query = query.select(options.select);
  }

  const doc = await query;
  return doc;
};

export const findWithAggregation = async ({ model, pipeline = [] } = {}) => {
  if (!Array.isArray(pipeline)) {
    throw new Error("Aggregation pipeline must be an array");
  }

  const docs = await model.aggregate(pipeline);
  return docs;
};

export const create = async ({ model, data, options = {} } = {}) => {
  const doc = await model.create([data], options);
  return doc;
};

export const updateOne = async ({
  model,
  filter = {},
  data,
  options = {},
} = {}) => {
  const doc = await model.updateOne(filter, data, options);
  return doc;
};

export const updateMany = async ({
  model,
  filter = {},
  data,
  options = {},
} = {}) => {
  const doc = await model.updateMany(filter, data, options);
  return doc;
};

export const replaceNote = async ({
  model,
  filter = {},
  data,
  options = {},
} = {}) => {
  const doc = await model.replaceOne(filter, data, options);
  return doc;
};

export const deleteOne = async ({ model, filter = {} } = {}) => {
  const doc = await model.deleteOne(filter);
  return doc;
};

export const deleteMany = async ({ model, filter = {} } = {}) => {
  const doc = await model.deleteMany(filter);
  return doc;
};

export const findOneAndDelete = async ({ model, filter = {} } = {}) => {
  const doc = await model.findOneAndDelete(filter);
  return doc;
};

export const findOneAndUpdate  = async ({
  model,
  filter = {},
  data,
  options = {},
} = {}) => {
  const doc = await model.findOneAndUpdate(filter, data, options);
  return doc;
};