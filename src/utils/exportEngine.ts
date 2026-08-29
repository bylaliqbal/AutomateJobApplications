import * as XLSX from 'xlsx';
import { MasterJob, MatchScoreExplanation, TailoredDocument } from '../types';

export interface ExportRow {
  'Company Name': string;
  'Job Title': string;
  'Job Link': string;
  'Match Percentage': string;
  'Referrals': string;
  'CV filename': string;
  'Cover Letter filename': string;
  'Sources': string;
  'Date label': string;
  'Status': string;
}

export function generateXlsxReport(
  qualifyingJobs: { job: MasterJob; score: MatchScoreExplanation; document?: TailoredDocument }[]
) {
  // Sort descending by score
  const sorted = [...qualifyingJobs].sort((a, b) => b.score.totalScore - a.score.totalScore);

  const rows: ExportRow[] = sorted.map(({ job, score, document }) => {
    const cleanCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanTitle = job.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');

    const cvName = document?.cvFileName || `CV_${cleanCompany}_${cleanTitle}_${dateStr}.docx`;
    const clName = document?.coverLetterFileName || `CoverLetter_${cleanCompany}_${cleanTitle}_${dateStr}.docx`;

    const sourceNames = job.sources.map(s => s.provider).join(', ');
    const dateLabel = job.sources[0]?.hasReliablePostingDate
      ? `Posted: ${new Date(job.sources[0].postingDate).toLocaleDateString()}`
      : `Discovered: ${new Date(job.sources[0]?.discoveryDate || job.firstDiscoveredAt).toLocaleDateString()}`;

    return {
      'Company Name': job.company,
      'Job Title': job.title,
      'Job Link': job.applicationUrl,
      'Match Percentage': `${score.totalScore}%`,
      'Referrals': job.referralsCount > 0 ? `${job.referralsCount} referral(s) active` : 'None',
      'CV filename': cvName,
      'Cover Letter filename': clName,
      'Sources': sourceNames,
      'Date label': dateLabel,
      'Status': job.status
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 18 }, // Company Name
    { wch: 35 }, // Job Title
    { wch: 45 }, // Job Link
    { wch: 16 }, // Match Percentage
    { wch: 20 }, // Referrals
    { wch: 38 }, // CV filename
    { wch: 45 }, // Cover Letter filename
    { wch: 22 }, // Sources
    { wch: 22 }, // Date label
    { wch: 15 }  // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Qualifying Jobs');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `JobDiscovery_Report_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, fileName);
  return fileName;
}
