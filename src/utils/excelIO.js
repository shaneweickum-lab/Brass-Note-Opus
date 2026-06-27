import writeXlsxFile from 'write-excel-file/browser';
import readXlsxFile from 'read-excel-file/browser';

// ─── EXPORT ─────────────────────────────────────────────────────────────────

const HEADER_STYLE = {
  fontWeight: 'bold',
  backgroundColor: '#0F172A',
  color: '#D4A843',
  align: 'center',
};

const ALT_ROW = { backgroundColor: '#F8F9FA' };

function cell(value, opts = {}) {
  return { value: value ?? '', ...opts };
}

function dateCell(isoStr) {
  if (!isoStr) return cell('');
  const d = new Date(isoStr);
  return { value: d, type: Date, format: 'mm/dd/yyyy' };
}

function buildCommissionsSheet(commissions) {
  const headers = [
    'Customer ID', 'Client Name', 'Email', 'Phone',
    'Type', 'Package', 'Songs', 'Total Payment', 'Songwriter Buyout',
    'Stage', 'Rush', 'Delivery Deadline', 'Delivered At',
    'Revision Window End', 'Revisions Used', 'Revisions Included',
    'Revision Pack Purchased', 'Follow-Up Date', 'Follow-Up Dismissed',
    'Brief Summary', 'Genre', 'Vocal Type', 'Delivery Link', 'Notes',
    'Created At',
  ];

  const rows = [
    headers.map((h) => ({ value: h, ...HEADER_STYLE })),
    ...commissions.map((c, i) => {
      const bg = i % 2 === 1 ? ALT_ROW : {};
      return [
        cell(c.id, bg),
        cell(c.clientName, bg),
        cell(c.clientEmail, bg),
        cell(c.clientPhone, bg),
        cell(c.commissionType, bg),
        cell(c.package, bg),
        { value: c.songCount || 0, type: Number, ...bg },
        { value: c.totalPayment || 0, type: Number, format: '$#,##0.00', ...bg },
        cell(c.songwriterBuyout ? 'Yes' : 'No', bg),
        cell(c.stage, bg),
        cell(c.isRush ? 'Yes' : 'No', bg),
        { ...dateCell(c.deliveryDeadline), ...bg },
        { ...dateCell(c.deliveredAt), ...bg },
        { ...dateCell(c.revisionWindowEnd), ...bg },
        { value: c.revisionsUsed || 0, type: Number, ...bg },
        { value: c.revisionsIncluded || 3, type: Number, ...bg },
        cell(c.revisionPackPurchased ? 'Yes' : 'No', bg),
        { ...dateCell(c.followUpDate), ...bg },
        cell(c.followUpDismissed ? 'Yes' : 'No', bg),
        cell(c.briefSummary, bg),
        cell(c.genre, bg),
        cell(c.vocalType, bg),
        cell(c.deliveryLink, bg),
        cell(c.notes, bg),
        { ...dateCell(c.createdAt), ...bg },
      ];
    }),
  ];

  return rows;
}

function buildSongsSheet(commissions) {
  const headers = [
    'Song ID', 'Global #', 'Customer ID', 'Client Name',
    'Style Code', 'Genre Code', 'Lyric Code', 'Vocal Code',
    'Song Title', 'Sub-Genre', 'Vocal Type', 'BPM', 'Time Sig',
    'Mood', 'Tension Arc', 'About the Song', 'Instruments / Vocal Elements',
    'Suno Version', 'Generation #', 'Delivery Status', 'Production Notes',
  ];

  const rows = [
    headers.map((h) => ({ value: h, ...HEADER_STYLE })),
    ...commissions.flatMap((c, ci) =>
      (c.songs || []).map((s, si) => {
        const bg = (ci + si) % 2 === 1 ? ALT_ROW : {};
        return [
          cell(s.songId, bg),
          { value: s.globalNumber || 0, type: Number, ...bg },
          cell(c.id, bg),
          cell(c.clientName, bg),
          cell(s.styleCode, bg),
          cell(s.genreCode, bg),
          cell(s.lyricCode, bg),
          cell(s.vocalCode, bg),
          cell(s.songTitle, bg),
          cell(s.subGenre, bg),
          cell(s.vocalTypeDescription, bg),
          { value: s.bpm || 0, type: Number, ...bg },
          cell(s.timeSig, bg),
          cell(s.mood, bg),
          cell(s.tensionArc, bg),
          cell(s.aboutSong, bg),
          cell(s.instrumentsVocalElements, bg),
          cell(s.sunoVersion, bg),
          { value: s.generationNumber || 0, type: Number, ...bg },
          cell(s.deliveryStatus, bg),
          cell(s.productionNotes, bg),
        ];
      })
    ),
  ];

  return rows;
}

