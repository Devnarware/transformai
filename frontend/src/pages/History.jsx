import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  FileText,
  Trash2,
  ExternalLink,
  Filter,
  Plus,
} from 'lucide-react';
import { api, fmt, toast, LABEL, OUTS } from '../api';

export default function History() {
  const [list, setList] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ascending, setAscending] = useState(false);

  const loadData = () => {
    api
      .get('/transformations')
      .then(setList)
      .catch((err) => toast(err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Permanently delete transformation "${item.sourceTitle}"?`)) {
      return;
    }
    try {
      await api.del('/transformations/' + item._id);
      toast('Transformation deleted');
      loadData();
    } catch (err) {
      toast(err.message);
    }
  };

  const filteredRows = (list || [])
    .filter(
      (item) =>
        item.sourceTitle.toLowerCase().includes(search.toLowerCase()) &&
        (!statusFilter || item.status === statusFilter) &&
        (!typeFilter || item.selectedOutputs.includes(typeFilter))
    )
    .sort(
      (a, b) =>
        (ascending ? 1 : -1) * (new Date(a.createdAt) - new Date(b.createdAt))
    );

  return (
    <div className="history-page">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">AUDIT & ARCHIVES</span>
          <h1 className="page-title">Transformation History</h1>
          <p className="page-subtitle">
            Search, filter, and inspect past multi-deliverable transformation runs.
          </p>
        </div>

        <Link to="/new" className="btn primary">
          <Plus size={16} strokeWidth={2.2} />
          <span>New Transformation</span>
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>

          <div style={{ width: 160 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div style={{ width: 180 }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Deliverables</option>
              {OUTS.map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn secondary"
            onClick={() => setAscending(!ascending)}
            title="Toggle sort direction"
          >
            <ArrowUpDown size={14} />
            <span>Date {ascending ? 'Oldest First' : 'Newest First'}</span>
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {!list ? (
          <div style={{ padding: 20 }}>
            <div className="skel" />
            <div className="skel" />
          </div>
        ) : !filteredRows.length ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Filter size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p style={{ margin: '0 0 12px', fontSize: 14 }}>No transformations found matching your filters.</p>
            {(search || statusFilter || typeFilter) && (
              <button
                type="button"
                className="btn sm secondary"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setTypeFilter('');
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Source Title</th>
                  <th>Source Type</th>
                  <th>Deliverables</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.sourceTitle}</strong>
                    </td>
                    <td>
                      <span className="output-tag" style={{ textTransform: 'capitalize' }}>
                        {item.sourceType}
                      </span>
                    </td>
                    <td>
                      {item.selectedOutputs.map((outKey) => (
                        <span key={outKey} className="output-tag">
                          {LABEL[outKey] || outKey}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {fmt(item.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link to={`/history/${item._id}`} className="btn sm">
                          <span>Open</span>
                          <ExternalLink size={12} />
                        </Link>
                        <button
                          type="button"
                          className="btn sm danger"
                          onClick={() => handleDelete(item)}
                          title="Delete transformation"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
