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
    'Song Title', 'Suno Version', 'Generation #', 'Delivery Status',
    'Production Notes',
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
    'Suno Version', 'Weirdness', 'Constraint', 'Hypothesis', 'Expected Result',
    'Actual Result', 'Result Code', 'Key Finding', 'Integration Status',
    'Status', 'Tier 3 Applied', 'Notes',
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
        cell(l.hypothesis, bg),
        cell(l.expectedResult, bg),
        cell(l.actualResult, bg),
        cell(l.resultCode, bg),
        cell(l.keyFinding, bg),
        cell(l.integrationStatus, bg),
        cell(l.status, bg),
        cell(l.tier3Applied ? 'Yes' : 'No', bg),
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
        'Lyric Code', 'Vocal Code', 'Song Title', 'Suno Version', 'Generation #', 'Delivery Status',
        'Production Notes']),
      makeHeader(['Name', 'Monthly Cost', 'Annual Cost', 'Due Day', 'Category', 'Auto-Renew',
        'Status', 'Notes', 'Created At']),
      makeHeader(['BNL ID', 'Labs Global #', 'Date', 'Experiment Code', 'Experiment Name',
        'Suno Version', 'Weirdness', 'Constraint', 'Hypothesis', 'Expected Result', 'Actual Result',
        'Result Code', 'Key Finding', 'Integration Status', 'Status', 'Tier 3 Applied', 'Notes']),
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
  return String(val).toLowerCase().trim() === 'yes';
}

function parseDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = row[i] ?? null;
  });
  return obj;
}

