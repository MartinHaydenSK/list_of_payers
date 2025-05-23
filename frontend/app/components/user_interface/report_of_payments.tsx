import React from "react";

interface Report {
  date: Date | string;
  amount: number;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    isPayer: boolean;
    dept: number;
  };
}

interface Payload {
  reports?: Report[];
}

export default function ReportOfPayments({ reports }: Payload) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              #
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Dátum
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Suma (€)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports?.map((report, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800">{index + 1}.</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {new Date(report.date).toLocaleDateString("sk-SK")}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {(report.amount / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