function buildSubscriptionsSheet(subscriptions) {
  const headers = [
    'Name', 'Monthly Cost', 'Annual Cost', 'Due Day',
    'Category', 'Auto-Renew', 'Status', 'Notes', 'Created At',
  ];

  const rows = [
    headers.map((h) => ({ value: h, ...HEADER_STYLE })),
    ...subscriptions.map((s, i) => {
      const bg = i % 2 === 1 ? ALT_ROW : {};
      return [
        cell(s.name, bg),
        { value: s.monthlyCost || 0, type: Number, format: '$#,##0.00', ...bg },
        { value: s.annualCost || 0, type: Number, format: '$#,##0.00', ...bg },
        { value: s.dueDate || 1, type: Number, ...bg },
        cell(s.category, bg),
        cell(s.autoRenew ? 'Yes' : 'No', bg),
        cell(s.status, bg),
        cell(s.notes, bg),
        { ...dateCell(s.createdAt), ...bg },
      ];
    }),
  ];

  return rows;
}

function buildLabsSheet(labs) {
  const headers = [
    'BNL ID', 'Labs Global #', 'Date', 'Experiment Code', 'Experiment Name',
    'Suno Version', 'Weirdness', 'Constraint',
    'Style Prompt Used', 'Lyric Prompt Used', 'Tier 2 Symbols Used', 'Tier 3 Applied',
    'Hypothesis', 'Expected Result', 'Actual Result',
    'Result Code', 'Key Finding', 'Integration Status',
    'Status', 'Generation #', 'Notes',
  ];

  const rows = [
    headers.map((h) => ({ value: h, ...HEADER_STYLE })),
    ...labs.map((l, i) => {
      const bg = i % 2 === 1 ? ALT_ROW : {};
      return [
        cell(l.id, bg),
        { value: l.labsGlobalNumber || 0, type: Number, ...bg },
        { ...dateCell(l.date), ...bg },
        cell(l.experimentCode, bg),
        cell(l.experimentName, bg),
        cell(l.sunoVersion, bg),
        { value: l.weirdness || 0, type: Number, ...bg },
        { value: l.constraint || 0, type: Number, ...bg },
        cell(l.stylePrompt, bg),
        cell(l.lyricPrompt, bg),
        cell(l.tier2Symbols, bg),
        cell(l.tier3Applied ? 'Yes' : 'No', bg),
        cell(l.hypothesis, bg),
        cell(l.expectedResult, bg),
        cell(l.actualResult, bg),
        cell(l.resultCode, bg),
        cell(l.keyFinding, bg),
        cell(l.integrationStatus, bg),
        cell(l.status, bg),
        { value: l.generationNumber || 0, type: Number, ...bg },
        cell(l.notes, bg),
      ];
    }),
  ];

  return rows;
}

