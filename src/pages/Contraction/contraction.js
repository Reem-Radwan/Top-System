import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import './contraction.css';
import { COMPANIES, MONTHS, getProjects, getUnits, formatDate, todayISO } from '../../data/contractiondata';

// ─────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────
function formatSalesDisplay(raw) {
  const clean = raw.replace(/[^0-9.]/g, '');
  const parts = clean.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : parts.join('.');
}

function buildCalendarDays(year, month, selectedISO) {
  const today = new Date();
  const firstDay  = new Date(year, month, 1).getDay();
  const daysTotal = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();

  const days = [];

  // leading filler from prev month
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevTotal - i, type: 'other' });
  }

  for (let d = 1; d <= daysTotal; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const isSelected = iso === selectedISO;
    days.push({ day: d, iso, type: 'current', isToday, isSelected });
  }

  // trailing filler
  const used = firstDay + daysTotal;
  const rem  = used % 7 === 0 ? 0 : 7 - (used % 7);
  for (let i = 1; i <= rem; i++) {
    days.push({ day: i, type: 'other' });
  }

  return days;
}

// ─────────────────────────────────────────
//  SearchableDropdown
// ─────────────────────────────────────────
let _dropdownCounter = 0;

function SearchableDropdown({ items, value, onChange, placeholder, disabled, hasError }) {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const wrapperRef            = useRef(null);
  const searchRef             = useRef(null);
  // FIX: stable unique id so aria-controls can reference the panel
  const listId = useRef(`sd-list-${++_dropdownCounter}`).current;

  const filtered = items.filter(i => i.toLowerCase().includes(search.toLowerCase()));

  // close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggle() {
    if (disabled) return;
    if (!open) {
      setOpen(true);
      setSearch('');
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setOpen(false);
    }
  }

  function select(item) {
    onChange(item);
    setOpen(false);
  }

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <div
        className={`custom-select-box${open ? ' open' : ''}${disabled ? ' disabled' : ''}${hasError ? ' error' : ''}`}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      >
        {value
          ? <span>{value}</span>
          : <span className="select-placeholder">{placeholder}</span>
        }
      </div>

      <svg
        className={`select-arrow${open ? ' open' : ''}`}
        viewBox="0 0 20 20" fill="currentColor" width="16" height="16"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>

      {open && (
        <div className="dropdown-panel" id={listId} role="listbox">
          <div className="dropdown-search">
            <input
              ref={searchRef}
              className="dropdown-search-input"
              type="text"
              placeholder={`Search ${placeholder.replace('Select ', '').replace('…', '')}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setOpen(false)}
            />
          </div>
          <div className="dropdown-list">
            {filtered.length === 0
              ? <div className="dropdown-item no-result">No results found</div>
              : filtered.map(item => (
                  <div
                    key={item}
                    className={`dropdown-item${item === value ? ' active' : ''}`}
                    onClick={() => select(item)}
                  >
                    {item}
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
//  DatePicker
// ─────────────────────────────────────────
function DatePicker({ value, onChange, hasError }) {
  const today    = new Date();
  const [open, setOpen]   = useState(false);
  const [curYear, setCurYear]   = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [yearInput, setYearInput] = useState(String(today.getFullYear()));
  const wrapperRef = useRef(null);

  // close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // keep yearInput in sync when navigating with arrows
  useEffect(() => { setYearInput(String(curYear)); }, [curYear]);

  function prevMonth() {
    if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); }
    else setCurMonth(m => m - 1);
  }
  function nextMonth() {
    if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); }
    else setCurMonth(m => m + 1);
  }

  function pickDay(iso) {
    onChange(iso);
    setOpen(false);
  }

  function pickToday() {
    const iso = todayISO();
    setCurYear(today.getFullYear());
    setCurMonth(today.getMonth());
    onChange(iso);
    setOpen(false);
  }

  function clear() { onChange(''); }

  function handleYearInput(e) {
    const raw = e.target.value;
    setYearInput(raw);
    const v = parseInt(raw, 10);
    if (v >= 1900 && v <= 2200) setCurYear(v);
  }

  const days = buildCalendarDays(curYear, curMonth, value);

  // Format display value
  let displayText = '';
  if (value) {
    const [y, m, d] = value.split('-');
    displayText = `${d} ${MONTHS[parseInt(m, 10) - 1].slice(0, 3)} ${y}`;
  }

  return (
    <div className="date-picker-wrapper" ref={wrapperRef}>
      <div
        className={`date-display${open ? ' open' : ''}${hasError ? ' error' : ''}`}
        tabIndex={0}
        role="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }}
      >
        <span className={`date-val${!value ? ' empty' : ''}`}>
          {value ? displayText : 'Select date…'}
        </span>
        <svg className="cal-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
      </div>

      {open && (
        <div className="cal-panel">
          {/* Header */}
          <div className="cal-header">
            <button className="cal-nav" onClick={e => { e.stopPropagation(); prevMonth(); }}>&#8249;</button>
            <span className="cal-month-year">{MONTHS[curMonth]} {curYear}</span>
            <button className="cal-nav" onClick={e => { e.stopPropagation(); nextMonth(); }}>&#8250;</button>
          </div>

          {/* Quick nav */}
          <div className="cal-quicknav">
            <select
              className="cal-month-select"
              value={curMonth}
              onChange={e => setCurMonth(parseInt(e.target.value, 10))}
            >
              {MONTHS.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>
            <input
              className="cal-year-input"
              type="number"
              placeholder="Year"
              value={yearInput}
              onChange={handleYearInput}
              onKeyDown={e => e.stopPropagation()}
            />
          </div>

          {/* Weekday headers */}
          <div className="cal-weekdays">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <span key={d} className="cal-weekday">{d}</span>
            ))}
          </div>

          {/* Days grid */}
          <div className="cal-days">
            {days.map((d, i) => (
              <button
                key={i}
                className={[
                  'cal-day',
                  d.type === 'other' ? 'other-month' : '',
                  d.isToday    ? 'today'    : '',
                  d.isSelected ? 'selected' : '',
                ].filter(Boolean).join(' ')}
                disabled={d.type === 'other'}
                onClick={e => { e.stopPropagation(); if (d.iso) pickDay(d.iso); }}
              >
                {d.day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="cal-footer">
            <button className="cal-today-btn" onClick={e => { e.stopPropagation(); pickToday(); }}>Today</button>
            <button className="cal-clear-btn" onClick={e => { e.stopPropagation(); clear(); setOpen(false); }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
//  Toast
// ─────────────────────────────────────────
function Toast({ message, show, onClose }) {
  return (
    <div className={`toast${show ? ' show' : ''}`} role="alert">
      <div className="toast-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1FA65E" opacity=".15"/>
          <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#1FA65E" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="toast-body">
        <div className="toast-title">Contract Saved Successfully!</div>
        <div className="toast-msg">{message}</div>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close">&#x2715;</button>
      <div className="toast-bar" />
    </div>
  );
}

// ─────────────────────────────────────────
//  Initial form state
// ─────────────────────────────────────────
const INITIAL_STATE = {
  company:      '',
  project:      '',
  unit:         '',
  contractDate: todayISO(),
  deliveryDate: '',
  salesValue:   '',
};

const INITIAL_ERRORS = {
  company:      false,
  project:      false,
  unit:         false,
  deliveryDate: false,
};

// ─────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────
export default function Contraction() {
  const [form,   setForm]   = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [toast,  setToast]  = useState({ show: false, message: '' });
  const toastTimer = useRef(null);

  // Derived cascade options
  const projectOptions = getProjects(form.company);
  const unitOptions    = getUnits(form.company, form.project);

  // ── field setters ──
  function setField(name, value) {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      // cascade resets
      if (name === 'company') { next.project = ''; next.unit = ''; }
      if (name === 'project') { next.unit = ''; }
      return next;
    });
    setErrors(prev => ({ ...prev, [name]: false }));
  }

  // ── sales value formatter ──
  function handleSalesInput(e) {
    setForm(prev => ({ ...prev, salesValue: formatSalesDisplay(e.target.value) }));
  }

  // ── toast helpers ──
  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast({ show: true, message: msg });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 4300);
  }
  function closeToast() {
    clearTimeout(toastTimer.current);
    setToast(t => ({ ...t, show: false }));
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ── validation ──
  function validate() {
    const e = {
      company:      !form.company,
      project:      !form.project,
      unit:         !form.unit,
      deliveryDate: !form.deliveryDate,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  }

  // ── reset ──
  function resetForm() {
    setForm(INITIAL_STATE);
    setErrors(INITIAL_ERRORS);
  }

  // ── save ──
  function handleSave() {
    if (!validate()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields before saving.',
        confirmButtonColor: '#C8622A',
      });
      return;
    }

    const { company, project, unit, contractDate, deliveryDate, salesValue } = form;

    const tableHTML = `
      <table class="confirm-table">
        <tr><td>Company</td><td>${company}</td></tr>
        <tr><td>Project</td><td>${project}</td></tr>
        <tr><td>Unit Code</td><td>${unit}</td></tr>
        <tr><td>Contract Date</td><td>${formatDate(contractDate)}</td></tr>
        <tr><td>Delivery Date</td><td>${formatDate(deliveryDate)}</td></tr>
        <tr><td>Sales Value</td><td>${salesValue || '—'}</td></tr>
      </table>`;

    Swal.fire({
      title: 'Confirm Contract',
      html: `<p style="margin-bottom:10px;color:#5C5650;font-size:.88rem;">Review the details below before confirming:</p>${tableHTML}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm & Save',
      cancelButtonText: 'Go Back',
      confirmButtonColor: '#C8622A',
      cancelButtonColor: '#A09890',
      customClass: { popup: 'swal2-popup' },
    }).then(result => {
      if (result.isConfirmed) {
        showToast(`${company} — ${project} has been saved.`);
        resetForm();
      }
    });
  }

  // ─────────────────────────────────────
  //  Render
  // ─────────────────────────────────────
  return (
    <>
      <Toast message={toast.message} show={toast.show} onClose={closeToast} />

      <div className="scroll-container">
      <div className="page-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-icon">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
              <path d="M8 13h8v1.5H8zm0 3h5v1.5H8z"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>Contraction</h1>
            <p>Contract management &amp; documentation</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="section-title">Contract Details</div>

          <div className="form-grid">

            {/* Company */}
            <div className="field-group">
              <label className="field-label">
                Company <span className="req">*</span>
              </label>
              <SearchableDropdown
                items={COMPANIES}
                value={form.company}
                onChange={v => setField('company', v)}
                placeholder="Select company…"
                disabled={false}
                hasError={errors.company}
              />
              {errors.company && <span className="field-error">Please select a company.</span>}
            </div>

            {/* Project */}
            <div className="field-group">
              <label className="field-label">
                Project <span className="req">*</span>
              </label>
              <SearchableDropdown
                items={projectOptions}
                value={form.project}
                onChange={v => setField('project', v)}
                placeholder={form.company ? 'Select project…' : 'Select company first…'}
                disabled={!form.company}
                hasError={errors.project}
              />
              {errors.project && <span className="field-error">Please select a project.</span>}
            </div>

            {/* Unit Code */}
            <div className="field-group">
              <label className="field-label">
                Unit Code <span className="req">*</span>
              </label>
              <SearchableDropdown
                items={unitOptions}
                value={form.unit}
                onChange={v => setField('unit', v)}
                placeholder={form.project ? 'Select unit code…' : 'Select project first…'}
                disabled={!form.project}
                hasError={errors.unit}
              />
              {errors.unit && <span className="field-error">Please select a unit code.</span>}
            </div>

            <div className="form-divider" />

            {/* Contract Date */}
            <div className="field-group">
              <label className="field-label">Contract Date</label>
              <DatePicker
                value={form.contractDate}
                onChange={v => setField('contractDate', v)}
                hasError={false}
              />
            </div>

            {/* Delivery Date */}
            <div className="field-group">
              <label className="field-label">
                Contract Delivery Date <span className="req">*</span>
              </label>
              <DatePicker
                value={form.deliveryDate}
                onChange={v => setField('deliveryDate', v)}
                hasError={errors.deliveryDate}
              />
              {errors.deliveryDate && <span className="field-error">Please select a delivery date.</span>}
            </div>

            {/* Sales Value */}
            <div className="field-group">
              <label className="field-label">
                Sales Value <span className="opt">(optional)</span>
              </label>
              <input
                className="text-input"
                type="text"
                placeholder="e.g. 250,000.00"
                value={form.salesValue}
                onChange={handleSalesInput}
              />
            </div>

          </div>{/* /form-grid */}

          <div className="btn-row">
            <button className="btn-save" type="button" onClick={handleSave}>
              <svg viewBox="0 0 24 24">
                <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z"/>
              </svg>
              Save Contract
            </button>
          </div>
        </div>

      </div>
      </div>
    </>
  );
}