export async function importFromExcel(file, { generateUUID }) {
  const results = { commissions: [], subscriptions: [], labs: [], errors: [] };

  try {
    // Read commissions sheet
    const commRows = await readXlsxFile(file, { sheet: 'Commissions' }).catch(() => null);
    if (commRows && commRows.length > 1) {
      const headers = commRows[0].map((h) => String(h || '').trim());
      commRows.slice(1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          if (!r['Customer ID'] && !r['Client Name']) return;
          results.commissions.push({
            id: String(r['Customer ID'] || ''),
            internalId: generateUUID(),
            createdAt: parseDate(r['Created At']) || new Date().toISOString(),
            clientName: String(r['Client Name'] || ''),
            clientEmail: String(r['Email'] || ''),
            clientPhone: String(r['Phone'] || ''),
            commissionType: String(r['Type'] || 'individual'),
            package: String(r['Package'] || ''),
            songCount: Number(r['Songs']) || 1,
            totalPayment: Number(r['Total Payment']) || 0,
            songwriterBuyout: parseYesNo(r['Songwriter Buyout']),
            stage: String(r['Stage'] || 'brief'),
            stageHistory: [{ stage: String(r['Stage'] || 'brief'), timestamp: new Date().toISOString(), userId: 'owner' }],
            isRush: parseYesNo(r['Rush']),
            deliveryDeadline: parseDate(r['Delivery Deadline']),
            deliveredAt: parseDate(r['Delivered At']),
            revisionWindowEnd: parseDate(r['Revision Window End']),
            revisionsIncluded: Number(r['Revisions Included']) || 3,
            revisionsUsed: Number(r['Revisions Used']) || 0,
            revisionPackPurchased: parseYesNo(r['Revision Pack Purchased']),
            revisionPackSessions: 0,
            revisionLog: [],
            songs: [],
            deliveryLink: String(r['Delivery Link'] || ''),
            communicationLog: [],
            followUpDate: parseDate(r['Follow-Up Date']),
            followUpDismissed: parseYesNo(r['Follow-Up Dismissed']),
            briefSummary: String(r['Brief Summary'] || ''),
            genre: String(r['Genre'] || ''),
            vocalType: String(r['Vocal Type'] || ''),
            notes: String(r['Notes'] || ''),
          });
        } catch (e) {
          results.errors.push(`Commissions row ${idx + 2}: ${e.message}`);
        }
      });
    }

    // Read Songs sheet and attach to commissions
    const songRows = await readXlsxFile(file, { sheet: 'Songs' }).catch(() => null);
    if (songRows && songRows.length > 1) {
      const headers = songRows[0].map((h) => String(h || '').trim());
      songRows.slice(1).forEach((row) => {
        const r = rowToObj(headers, row);
        const customerId = String(r['Customer ID'] || '');
        const comm = results.commissions.find((c) => c.id === customerId);
        if (comm) {
          comm.songs.push({
            songId: String(r['Song ID'] || ''),
            globalNumber: Number(r['Global #']) || 0,
            globalDisplay: String(r['Global #'] || '0').padStart(4, '0'),
            styleCode: String(r['Style Code'] || '01'),
            genreCode: String(r['Genre Code'] || '17'),
            lyricCode: String(r['Lyric Code'] || 'L'),
            vocalCode: String(r['Vocal Code'] || 'M'),
            songTitle: String(r['Song Title'] || ''),
            sunoVersion: String(r['Suno Version'] || ''),
            generationNumber: Number(r['Generation #']) || null,
            deliveryStatus: String(r['Delivery Status'] || 'pending'),
            productionNotes: String(r['Production Notes'] || ''),
          });
        }
      });
    }

    // Read Subscriptions sheet
    const subRows = await readXlsxFile(file, { sheet: 'Subscriptions' }).catch(() => null);
    if (subRows && subRows.length > 1) {
      const headers = subRows[0].map((h) => String(h || '').trim());
      subRows.slice(1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          if (!r['Name']) return;
          const monthly = Number(r['Monthly Cost']) || 0;
          results.subscriptions.push({
            id: generateUUID(),
            name: String(r['Name'] || ''),
            monthlyCost: monthly,
            annualCost: monthly * 12,
            dueDate: Number(r['Due Day']) || 1,
            category: String(r['Category'] || 'subscription'),
            autoRenew: parseYesNo(r['Auto-Renew']),
            status: String(r['Status'] || 'active'),
            notes: String(r['Notes'] || ''),
            createdAt: parseDate(r['Created At']) || new Date().toISOString(),
          });
        } catch (e) {
          results.errors.push(`Subscriptions row ${idx + 2}: ${e.message}`);
        }
      });
    }

    // Read Labs sheet
    const labRows = await readXlsxFile(file, { sheet: 'Labs' }).catch(() => null);
    if (labRows && labRows.length > 1) {
      const headers = labRows[0].map((h) => String(h || '').trim());
      labRows.slice(1).forEach((row, idx) => {
        try {
          const r = rowToObj(headers, row);
          if (!r['BNL ID'] && !r['Hypothesis']) return;
          results.labs.push({
            id: String(r['BNL ID'] || ''),
            internalId: generateUUID(),
            labsGlobalNumber: Number(r['Labs Global #']) || 0,
            labsGlobalDisplay: String(r['Labs Global #'] || '0').padStart(4, '0'),
            date: parseDate(r['Date']) || new Date().toISOString(),
            experimentCode: String(r['Experiment Code'] || 'EXP001'),
            experimentName: String(r['Experiment Name'] || ''),
            sunoVersion: String(r['Suno Version'] || ''),
            weirdness: Number(r['Weirdness']) || 0,
            constraint: Number(r['Constraint']) || 100,
            hypothesis: String(r['Hypothesis'] || ''),
            expectedResult: String(r['Expected Result'] || ''),
            actualResult: String(r['Actual Result'] || ''),
            resultCode: r['Result Code'] ? String(r['Result Code']) : null,
            keyFinding: String(r['Key Finding'] || ''),
            integrationStatus: r['Integration Status'] ? String(r['Integration Status']) : null,
            status: String(r['Status'] || 'scheduled'),
            tier3Applied: parseYesNo(r['Tier 3 Applied']),
            notes: String(r['Notes'] || ''),
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          results.errors.push(`Labs row ${idx + 2}: ${e.message}`);
        }
      });
    }
  } catch (e) {
    results.errors.push(`File read error: ${e.message}`);
  }

  return results;
}