export async function downloadTemplate() {
  const makeHeader = (headers) => [headers.map((h) => ({ value: h, ...HEADER_STYLE }))];

  await writeXlsxFile(
    [
      makeHeader(['Customer ID', 'Client Name', 'Email', 'Phone', 'Type', 'Package', 'Songs',
        'Total Payment', 'Songwriter Buyout', 'Stage', 'Rush', 'Delivery Deadline', 'Delivered At',
        'Revision Window End', 'Revisions Used', 'Revisions Included', 'Revision Pack Purchased',
        'Follow-Up Date', 'Follow-Up Dismissed', 'Brief Summary', 'Genre', 'Vocal Type',
        'Delivery Link', 'Notes', 'Created At']),
      makeHeader(['Song ID', 'Global #', 'Customer ID', 'Client Name', 'Style Code', 'Genre Code',
        'Lyric Code', 'Vocal Code', 'Song Title', 'Sub-Genre', 'Vocal Type', 'BPM', 'Time Sig',
        'Mood', 'Tension Arc', 'About the Song', 'Instruments / Vocal Elements',
        'Suno Version', 'Generation #', 'Delivery Status', 'Production Notes']),
      makeHeader(['Name', 'Monthly Cost', 'Annual Cost', 'Due Day', 'Category', 'Auto-Renew',
        'Status', 'Notes', 'Created At']),
      makeHeader(['BNL ID', 'Labs Global #', 'Date', 'Experiment Code', 'Experiment Name',
        'Suno Version', 'Weirdness', 'Constraint', 'Style Prompt Used', 'Lyric Prompt Used',
        'Tier 2 Symbols Used', 'Tier 3 Applied', 'Hypothesis', 'Expected Result', 'Actual Result',
        'Result Code', 'Key Finding', 'Integration Status', 'Status', 'Generation #', 'Notes']),
    ],
    {
      sheets: ['Commissions', 'Songs', 'Subscriptions', 'Labs'],
      fileName: 'preludio-template.xlsx',
    }
  );
}

export async function exportToExcel({ commissions, subscriptions, labs }) {
  const today = new Date().toISOString().slice(0, 10);

  await writeXlsxFile(
    [
      buildCommissionsSheet(commissions),
      buildSongsSheet(commissions),
      buildSubscriptionsSheet(subscriptions),
      buildLabsSheet(labs),
    ],
    {
      sheets: ['Commissions', 'Songs', 'Subscriptions', 'Labs'],
      fileName: `preludio-export-${today}.xlsx`,
      columns: [
        // Commissions sheet column widths
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ],
    }
  );
}

// ─── IMPORT ─────────────────────────────────────────────────────────────────

function parseYesNo(val) {
  if (val === null || val === undefined || val === '') return false;
  const s = String(val).toLowerCase().trim();
  return s === 'yes' || s.startsWith('yes');
}

function parseDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Parse MMDDYY string (e.g. "011526" = Jan 15 2026) used in the BN Labs spreadsheet
function parseMmddyyDate(val) {
  if (!val) return null;
  const s = String(val).replace(/\D/g, '').padStart(6, '0');
  if (s.length < 6) return null;
  const mm = parseInt(s.slice(0, 2));
  const dd = parseInt(s.slice(2, 4));
  const yy = parseInt(s.slice(4, 6));
  const year = yy <= 50 ? 2000 + yy : 1900 + yy;
  const d = new Date(year, mm - 1, dd);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Detect commission type from a free-text package/type field in the source spreadsheet
function inferCommissionType(packageType) {
  const s = String(packageType || '').toLowerCase();
  if (s.includes('organization') || s.includes('org')) return 'organization';
  if (s.includes('content') || s.includes('creator')) return 'content_creator';
  return 'individual';
}

// Map "Complete"/"In Progress" status from source spreadsheet to internal pipeline stage
function inferStage(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'complete' || s === 'completed' || s === 'delivered') return 'delivery';
  if (s === 'archived' || s === 'archive') return 'archive';
  return 'brief';
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => { obj[h] = row[i] ?? null; });
  return obj;
}

