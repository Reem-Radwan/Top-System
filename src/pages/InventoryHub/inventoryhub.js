import React, { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "./inventoryhub.css";
import {
  IS_UPLOADER,
  LOCKED_COMPANY_ID,
  LOCKED_COMPANY_NAME,
  companies,
  companyConfigs,
  mockApiResponses,
} from "../../data/inventoryhubdata";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function LogLine({ entry }) {
  return (
    <div className="ih-log-line">
      <span className="ih-log-time">[{entry.time}]</span>
      <span className={`ih-log-${entry.type}`}>{entry.msg}</span>
    </div>
  );
}

function StatusPill({ url, prefix }) {
  const ok = Boolean(url);
  return (
    <div className={`ih-status-pill ${ok ? "configured" : "not-configured"}`}>
      {ok ? `${prefix} ${url.substring(0, 38)}…` : "Not Configured"}
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove }) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const code = inputVal.trim();
      if (code && !tags.has(code)) onAdd(code);
      setInputVal("");
    }
  };

  return (
    <div className="ih-tag-container" onClick={() => inputRef.current?.focus()}>
      {Array.from(tags).map((code) => (
        <div className="ih-tag" key={code}>
          {code}
          <span className="ih-tag-close" onClick={() => onRemove(code)}>×</span>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="ih-tag-input"
        placeholder="Type unit code & press Enter…"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function InventoryHub() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    IS_UPLOADER && LOCKED_COMPANY_ID ? LOCKED_COMPANY_ID : ""
  );

  const config = companyConfigs[selectedCompanyId] || null;
  const isReady = Boolean(config);

  const [logs, setLogs] = useState([
    { time: getTime(), msg: "> System Ready. Waiting for user input…", type: "info" },
  ]);
  const consoleRef  = useRef(null);
  const csvInputRef    = useRef(null);
  const renameInputRef = useRef(null);

  const [loading, setLoading] = useState({
    csv: false, sheet: false, erp: false, rename: false, delete: false,
  });
  const [unitsToDelete, setUnitsToDelete] = useState(new Set());

  useEffect(() => {
    if (consoleRef.current)
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [logs]);

  const log = useCallback((msg, type = "info") => {
    setLogs((prev) => [...prev, { time: getTime(), msg, type }]);
  }, []);

  const handleCompanyChange = (id) => {
    setSelectedCompanyId(id);
    setUnitsToDelete(new Set());
    if (csvInputRef.current)    csvInputRef.current.value = "";
    if (renameInputRef.current) renameInputRef.current.value = "";
    log(`Switched context to: Company ID ${id}`, "info");
  };

  // ─── Import ──────────────────────────────────────────────
  const triggerImport = async (sourceType) => {
    if (!selectedCompanyId) {
      Swal.fire({ title: "Error", text: "Select a company first", icon: "error" }); return;
    }
    if (sourceType === "csv" && (!csvInputRef.current || !csvInputRef.current.files.length)) {
      log("Error: No file selected", "error"); return;
    }
    setLoading((p) => ({ ...p, [sourceType]: true }));
    log("────────────────────────────────────────");
    log(`Initiating ${sourceType.toUpperCase()} import…`);
    try {
      const data = await mockApiResponses.triggerImport(sourceType);
      if (data.success) {
        const s = data.stats;
        log(`Success! Processed ${s.total_received} rows.`, "success");
        log(`+ Created: ${s.created}`, "success");
        log(`~ Updated: ${s.updated}`, "success");
        log(`- Skipped: ${s.skipped}`);
        if (s.errors?.length) {
          log(`Warning: ${s.errors.length} errors.`, "error");
          s.errors.slice(0, 5).forEach((e) => log(`Err: ${e}`, "error"));
        }
      } else {
        log(`Failed: ${data.error}`, "error");
        Swal.fire({ title: "Import Failed", text: data.error, icon: "error" });
      }
    } catch (err) {
      log(`System Error: ${err.message}`, "error");
    } finally {
      setLoading((p) => ({ ...p, [sourceType]: false }));
    }
  };

  // ─── Rename ───────────────────────────────────────────────
  const triggerRename = async () => {
    if (!selectedCompanyId) {
      Swal.fire({ title: "Error", text: "Select a company first", icon: "error" }); return;
    }
    if (!renameInputRef.current || !renameInputRef.current.files.length) {
      Swal.fire({ title: "Input Missing", text: "Please select a CSV file first.", icon: "warning" }); return;
    }
    setLoading((p) => ({ ...p, rename: true }));
    log("────────────────────────────────────────");
    log("Starting Bulk Rename Operation…");
    try {
      const data = await mockApiResponses.triggerRename();
      if (data.success) {
        const s = data.stats;
        log("Operation Successful.", "success");
        log(`✓ Renamed: ${s.renamed}`, "success");
        log(`! Not Found: ${s.skipped_not_found}`);
        log(`! Duplicates: ${s.skipped_duplicate}`);
        if (s.errors?.length) { log("Errors:", "error"); s.errors.slice(0,5).forEach((e) => log(e, "error")); }
        if (renameInputRef.current) renameInputRef.current.value = "";
        Swal.fire({ title: "Success", text: `Renamed ${s.renamed} units.`, icon: "success" });
      } else {
        log(`Failed: ${data.error}`, "error");
        Swal.fire({ title: "Error", text: data.error, icon: "error" });
      }
    } catch (err) {
      log(`System Error: ${err.message}`, "error");
      Swal.fire({ title: "System Error", text: err.message, icon: "error" });
    } finally {
      setLoading((p) => ({ ...p, rename: false }));
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const executeDelete = async () => {
    if (!selectedCompanyId) {
      Swal.fire({ title: "Error", text: "Please select a company first.", icon: "error" }); return;
    }
    const unitsArray = Array.from(unitsToDelete);
    if (!unitsArray.length) {
      Swal.fire({ title: "No Selection", text: "Type unit codes in the red box to delete.", icon: "warning" }); return;
    }
    const result = await Swal.fire({
      title: "Delete Confirmation",
      html: `Deleting <b>${unitsArray.length}</b> unit${unitsArray.length > 1 ? "s" : ""}.<br/>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, permanently delete",
    });
    if (!result.isConfirmed) return;

    setLoading((p) => ({ ...p, delete: true }));
    log("────────────────────────────────────────");
    log(`Attempting delete of ${unitsArray.length} units…`);
    try {
      const data = await mockApiResponses.executeDelete(unitsArray);
      if (data.success) {
        Swal.fire({ title: "Deleted", text: `${data.deleted_count} units removed.`, icon: "success" });
        log(`✓ Deleted: ${data.deleted_count}`, "success");
        if (data.not_found_count > 0) log(`? Not Found: ${data.not_found_count}`, "info");
        setUnitsToDelete(new Set());
      } else {
        Swal.fire({ title: "Error", text: data.error, icon: "error" });
        log(`Deletion Failed: ${data.error}`, "error");
      }
    } catch (err) {
      Swal.fire({ title: "System Error", text: err.message, icon: "error" });
      log(`System Error: ${err.message}`, "error");
    } finally {
      setLoading((p) => ({ ...p, delete: false }));
    }
  };

  const addTag    = (code) => setUnitsToDelete((prev) => new Set([...prev, code]));
  const removeTag = (code) => setUnitsToDelete((prev) => { const n = new Set(prev); n.delete(code); return n; });

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="ih-root">

      {/* ══════════════════════════════════════════════════
          STICKY HEADER — matches screenshot layout
          ══════════════════════════════════════════════════ */}
      <header className="ih-topbar">
        <div className="ih-topbar-inner">

          {/* LEFT: icon + page title */}
          <div className="ih-topbar-left">
            <span className="ih-topbar-icon">▦</span>
            <div className="ih-topbar-text">
              <h1>Unit Warehouse Hub</h1>
            </div>
          </div>

          {/* RIGHT: company selector OR lock badge */}
          <div className="ih-topbar-right">
            {IS_UPLOADER ? (
              <span className="ih-lock-badge">🔒 {LOCKED_COMPANY_NAME}</span>
            ) : (
              <>
                {/* "Company:" label sits LEFT of the dropdown, inline */}
                <label className="ih-topbar-company-label" htmlFor="ih-company-select">
                  <span className="ih-label-icon">▦</span>
                  Warehouse:
                </label>

                <select
                  id="ih-company-select"
                  className="ih-company-select"
                  value={selectedCompanyId}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                >
                  <option value="" disabled>Select Company…</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          BODY
          ══════════════════════════════════════════════════ */}
      {!isReady ? (

        /* Empty state — same width / margins as header */
        <div className="ih-empty-wrap">
          <div className="ih-empty-state">
            <p>Please select a company to view the warehouse management hub.</p>
          </div>
        </div>

      ) : (

        <div className="ih-body">

          {/* ── Import Sources ──────────────────────────── */}
          <div>
            <div className="ih-section-title">Import Data Sources</div>
            <div className="ih-card-grid">

              {/* CSV */}
              <div className="ih-source-card ih-card-csv">
                <div className="ih-card-top">
                  <span className="ih-source-icon">📂</span>
                  <h4>CSV Upload</h4>
                  <p>Upload manual files for bulk historical data or initial setup.</p>
                </div>
                <div>
                  <input ref={csvInputRef} type="file" accept=".csv" className="ih-file-input" />
                  <button className="ih-btn ih-btn-blue" onClick={() => triggerImport("csv")} disabled={loading.csv}>
                    {loading.csv ? <><span className="ih-spinner" /> Processing…</> : "Upload & Merge"}
                  </button>
                </div>
              </div>

              {/* Google Sheets */}
              {config.has_sheets && (
                <div className="ih-source-card ih-card-sheet">
                  <div className="ih-card-top">
                    <span className="ih-source-icon">📊</span>
                    <h4>Google Sheets</h4>
                    <p>Sync with live spreadsheets.</p>
                    <StatusPill url={config.sheet_url} prefix="Link:" />
                  </div>
                  <button className="ih-btn ih-btn-green" onClick={() => triggerImport("sheet")} disabled={loading.sheet}>
                    {loading.sheet ? <><span className="ih-spinner" /> Fetching…</> : "Fetch & Merge"}
                  </button>
                </div>
              )}

              {/* ERP */}
              {config.has_erp && (
                <div className="ih-source-card ih-card-erp">
                  <div className="ih-card-top">
                    <span className="ih-source-icon">🔄</span>
                    <h4>ERP API</h4>
                    <p>Pull data from external ERP.</p>
                    <StatusPill url={config.erp_url} prefix="Endpoint:" />
                  </div>
                  <button className="ih-btn ih-btn-yellow" onClick={() => triggerImport("erp")} disabled={loading.erp}>
                    {loading.erp ? <><span className="ih-spinner" /> Requesting…</> : "Request & Merge"}
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* ── Database Operations ──────────────────────── */}
          <div>
            <div className="ih-section-title">Database Operations</div>
            <div className="ih-card-grid-2">

              {/* Bulk Rename */}
              <div className="ih-source-card ih-card-rename">
                <div>
                  <div className="ih-rename-header">
                    <div className="ih-icon-circle ih-icon-circle-purple">🏷️</div>
                    <div className="ih-rename-header-text">
                      <h4 style={{ color: "#6d28d9" }}>Bulk Rename</h4>
                      <small>Migrate unit codes while preserving history.</small>
                    </div>
                  </div>
                  <div className="ih-col-hint">
                    <code>Required Columns:</code>
                    <span className="ih-badge">Old Unit Code</span>
                    <span className="ih-badge">New Unit Code</span>
                  </div>
                </div>
                <div className="ih-rename-row">
                  <input ref={renameInputRef} type="file" accept=".csv" className="ih-file-input" />
                  <button
                    className="ih-btn ih-btn-purple"
                    style={{ width: "auto", whiteSpace: "nowrap" }}
                    onClick={triggerRename}
                    disabled={loading.rename}
                  >
                    {loading.rename ? <span className="ih-spinner" style={{ borderTopColor: "#7c3aed" }} /> : "Execute"}
                  </button>
                </div>
              </div>

              {/* Deletion */}
              <div className="ih-source-card ih-card-delete">
                <div>
                  <div className="ih-delete-header">
                    <div className="ih-rename-header" style={{ marginBottom: 0 }}>
                      <div className="ih-icon-circle ih-icon-circle-red">🗑️</div>
                      <div className="ih-rename-header-text">
                        <h4 style={{ color: "#dc2626" }}>Deletion</h4>
                        <small>Permanently remove units.</small>
                      </div>
                    </div>
                    <button className="ih-btn ih-btn-red" onClick={executeDelete} disabled={loading.delete}>
                      {loading.delete ? <span className="ih-spinner" /> : "Delete Selected"}
                    </button>
                  </div>
                  <TagInput tags={unitsToDelete} onAdd={addTag} onRemove={removeTag} />
                  <div className="ih-delete-hint">
                    <small>Supports bulk tag entry</small>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── System Log ──────────────────────────────── */}
          <div>
            <div className="ih-section-title">System Log</div>
            <div className="ih-console" ref={consoleRef}>
              {logs.map((entry, i) => (
                <LogLine key={i} entry={entry} />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}