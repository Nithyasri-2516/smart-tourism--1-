import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import Modal from "./Modal";
import Loading from "./Loading";
import EmptyState from "./EmptyState";
import { idOf, toInputDate } from "../services/helpers";

const PAGE = 8;

// Reusable admin table with search, filter, sort, pagination and add/view/edit/delete modals.
export default function AdminCrud({ title, icon, endpoint, columns, fields, defaults = {}, searchText, filter, canAdd = true, extraActions, label = "Record" }) {
  const { toast } = useApp();
  const [rows, setRows] = useState([]);
  const [refs, setRefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fv, setFv] = useState("");
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // {type:'add'|'edit'|'view'|'delete', row}
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(endpoint);
      setRows(data);
      for (const f of fields.filter((x) => x.type === "ref")) {
        const r = await API.get(f.ref);
        setRefs((p) => ({ ...p, [f.name]: r.data }));
      }
    } catch (e) { toast(errMsg(e), "error"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [endpoint]);

  const view = useMemo(() => {
    let list = rows.filter((r) => (!q || (searchText ? searchText(r) : JSON.stringify(r)).toLowerCase().includes(q.toLowerCase())) && (!fv || String(filter.get(r)) === fv));
    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key);
      const val = (r) => (col.sortValue ? col.sortValue(r) : r[col.key]);
      list = [...list].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.dir);
    }
    return list;
  }, [rows, q, fv, sort, columns, filter, searchText]);
  const pages = Math.max(1, Math.ceil(view.length / PAGE));
  const shown = view.slice((page - 1) * PAGE, page * PAGE);
  useEffect(() => { setPage(1); }, [q, fv]);

  const openForm = (type, row) => {
    const f = {};
    fields.forEach((fd) => {
      let v = row ? row[fd.name] : defaults[fd.name];
      if (fd.type === "ref") v = idOf(v) || "";
      if (fd.type === "date") v = toInputDate(v);
      if (fd.type === "tags") v = Array.isArray(v) ? v.join(", ") : v || "";
      f[fd.name] = v ?? "";
    });
    setForm(f);
    setModal({ type, row });
  };

  const save = async () => {
    const missing = fields.filter((f) => f.required && !String(form[f.name]).trim());
    if (missing.length) return toast("Please fill all required fields", "error");
    const body = {};
    fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "number") v = Number(v);
      if (f.type === "tags") v = String(v).split(",").map((s) => s.trim()).filter(Boolean);
      body[f.name] = v;
    });
    try {
      setSaving(true);
      if (modal.type === "add") { await API.post(endpoint, body); toast(`${label} added successfully`); }
      else { await API.put(`${endpoint}/${modal.row._id}`, body); toast(`${label} updated successfully`); }
      setModal(null);
      load();
    } catch (e) { toast(errMsg(e), "error"); } finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`${endpoint}/${modal.row._id}`); toast(`${label} deleted successfully`); setModal(null); load(); }
    catch (e) { toast(errMsg(e), "error"); }
  };

  const display = (f, row) => {
    const v = row[f.name];
    if (f.type === "ref") return v?.name || "-";
    if (f.name === "image" && v) return <img src={v} alt="" className="thumb" />;
    if (Array.isArray(v)) return v.join(", ") || "-";
    if (f.type === "date") return toInputDate(v);
    return String(v ?? "-");
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="m-0 d-flex align-items-center gap-2">{icon} {title}</h3>
        {canAdd && <button className="btn-travel" onClick={() => openForm("add")}><FaPlus /> Add {label}</button>}
      </div>

      <div className="table-card mb-3">
        <div className="row g-2">
          <div className="col-md-7"><div className="search-bar" style={{ boxShadow: "none", border: "2px solid #e2e8f0" }}><FaSearch className="text-muted" /><input placeholder={`Search ${title.toLowerCase()}...`} value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
          {filter && (
            <div className="col-md-5">
              <select className="form-select" value={fv} onChange={(e) => setFv(e.target.value)} style={{ borderRadius: 50 }}>
                <option value="">{filter.label}: All</option>
                {filter.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? <Loading text={`Loading ${title.toLowerCase()}...`} /> : shown.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} found`} text="Try changing your search or filters." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} onClick={() => c.sortable !== false && setSort({ key: c.key, dir: sort.key === c.key ? -sort.dir : 1 })}>
                      {c.label} {sort.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : ""}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r._id}>
                    {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : String(r[c.key] ?? "-")}</td>)}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div className="d-flex gap-1">
                        {extraActions && extraActions(r, load)}
                        <button className="icon-btn" title="View" onClick={() => setModal({ type: "view", row: r })}><FaEye /></button>
                        <button className="icon-btn" title="Edit" onClick={() => openForm("edit", r)}><FaEdit /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setModal({ type: "delete", row: r })}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center pt-3 flex-wrap gap-2">
            <small className="text-muted">{view.length} total</small>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn-outline-travel" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span className="small">Page {page} / {pages}</span>
              <button className="btn-outline-travel" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal title={`${modal.type === "add" ? "Add" : "Edit"} ${label}`} onClose={() => setModal(null)}>
          <div className="row g-3">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "col-12" : "col-md-6"}>
                <label className="form-label">{f.label}{f.required && " *"}</label>
                {f.type === "textarea" ? (
                  <textarea className="form-control" rows="3" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                ) : f.type === "select" ? (
                  <select className="form-select" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "ref" ? (
                  <select className="form-select" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                    <option value="">Select...</option>
                    {(refs[f.name] || []).map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
                  </select>
                ) : (
                  <input className="form-control" type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "password" ? "text" : "text"} step={f.type === "number" ? "any" : undefined}
                    placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn-outline-travel" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-travel" disabled={saving} onClick={save}>{saving ? "Saving..." : "💾 Save"}</button>
          </div>
        </Modal>
      )}

      {modal?.type === "view" && (
        <Modal title={`${label} details`} onClose={() => setModal(null)}>
          {modal.row.image && <img src={modal.row.image} alt="" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 18 }} className="mb-3" />}
          <div className="row g-2">
            {fields.filter((f) => f.name !== "image" && f.type !== "password").map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "col-12" : "col-6"}>
                <small className="text-muted d-block">{f.label}</small><b>{display(f, modal.row)}</b>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete confirmation" onClose={() => setModal(null)}>
          <p>Are you sure you want to delete this {label.toLowerCase()}? This cannot be undone.</p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn-outline-travel" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-warm" onClick={remove}>🗑 Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