export async function importFromExcel(file, { generateUUID }) {
  const results = { commissions: [], subscriptions: [], labs: [], errors: [] };

  try {
    // ── Clients / Commissions ────────────────────────────────────────────────
    // Try sheet named "Clients" (source spreadsheet) then "Commissions" (our export)
    const commSheet = await readXlsxFile(file, { sheet: 'Clients' }).catch(() => null)
      || await readXlsxFile(file, { sheet: 'Commissions' }).catch(() => null);

    if (commSheet && commSheet.length > 1) {
      // Skip title rows — find the actual header row (has 'Customer ID' or 'First Name')
      let headerIdx = commSheet.findIndex((row) =>
        row.some((c) => {
          const s = String(c || '').trim();
          return s === 'Customer ID' || s === 'First Name' || s === 'Client Name';
        })
      );
      if (headerIdx === -1) headerIdx = 0;
      const headers = commSheet[headerIdx].map((h) => String(h || '').trim());
      const isSourceFormat = headers.includes('First Name'); // source spreadsheet format

      commSheet.slice(headerIdx + 1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          if (isSourceFormat) {
            const custId = String(r['Customer ID'] || '').split('-')[0]; // strip -N song suffix
            if (!custId && !r['First Name']) return;
            const firstName = String(r['First Name'] || '');
            const lastName = String(r['Last Name'] || '');
            const clientName = [firstName, lastName].filter(Boolean).join(' ');
            const packageType = String(r['Package / Type'] || '');
            const stage = inferStage(r['Status']);
            const songCount = Number(r['# Songs']) || 1;
            const buyoutRaw = String(r['Songwriter Buyout'] || '');
            results.commissions.push({
              id: custId,
              internalId: generateUUID(),
              createdAt: parseDate(r['Date Purchased']) || new Date().toISOString(),
              clientName,
              clientEmail: String(r['Email'] || ''),
              clientPhone: String(r['Phone'] || ''),
              commissionType: inferCommissionType(packageType),
              package: packageType,
              songCount,
              totalPayment: Number(r['Total Payment ($)']) || 0,
              songwriterBuyout: parseYesNo(buyoutRaw),
              songwriterBuyoutDetails: buyoutRaw,
              stage,
              stageHistory: [{ stage, timestamp: new Date().toISOString(), userId: 'owner' }],
              isRush: false,
              deliveryDeadline: parseDate(r['Date Completed']),
              deliveredAt: stage === 'delivery' ? parseDate(r['Date Completed']) : null,
              revisionWindowEnd: null,
              revisionsIncluded: 3,
              revisionsUsed: 0,
              revisionPackPurchased: false,
              revisionPackSessions: 0,
              revisionLog: [],
              songs: [],
              deliveryLink: '',
              communicationLog: [],
              followUpDate: null,
              followUpDismissed: false,
              briefSummary: String(r['Notes'] || ''),
              genre: '',
              vocalType: '',
              notes: String(r['Notes'] || ''),
            });
          } else {
            const r2 = r;
            if (!r2['Customer ID'] && !r2['Client Name']) return;
            const stage = String(r2['Stage'] || 'brief');
            results.commissions.push({
              id: String(r2['Customer ID'] || ''),
              internalId: generateUUID(),
              createdAt: parseDate(r2['Created At']) || new Date().toISOString(),
              clientName: String(r2['Client Name'] || ''),
              clientEmail: String(r2['Email'] || ''),
              clientPhone: String(r2['Phone'] || ''),
              commissionType: String(r2['Type'] || 'individual'),
              package: String(r2['Package'] || ''),
              songCount: Number(r2['Songs']) || 1,
              totalPayment: Number(r2['Total Payment']) || 0,
              songwriterBuyout: parseYesNo(r2['Songwriter Buyout']),
              songwriterBuyoutDetails: '',
              stage,
              stageHistory: [{ stage, timestamp: new Date().toISOString(), userId: 'owner' }],
              isRush: parseYesNo(r2['Rush']),
              deliveryDeadline: parseDate(r2['Delivery Deadline']),
              deliveredAt: parseDate(r2['Delivered At']),
              revisionWindowEnd: parseDate(r2['Revision Window End']),
              revisionsIncluded: Number(r2['Revisions Included']) || 3,
              revisionsUsed: Number(r2['Revisions Used']) || 0,
              revisionPackPurchased: parseYesNo(r2['Revision Pack Purchased']),
              revisionPackSessions: 0,
              revisionLog: [],
              songs: [],
              deliveryLink: String(r2['Delivery Link'] || ''),
              communicationLog: [],
              followUpDate: parseDate(r2['Follow-Up Date']),
              followUpDismissed: parseYesNo(r2['Follow-Up Dismissed']),
              briefSummary: String(r2['Brief Summary'] || ''),
              genre: String(r2['Genre'] || ''),
              vocalType: String(r2['Vocal Type'] || ''),
              notes: String(r2['Notes'] || ''),
            });
          }
        } catch (e) {
          results.errors.push(`Clients row ${idx + headerIdx + 2}: ${e.message}`);
        }
      });
    }

    // ── Songs ────────────────────────────────────────────────────────────────
    // Try "Songs" sheet (both formats use this name)
    const songSheet = await readXlsxFile(file, { sheet: 'Songs' }).catch(() => null);
    if (songSheet && songSheet.length > 1) {
      let headerIdx = songSheet.findIndex((row) =>
        row.some((c) => String(c || '').trim() === 'Song ID')
      );
      if (headerIdx === -1) headerIdx = 0;
      const headers = songSheet[headerIdx].map((h) => String(h || '').trim());
      const isSourceFormat = headers.includes('Genre'); // source spreadsheet has full Genre column

      songSheet.slice(headerIdx + 1).forEach((row) => {
        const r = rowToObj(headers, row);
        // Customer ID in source format is the base ID (without -N suffix)
        const customerId = String(r['Customer ID'] || '').split('-')[0];
        const comm = results.commissions.find((c) => c.id === customerId);
        if (!comm) return;

        const styleCode = isSourceFormat ? String(r['Style'] || '01') : String(r['Style Code'] || '01');
        const sunoVer = isSourceFormat ? String(r['Suno Ver'] || '') : String(r['Suno Version'] || '');
        const genNum = isSourceFormat ? Number(r['Gen #']) || null : Number(r['Generation #']) || null;

        comm.songs.push({
          songId: String(r['Song ID'] || ''),
          globalNumber: Number(r['Global #']) || 0,
          globalDisplay: String(r['# Display'] || r['Global #'] || '0').padStart(4, '0'),
          styleCode,
          genreCode: String(r['Genre Code'] || '17'),
          lyricCode: String(r['Lyric'] || r['Lyric Code'] || 'L'),
          vocalCode: String(r['Vocal'] || r['Vocal Code'] || 'M'),
          songTitle: String(r['Song Title'] || ''),
          subGenre: String(r['Sub-Genre'] || ''),
          vocalTypeDescription: String(r['Vocal Type'] || ''),
          bpm: Number(r['BPM']) || null,
          timeSig: String(r['Time Sig'] || '4/4'),
          mood: String(r['Mood'] || ''),
          tensionArc: String(r['Tension Arc'] || ''),
          aboutSong: String(r['About the Song'] || ''),
          instrumentsVocalElements: String(r['Instruments / Vocal Elements'] || ''),
          sunoVersion: sunoVer,
          generationNumber: genNum,
          deliveryStatus: String(r['Delivery Status'] || 'pending'),
          productionNotes: String(r['Production Notes'] || ''),
        });
      });
    }

    // ── Subscriptions / Expenses ─────────────────────────────────────────────
    // Try "Expenses" (source) then "Subscriptions" (our export)
    const subSheet = await readXlsxFile(file, { sheet: 'Expenses' }).catch(() => null)
      || await readXlsxFile(file, { sheet: 'Subscriptions' }).catch(() => null);

    if (subSheet && subSheet.length > 1) {
      let headerIdx = subSheet.findIndex((row) =>
        row.some((c) => {
          const s = String(c || '').trim();
          return s === 'Expense Name' || s === 'Name';
        })
      );
      if (headerIdx === -1) headerIdx = 0;
      const headers = subSheet[headerIdx].map((h) => String(h || '').trim());
      const isSourceFormat = headers.includes('Expense Name');

      subSheet.slice(headerIdx + 1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          const name = String(r['Expense Name'] || r['Name'] || '').trim();
          if (!name) return;
          const monthly = Number(r['Monthly Cost ($)'] || r['Monthly Cost']) || 0;
          const annual = Number(r['Annual Cost ($)'] || r['Annual Cost']) || monthly * 12;
          // Due Date from source can be "Monthly" or a day number
          const dueDateRaw = r['Due Date'] || r['Due Day'];
          const dueDate = typeof dueDateRaw === 'number'
            ? dueDateRaw
            : (String(dueDateRaw || '').toLowerCase() === 'monthly' ? 1 : Number(dueDateRaw) || 1);

          results.subscriptions.push({
            id: generateUUID(),
            name,
            monthlyCost: monthly,
            annualCost: annual,
            dueDate,
            category: String(r['Category'] || 'Subscription').toLowerCase(),
            autoRenew: parseYesNo(r['Auto-Renew']),
            status: String(r['Status'] || 'active'),
            notes: String(r['Notes'] || ''),
            createdAt: parseDate(r['Created At']) || new Date().toISOString(),
          });
        } catch (e) {
          results.errors.push(`Expenses row ${idx + headerIdx + 2}: ${e.message}`);
        }
      });
    }

    // ── Labs ─────────────────────────────────────────────────────────────────
    // Try "BN Labs" (source) then "Labs" (our export)
    const labSheet = await readXlsxFile(file, { sheet: 'BN Labs' }).catch(() => null)
      || await readXlsxFile(file, { sheet: 'Labs' }).catch(() => null);

    if (labSheet && labSheet.length > 1) {
      let headerIdx = labSheet.findIndex((row) =>
        row.some((c) => {
          const s = String(c || '').trim();
          return s === 'BNL Song ID' || s === 'BNL ID' || s === 'Hypothesis';
        })
      );
      if (headerIdx === -1) headerIdx = 0;
      const headers = labSheet[headerIdx].map((h) => String(h || '').trim());
      const isSourceFormat = headers.includes('BNL Song ID');

      labSheet.slice(headerIdx + 1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          const id = String(r['BNL Song ID'] || r['BNL ID'] || '').trim();
          if (!id && !r['Hypothesis']) return;

          // Date from source is MMDDYY string; from our export it's an ISO date/Date object
          const dateRaw = r['Date'];
          const date = isSourceFormat
            ? parseMmddyyDate(dateRaw) || new Date().toISOString()
            : parseDate(dateRaw) || new Date().toISOString();

          const experimentCode = String(r['Experiment ID'] || r['Experiment Code'] || 'EXP001');
          const experimentName = String(r['Experiment Name'] || '');
          const labsGlobalNum = Number(r['Labs Global #']) || 0;

          results.labs.push({
            id,
            internalId: generateUUID(),
            labsGlobalNumber: labsGlobalNum,
            labsGlobalDisplay: String(r['# Display'] || labsGlobalNum).toString().padStart(4, '0'),
            date,
            experimentCode,
            experimentName,
            sunoVersion: String(r['Suno Version'] || r['Suno Ver'] || ''),
            weirdness: Number(r['Weirdness %'] || r['Weirdness']) || 0,
            constraint: Number(r['Constraint %'] || r['Constraint']) || 100,
            stylePrompt: String(r['Style Prompt Used'] || ''),
            lyricPrompt: String(r['Lyric Prompt Used'] || ''),
            tier2Symbols: String(r['Tier 2 Symbols Used'] || ''),
            tier3Applied: parseYesNo(r['Tier 3 Applied']),
            hypothesis: String(r['Hypothesis'] || ''),
            expectedResult: String(r['Expected Result'] || ''),
            actualResult: String(r['Actual Result'] || ''),
            resultCode: r['Result Code'] ? String(r['Result Code']) : null,
            keyFinding: String(r['Key Finding'] || ''),
            integrationStatus: r['Integration Status'] ? String(r['Integration Status']) : null,
            status: String(r['Status'] || 'scheduled'),
            generationNumber: Number(r['Generation #']) || null,
            notes: String(r['Notes'] || ''),
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          results.errors.push(`Labs row ${idx + headerIdx + 2}: ${e.message}`);
        }
      });
    }
  } catch (e) {
    results.errors.push(`File read error: ${e.message}`);
  }

  return results;
}
