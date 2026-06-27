import { useState, useRef } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Loader, AlertCircle } from 'lucide-react';
import { exportToExcel, importFromExcel, downloadTemplate } from '../../../utils/excelIO';
import { generateUUID } from '../../../utils/idGenerator';

export default function DataPanel({ commissions, subscriptions, labs, onImport }) {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('merge');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [templating, setTemplating] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToExcel({ commissions, subscriptions, labs });
    } catch (e) {
      setResult({ type: 'error', message: `Export failed: ${e.message}` });
    } finally {
      setExporting(false);
    }
  };

  const handleTemplate = async () => {
    setTemplating(true);
    try {
      await downloadTemplate();
    } catch (e) {
      setResult({ type: 'error', message: `Template download failed: ${e.message}` });
    } finally {
      setTemplating(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const data = await importFromExcel(file, { generateUUID });
      onImport(data, mode);
      setResult({
        type: 'success',
        commissions: data.commissions.length,
        subscriptions: data.subscriptions.length,
        labs: data.labs.length,
        errors: data.errors,
      });
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setResult({ type: 'error', message: e.message });
    } finally {
      setImporting(false);
    }
  };

  const sectionStyle = {
    background: '#0F172A',
    border: '1px solid #1E293B',
    borderRadius: 10,
    padding: '20px 24px',
  };

  const btnBase = 'flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-opacity disabled:opacity-50';

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-1" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
        Data Management
      </h2>
      <p className="text-sm mb-6" style={{ color: '#8A9BB0' }}>
        Export your data to Excel, import from a spreadsheet, or download a blank template.
      </p>

      {/* Export */}
      <div style={sectionStyle} className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#FAF3E0' }}>Export to Excel</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8A9BB0' }}>
              Downloads a <code className="text-xs px-1 rounded" style={{ background: '#1E293B', color: '#D4A843' }}>.xlsx</code> workbook
              with four sheets: Commissions ({commissions.length}), Songs ({commissions.reduce((n, c) => n + (c.songs?.length || 0), 0)}),
              Subscriptions ({subscriptions.length}), and Labs ({labs.length}).
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={btnBase}
            style={{ background: '#D4A843', color: '#0A0E1A', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {exporting ? <Loader size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? 'Exporting…' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Import */}
      <div style={sectionStyle} className="mb-4">
        <p className="text-sm font-semibold mb-1" style={{ color: '#FAF3E0' }}>Import from Excel</p>
        <p className="text-xs mb-4" style={{ color: '#8A9BB0' }}>
          Select a previously exported Preludio workbook (.xlsx). The file must contain sheets named
          Commissions, Songs, Subscriptions, and/or Labs.
        </p>

        {/* File picker */}
        <label
          className="flex flex-col items-center justify-center gap-2 rounded cursor-pointer mb-4"
          style={{
            border: `2px dashed ${file ? '#0D9488' : '#1E293B'}`,
            background: file ? '#0D948811' : '#0A0E1A',
            padding: '24px 16px',
            transition: 'border-color 0.15s',
          }}
        >
          <FileSpreadsheet size={24} style={{ color: file ? '#0D9488' : '#4A5568' }} />
          <span className="text-sm" style={{ color: file ? '#0D9488' : '#8A9BB0' }}>
            {file ? file.name : 'Click to choose .xlsx file'}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Mode */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8A9BB0' }}>Import Mode</p>
          <div className="space-y-2">
            {[
              { value: 'merge', label: 'Merge', desc: 'Add new items from the file; update existing records by ID. Does not delete anything.' },
              { value: 'replace', label: 'Replace All', desc: 'Completely replaces all Commissions, Subscriptions, and Labs with the file contents.' },
            ].map(({ value, label, desc }) => (
              <label key={value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="mt-0.5 accent-teal-500"
                />
                <div>
                  <span className="text-sm font-medium" style={{ color: '#FAF3E0' }}>
                    {label}
                    {value === 'replace' && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: '#C0392B22', color: '#C0392B' }}>
                        Destructive
                      </span>
                    )}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: '#8A9BB0' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Confirm warning for replace mode */}
        {mode === 'replace' && (
          <div className="flex items-start gap-2 p-3 rounded mb-4" style={{ background: '#C0392B11', border: '1px solid #C0392B33' }}>
            <AlertTriangle size={14} style={{ color: '#C0392B', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: '#C0392B' }}>
              Replace All will permanently overwrite all existing data. Make sure to export a backup first.
            </p>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className={`${btnBase} w-full justify-center`}
          style={{ background: file ? '#0D9488' : '#1E293B', color: file ? '#FAF3E0' : '#4A5568' }}
        >
          {importing ? <Loader size={15} className="animate-spin" /> : <Upload size={15} />}
          {importing ? 'Importing…' : 'Import Data'}
        </button>

        {/* Result feedback */}
        {result && result.type === 'success' && (
          <div className="mt-4 p-3 rounded" style={{ background: '#0D948811', border: '1px solid #0D948833' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} style={{ color: '#0D9488' }} />
              <span className="text-sm font-medium" style={{ color: '#0D9488' }}>Import complete</span>
            </div>
            <div className="text-xs space-y-0.5" style={{ color: '#8A9BB0' }}>
              <p>· {result.commissions} commission{result.commissions !== 1 ? 's' : ''} processed</p>
              <p>· {result.subscriptions} subscription{result.subscriptions !== 1 ? 's' : ''} processed</p>
              <p>· {result.labs} lab experiment{result.labs !== 1 ? 's' : ''} processed</p>
            </div>
            {result.errors?.length > 0 && (
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid #1E293B' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#E67E22' }}>
                  {result.errors.length} row{result.errors.length !== 1 ? 's' : ''} skipped with errors:
                </p>
                <div className="space-y-0.5">
                  {result.errors.slice(0, 5).map((e, i) => (
                    <p key={i} className="text-xs" style={{ color: '#8A9BB0' }}>· {e}</p>
                  ))}
                  {result.errors.length > 5 && (
                    <p className="text-xs" style={{ color: '#8A9BB0' }}>· …and {result.errors.length - 5} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {result && result.type === 'error' && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded" style={{ background: '#C0392B11', border: '1px solid #C0392B33' }}>
            <AlertCircle size={14} style={{ color: '#C0392B', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: '#C0392B' }}>{result.message}</p>
          </div>
        )}
      </div>

      {/* Template */}
      <div style={sectionStyle}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#FAF3E0' }}>Blank Template</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8A9BB0' }}>
              Download an empty workbook with all column headers pre-filled. Use it to prepare data for import
              without needing an existing export.
            </p>
          </div>
          <button
            onClick={handleTemplate}
            disabled={templating}
            className={btnBase}
            style={{ background: '#1E293B', color: '#8A9BB0', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {templating ? <Loader size={15} className="animate-spin" /> : <Download size={15} />}
            {templating ? 'Generating…' : 'Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
