'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface InvoiceData {
  bookingId: string;
  orderDate: Date;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  providerName: string;
  serviceType: string;
  serviceDate: Date;
  timeSlot: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  orderId?: string;
  cfPaymentId?: string;
  currency?: string;
}

interface InvoiceProps {
  data: InvoiceData;
  showActions?: boolean;
}

export default function Invoice({ data, showActions = true }: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For now, trigger print which allows "Save as PDF"
    // In future, can integrate with jsPDF or similar library
    window.print();
  };

  const taxRate = 0.18; // 18% GST
  const subtotal = data.amount / (1 + taxRate);
  const taxAmount = data.amount - subtotal;

  return (
    <div className="invoice-container">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container,
          .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Action Buttons */}
        {showActions && (
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end no-print border-b">
            <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleDownload} size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        )}

        {/* Invoice Content */}
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="UrbanEzii Logo"
                width={80}
                height={80}
                className="rounded-lg"
                priority
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">UrbanEzii</h1>
                <p className="text-sm text-gray-600 mt-1">Your Local Service Bridge</p>
                <p className="text-xs text-gray-500 mt-1">GST: 27XXXXX1234X1Z5</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
              <p className="text-sm text-gray-600">
                Invoice #: <span className="font-semibold">{data.bookingId.substring(0, 8).toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Date: <span className="font-semibold">{format(data.orderDate, 'dd MMM yyyy')}</span>
              </p>
              {data.orderId && (
                <p className="text-xs text-gray-500 mt-1">
                  Order ID: {data.orderId}
                </p>
              )}
            </div>
          </div>

          {/* Bill To / Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Bill To */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Bill To:</h3>
              <div className="text-gray-900">
                <p className="font-semibold text-lg">{data.customerName}</p>
                {data.customerEmail && <p className="text-sm mt-1">{data.customerEmail}</p>}
                <p className="text-sm mt-1">{data.customerPhone}</p>
                <p className="text-sm mt-2 text-gray-600">{data.customerAddress}</p>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Service Details:</h3>
              <div className="text-gray-900">
                <p className="font-semibold text-lg">{data.providerName}</p>
                <p className="text-sm mt-1">Service: {data.serviceType}</p>
                <p className="text-sm mt-1">Date: {format(data.serviceDate, 'PPP')}</p>
                <p className="text-sm mt-1">Time: {data.timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Service Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 uppercase">
                    Description
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2">
                    <p className="font-medium text-gray-900">{data.serviceType}</p>
                    <p className="text-sm text-gray-600">
                      Scheduled for {format(data.serviceDate, 'dd MMM yyyy')} at {data.timeSlot}
                    </p>
                    {data.paymentMethod && (
                      <p className="text-xs text-gray-500 mt-1">
                        Payment Method: {data.paymentMethod}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700">
                  <span>GST (18%):</span>
                  <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span>₹{data.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Payment Status</h3>
                <div className="flex items-center gap-2 mt-2">
                  {data.paymentStatus === 'paid' && (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-lg font-semibold text-green-700">PAID</span>
                    </>
                  )}
                  {data.paymentStatus === 'pending' && (
                    <>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-lg font-semibold text-yellow-700">PENDING</span>
                    </>
                  )}
                  {data.paymentStatus === 'failed' && (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-lg font-semibold text-red-700">FAILED</span>
                    </>
                  )}
                </div>
              </div>
              {data.cfPaymentId && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Payment ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-700 mt-1">
                    {data.cfPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Terms & Conditions:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Service provider will arrive at scheduled time</li>
                  <li>• Cancellation charges may apply</li>
                  <li>• Payment is non-refundable after service completion</li>
                </ul>
              </div>
              <div className="text-right">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Need Help?</h4>
                <p className="text-xs text-gray-600">Email: support@urbanezii.com</p>
                <p className="text-xs text-gray-600">Phone: +91 XXXXX XXXXX</p>
                <p className="text-xs text-gray-600 mt-2">Thank you for choosing UrbanEzii!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 text-center">
          <p className="text-sm font-semibold">
            UrbanEzii - Making Local Services Easy
          </p>
          <p className="text-xs mt-1 opacity-90">www.urbanezii.com</p>
        </div>
      </div>
    </div>
  );
}

