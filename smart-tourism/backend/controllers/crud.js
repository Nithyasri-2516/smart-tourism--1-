// Generic CRUD controller factory used by several routes (keeps code short and consistent)
const sendError = (res, e) => {
  if (e.name === "ValidationError") return res.status(400).json({ message: "Please fill all required fields", details: e.message });
  if (e.name === "CastError") return res.status(404).json({ message: "Record not found" });
  return res.status(500).json({ message: e.message });
};

module.exports = function crud(Model, { populate = "", sort = { createdAt: -1 }, filterKeys = [], label = "Record" } = {}) {
  const withPop = (q) => (populate ? q.populate(populate) : q);
  return {
    getAll: async (req, res) => {
      try {
        const filter = {};
        filterKeys.forEach((k) => { if (req.query[k]) filter[k] = req.query[k]; });
        res.status(200).json(await withPop(Model.find(filter)).sort(sort));
      } catch (e) { sendError(res, e); }
    },
    getOne: async (req, res) => {
      try {
        const item = await withPop(Model.findById(req.params.id));
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(200).json(item);
      } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(await withPop(Model.findById(item._id)));
      } catch (e) { sendError(res, e); }
    },
    update: async (req, res) => {
      try {
        const item = await withPop(Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }));
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(200).json(item);
      } catch (e) { sendError(res, e); }
    },
    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(200).json({ message: `${label} deleted successfully` });
      } catch (e) { sendError(res, e); }
    },
    sendError,
  };
};
