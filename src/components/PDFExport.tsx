import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ContributionSummary {
  totalAmount: number;
  targetAmount: number;
  contributorsCount: number;
  startDate: string;
  endDate: string;
  groupName: string;
  contributions: {
    contributorName: string;
    amount: number;
    date: string;
    transactionId: string;
  }[];
}

export function PDFExport({ summary }: { summary: ContributionSummary }) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${summary.groupName}-contribution-report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end space-x-2">
        <Button onClick={generatePDF} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export as PDF</span>
        </Button>
        <Button onClick={() => window.print()} className="flex items-center space-x-2">
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </Button>
      </div>

      <div ref={reportRef} className="p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{summary.groupName}</h1>
          <h2 className="text-xl text-gray-600">Contribution Summary Report</h2>
          <p className="text-sm text-gray-500">
            {summary.startDate} - {summary.endDate}
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Contributed</p>
              <p className="text-2xl font-bold">KES {summary.totalAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Target Amount</p>
              <p className="text-2xl font-bold">KES {summary.targetAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Contributors</p>
              <p className="text-2xl font-bold">{summary.contributorsCount}</p>
            </div>
          </div>
        </Card>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Contribution Details</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Contributor</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-right py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {summary.contributions.map((contribution, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{contribution.contributorName}</td>
                  <td className="text-right py-2">
                    KES {contribution.amount.toLocaleString()}
                  </td>
                  <td className="text-right py-2">
                    {new Date(contribution.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 text-center mt-8">
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>This is an official contribution report from I-Changa</p>
        </div>
      </div>
    </div>
  );
}
